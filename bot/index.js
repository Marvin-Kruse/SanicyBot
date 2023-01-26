const { Client, GatewayIntentBits, PermissionsBitField, Partials } = require('discord.js');
const enmap = require('enmap')
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
    allowedMentions: {
        parse: ["users", "roles"], repliedUser: true
    },
})

client.langfiles = {};
let langs = fs.readdirSync("./lang")
for (let lang of langs.filter(file => file.endsWith(".json"))) {
    client.langfiles[`${lang.replace(".json", "")}`] = require(`../lang/${lang}`);
}
Object.freeze(client.langfiles);

client.lang = new enmap({
    name: "lang",
    dataDir: "./database/lang"
})


client.owner = new enmap({
    name: "owner",
    dataDir: "./database/owner"
})
require('../handlers/manager')(client)
require('../handlers/playermanager')(client)