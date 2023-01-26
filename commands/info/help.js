const { embed_builder } = require('../../handlers/function')
const path = require('path');
const Canvas = require('canvas')
const { AttachmentBuilder } = require('discord.js')
module.exports = {
    name: "help",
    description: "help command",
    run: async (client, interaction, args, lang, player) => {
        const translation = client.langfiles[lang].commands.info[path.parse(__filename).name];

        client.shard.fetchClientValues('guilds.cache.size').then(async server => {
            client.shard.fetchClientValues('users.cache.size').then(async users => {
                const canvas = Canvas.createCanvas(600, 240)
                const ctx = canvas.getContext("2d")

                const image = await Canvas.loadImage('https://www.unequal-bot.eu/Unequal.png')
                ctx.drawImage(image, 0, 0)

                ctx.font = '30px Impact'
                ctx.fillStyle = "#FFFFF9"
                ctx.fillText(server + " Server's", 80, 146)
                ctx.font = '30px Impact'
                ctx.fillStyle = "#FFFFF9"
                ctx.fillText(users + " users's", 80, 214)


                const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image-help.png' })
                interaction.followUp({ files: [attachment] })

            })
        })

    }
}