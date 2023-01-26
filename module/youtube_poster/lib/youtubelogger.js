const CronJob = require('cron').CronJob;
const { yt_embed_builder, delay } = require('../../../handlers/function')
const { replaceContents } = require('./Util.js');
const path = require('path')
const { ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');

let cooldown = false;

module.exports = (YTP) => {

    if ((!YTP.options.loop_delays_in_min || !YTP.options.loop_delays_in_min) && YTP.options.loop_delays_in_min != 0) throw new Error("No Loop Delay added (YTP.options.loop_delays_in_min)")
    if (typeof YTP.options.loop_delays_in_min != "number") throw new Error("(YTP.options.loop_delays_in_min) is not a Number")
    var Jobyoutube = new CronJob(`*${YTP.options.loop_delays_in_min == 0 ? "/15" : ""} *${YTP.options.loop_delays_in_min != 0 ? "/" + YTP.options.loop_delays_in_min : ""} * * * *`, async function () {
        if (!cooldown) check();
    }, null, true, 'America/Los_Angeles');
    Jobyoutube.start();

    async function checkVideos(youtubeChannel, ChannelDATA) {
        try {
            let lastVideos = await YTP.getLatestVideos(youtubeChannel);

            if (!lastVideos || !lastVideos[0]) return false;

            if (ChannelDATA.oldvid && (ChannelDATA.oldvid === lastVideos[0].id || ChannelDATA.oldvid.includes(lastVideos[0].id))) return false;
            if (ChannelDATA.alrsent && (ChannelDATA.alrsent.includes(lastVideos[0].id))) return false;
            return lastVideos[0];
        } catch {
            return false;
        }
    }

    async function check() {
        if (!YTP.client.user) {
            console.log(YTP.ytp_log + YTP.warn_log + " User is not online yet, retrying in 5 Seconds".dim.yellow);
            setTimeout(() => {
                cooldown = true;
                check();
            }, 5000)
            return
        }
        cooldown = false;

        var keys = await YTP.YTP_DB.keyArray();
        keys.forEach(async key => {

            var allChannels = await YTP.YTP_DB.get(`${key}`, `channels`);

            if (!allChannels || allChannels.length == 0) return;

            allChannels.forEach(async (ChannelDATA, index) => {
                try {

                    if (!ChannelDATA.YTchannel) return;

                    let channelInfos = await YTP.getChannelInfo(ChannelDATA.YTchannel);

                    if (!channelInfos) return;

                    let video = await checkVideos(channelInfos.url, ChannelDATA);

                    if (!video) return;

                    let DCchannel;
                    try {

                        DCchannel = await YTP.client.channels.cache.get(ChannelDATA.DiscordChannel);

                        if (!DCchannel) {
                            DCchannel = await YTP.client.channels.fetch(ChannelDATA.DiscordChannel);
                        }
                    } catch {
                        await YTP.deleteChannel(ChannelDATA.DiscordGuild, ChannelDATA.YTchannel)
                    }

                    if (!DCchannel) return;
                    const lang = YTP.client.lang.get(ChannelDATA.DiscordGuild, "lang");
                    const translation = YTP.client.langfiles[lang].handlers.youtube_poster.lib[path.parse(__filename).name];
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('Video')
                                .setURL(`${video.link}`)
                                .setStyle(ButtonStyle.Link)

                        );
                    await DCchannel.send({ embeds: [yt_embed_builder(replaceContents(translation.sendermessage, video, channelInfos, ChannelDATA), `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`)], components: [row] });

                    ChannelDATA.oldvid = video.id;

                    await ChannelDATA.alrsent.push(video.id)

                    if (ChannelDATA.alrsent.length > 5) {
                        ChannelDATA.alrsent.pop()
                    }

                    allChannels[index] = ChannelDATA;
                    delay(2)
                    await YTP.YTP_DB.set(`${ChannelDATA.DiscordGuild}`, allChannels, `channels`);
                    delay(2)
                } catch (e) {
                    console.log(e)
                }
            })
        })
    }
}
