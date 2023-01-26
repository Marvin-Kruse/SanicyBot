
const Parser = require("rss-parser");
const parser = new Parser();
const colors = require("colors")
const YoutubeLogger = require('./youtubelogger.js');
const Util = require('./Util.js');
const CI = require('./channelInfo.js');
const Enmap = require("enmap");

class YoutubePoster {

    constructor(client, options) {

        this.ytp_log = `Unequal - Youtube Poster Function`.dim.red;
        this.warn_log = `[WARN] `.yellow;
        this.info_log = `[INFO] `.cyan;

        if (!client) {
            throw new Error("No Valid DiscordClient Added")
        }
        this.client = client;
        this.options = {
            loop_delays_in_min: 5,
            defaults: {
                Notification: "<@{discorduser}> Posted: **{videotitle}**, as \`{videoauthorname}\`\n{videourl}"
            },
        }


        if (!this.constructor && !this.constructor.name) {
            throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
        }

        this.YTP_DB = new Enmap({ name: "Discord-Youtube-Poster", dataDir: './database/yt' })

        console.log('Youtube Feature is Loading, Youtube Logger Check is: true');

        YoutubeLogger(this)
    }

    checkOptions(options) {
        if (options) {
            if (options.loop_delays_in_min || options.loop_delays_in_min == 0) {
                if (typeof options.loop_delays_in_min != "number") throw new SyntaxError(`${`options.loop_delays_in_min`.bold}must be a NUMBER, you provided: ${`${typeof options.loop_delays_in_min}`.bold}`)
                let dela = Number(options.loop_delays_in_min)
                if (dela < 0) throw new SyntaxError(`${`options.loop_delays_in_min`.bold} must be ${`BIGGER or EQUAL then 0`.bold}, you provided: ${`${options.loop_delays_in_min}`.bold}`)
                if (dela > 59) throw new SyntaxError(`${`options.loop_delays_in_min`.bold} must be ${`SMALLER then 0`.bold}, you provided: ${`${options.loop_delays_in_min}`.bold}`)

                dela = Math.round(dela);

                this.options.loop_delays_in_min = dela;
                console.log(this.ytp_log + this.info_log + `Using custom ${`options.loop_delays_in_min`.bold}: ${this.options.loop_delays_in_min} ${this.options.loop_delays_in_min == 0 ? "\n" + this.ytp_log + this.info_log + "Tho it's 0, it will only check every 15 Seconds, otherwise you would spam to MUCH!".dim.yellow : ""}`.dim.green);
            }
            if (options.defaults) {
                if (options.defaults.Notification) {
                    this.options.defaults.Notification = options.defaults.Notification;
                    console.log(this.ytp_log + this.info_log + `Using custom ${`options.defaults#Notification`.bold}: ${this.options.defaults.Notification}`.dim.green);
                }
            }
            return this;
        } else {
            return this;
        }
    }


    async setChannel(ChannelLink, DiscordChannel, DiscordUser, Notification = this.options.defaults.Notification, preventDuplicates = true) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                if (!DiscordChannel || !DiscordChannel.guild || !DiscordChannel.id) return rej("A DiscordChannel with Guild Information is required!");
                if (!this.YTP_DB.has(DiscordChannel.guild.id)) {
                    this.YTP_DB.ensure(DiscordChannel.guild.id, {
                        channels: []
                    });
                }
                let channels = this.YTP_DB.get(`${DiscordChannel.guild.id}`, `channels`);
                let CHdata = channels.find(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                if (preventDuplicates && CHdata) {
                    rej(`Channel already setup for the Guild: ${DiscordChannel.guild.id} yet:\n` + JSON.stringify(CHdata, null, 3))
                    return;
                }
                let newChannelData = {
                    YTchannel: ChannelLink,
                    DiscordGuild: DiscordChannel.guild.id,
                    DiscordChannel: DiscordChannel.id,
                    DiscordUser: DiscordUser ? DiscordUser.id : "",
                    oldvid: "",
                    alrsent: [],
                    message: Notification
                }
                channels.push(newChannelData)
                this.YTP_DB.set(`${DiscordChannel.guild.id}`, channels, `channels`);
                let data = this.YTP_DB.get(`${DiscordChannel.guild.id}`, `channels`);
                var Obj = {};
                Obj = newChannelData;
                Obj.allChannels = data;
                return res(Obj);
            } catch (error) {
                return rej(error);
            }
        })
    }


    async getChannelInfo(ChannelLink) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                let channel = await CI.channelInfo(ChannelLink);
                if (!channel) return rej("NO INFORMATION FOUND")
                return res(channel);
            } catch (error) {
                return rej(error);
            }
        })
    }

    async getLatestVideos(ChannelLink) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                let channel = await CI.channelInfo(ChannelLink);
                if (!channel) return rej("NO CHANNEL INFORMATION FOUND")
                let content = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`);
                content = content.items.map(v => {
                    var OBJ = {}
                    OBJ.title = v.title
                    OBJ.link = v.link
                    OBJ.pubDate = v.pubDate
                    OBJ.author = v.author
                    OBJ.id = v.link.split("watch?v=")[1] || v.id,
                        OBJ.isoDate = v.isoDate
                    return OBJ;
                })
                let tLastVideos = content.sort((a, b) => {
                    let aPubDate = new Date(a.pubDate || 0).getTime();
                    let bPubDate = new Date(b.pubDate || 0).getTime();
                    return bPubDate - aPubDate;
                });
                if (tLastVideos.length == 0) return rej("No Videos posted yet")
                return res(tLastVideos);
            } catch (error) {
                return rej(error);
            }
        })
    }

    async getChannel(DiscordGuildID, ChannelLink) {
        return new Promise(async (res, rej) => {
            try {
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                if (!this.YTP_DB.has(DiscordGuildID)) {
                    this.YTP_DB.ensure(DiscordGuildID, {
                        channels: []
                    });
                }
                let channels = this.YTP_DB.get(`${DiscordGuildID}`, `channels`);
                let CHdata = channels.find(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                if (!CHdata) {
                    CHdata = "Channel not setup yet";
                    return rej(CHdata);
                }
                return res(CHdata);
            } catch (error) {
                return rej(error);
            }
        })
    }

    async getChannels4User(DiscordGuildID, DiscordUser) {
        return new Promise(async (res, rej) => {
            try {
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                if (!DiscordUser || !DiscordUser.id) return rej("No User with a Valid ID added for DiscordUser");
                if (!this.YTP_DB.has(DiscordGuildID)) {
                    this.YTP_DB.ensure(DiscordGuildID, {
                        channels: []
                    });
                }
                let channels = this.YTP_DB.get(`${DiscordGuildID}`, `channels`);
                let CHdata = channels.filter(v => v.DiscordUser == DiscordUser.id)
                if (!CHdata || CHdata.length == 0) {
                    CHdata = "User has no Channels";
                    return rej(CHdata);
                }
                return res(CHdata);
            } catch (error) {
                return rej(error);
            }
        })
    }


    async editChannel(ChannelLink, DiscordChannel, DiscordUser, Notification = this.options.defaults.Notification) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                if (!DiscordChannel || !DiscordChannel.guild || !DiscordChannel.id) return rej("A DiscordChannel with Guild Information is required!");
                if (!this.YTP_DB.has(DiscordChannel.guild.id)) {
                    this.YTP_DB.ensure(DiscordChannel.guild.id, {
                        channels: []
                    });
                }
                let channels = this.YTP_DB.get(`${DiscordChannel.guild.id}`, `channels`);
                let CHdata = channels.find(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                let index = channels.findIndex(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                if (!CHdata) {
                    rej("Channel not setup yet")
                    return;
                }
                let newCHdata = {
                    YTchannel: ChannelLink,
                    DiscordGuild: DiscordChannel.guild.id,
                    DiscordChannel: DiscordChannel.id,
                    DiscordUser: DiscordUser ? DiscordUser.id : "",
                    oldvid: CHdata.oldvid,
                    alrsent: CHdata.alrsent,
                    message: Notification
                }

                channels[index] = newCHdata;

                this.YTP_DB.set(`${DiscordChannel.guild.id}`, channels, `channels`);
                let data = this.YTP_DB.get(`${DiscordChannel.guild.id}`, `channels`);
                var Obj = {};
                Obj = newCHdata;
                Obj.allChannels = data;
                Obj.beforeEditChannel = CHdata;
                return res(Obj);
            } catch (error) {
                return rej(error);
            }
        })
    }

    async deleteChannel(DiscordGuildID, ChannelLink) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                if (!this.YTP_DB.has(DiscordGuildID)) {
                    this.YTP_DB.ensure(DiscordGuildID, {
                        channels: []
                    });
                }
                let channels = this.YTP_DB.get(`${DiscordGuildID}`, `channels`);
                let CHdata = channels.find(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                let index = channels.findIndex(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                if (!CHdata) {
                    rej("Channel not setup yet")
                    return;
                }

                channels.splice(index, 1);

                this.YTP_DB.set(`${DiscordGuildID}`, channels, `.channels`);
                let data = this.YTP_DB.get(`${DiscordGuildID}`, `channels`);
                var Obj = {};
                Obj.allChannels = data;
                Obj.deletedChannel = CHdata;
                return res(Obj);
            } catch (error) {
                return rej(error);
            }
        })
    }

    async getAllChannels(DiscordGuildID) {
        return new Promise(async (res, rej) => {
            try {
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                if (!this.YTP_DB.has(DiscordGuildID)) {
                    this.YTP_DB.ensure(DiscordGuildID, {
                        channels: []
                    });
                }
                let channels = this.YTP_DB.get(`${DiscordGuildID}`, `channels`);
                return res(channels);
            } catch (error) {
                return rej(error);
            }
        })
    }


    async deleteAllChannels(DiscordGuildID) {
        return new Promise(async (res, rej) => {
            try {
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                let olddata = this.YTP_DB.get(`${DiscordGuildID}`, `channels`);
                this.YTP_DB.set(DiscordGuildID, {
                    channels: []
                });
                let data = this.YTP_DB.get(`${DiscordGuildID}`, `channels`);
                const Obj = {};
                Obj.allChannels = data;
                Obj.deletedChannels = olddata;
                return res(Obj);
            } catch (error) {
                return rej(error);
            }
        })
    }
}
module.exports = YoutubePoster;
