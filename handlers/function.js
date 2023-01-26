const { EmbedBuilder } = require("discord.js");
const MessageSettings = require('../config/discordbot/message_settings.json')


module.exports.embed_builder = embed_builder
module.exports.databasing = databasing
module.exports.playercreate = playercreate
module.exports.delay = delay
module.exports.yt_embed_builder = yt_embed_builder
module.exports.ownerdatabasing = ownerdatabasing
module.exports.replaceContents = replaceContents


function databasing(client, guildid, userid) {
  try {
    if (guildid) {
      client.lang.ensure(guildid, require('../config/discordbot/message_settings.json').lang, 'lang')
    }
  } catch {

  }
}

function ownerdatabasing(client, ownerkey) {
  try {
    if (ownerkey) {
      client.owner.ensure(ownerkey, {
        yt: false
      })
    }
  } catch { }
}

function embed_builder(text, interaction, img) {
  let embed
  if (img) {
    embed = new EmbedBuilder()
      .setTitle((MessageSettings.embed.title).replace("{GUILD_NAME}", `${interaction.guild.name}`))
      .setDescription(text)
      .setImage(img)
      .setColor(MessageSettings.embed.color)
  } else {
    embed = new EmbedBuilder()
      .setTitle((MessageSettings.embed.title).replace("{GUILD_NAME}", `${interaction.guild.name}`))
      .setDescription(text)
      .setColor(MessageSettings.embed.color)
  }
  return embed
}
function yt_embed_builder(text, img) {
  embed = new EmbedBuilder()
    .setTitle(('Youtube Message'))
    .setDescription(text)
    .setImage(img)
    .setColor('#FF0000')

  return embed
}

function playercreate(client, interaction, volume) {
  let playervolume = volume;
  if (!volume) playervolume = 50
  let player = client.manager.create({
    guild: interaction.guild.id,
    voiceChannel: interaction.member.voice.channel.id,
    textChannel: interaction.channel.id,
    selfDeafen: true,
    volume: Number(playervolume) ? playervolume : 50
  });
  return player;
};

function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (err) {
    logger(err, "err");
  }
};

function replaceContents(txt, interaction) {
  return String(txt)
    .replace(`{SPACE}`, `\n\n`)
    .replace(`{SPACE}`, `\n\n`)
    .replace(`{SPACE}`, `\n\n`)
}