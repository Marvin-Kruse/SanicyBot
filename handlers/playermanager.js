const { Manager } = require("erela.js");
const clientID = require('../config/lavalink/spotify.json').ClientID
const clientSecret = require('../config/lavalink/spotify.json').ClientSecretID
const Spotify = require("erela.js-spotify");
const nodes = require('../config/lavalink/settings.json').nodes
module.exports = async (client) => {

    client.manager = new Manager({
        nodes: nodes,
        plugins: [new Spotify({ clientID, clientSecret })],
        send(id, payload) {
            let guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    });

    client.manager.on("nodeConnect", node => {
        console.log(`Node "${node.options.identifier}" connected.`)
    })

    client.manager.on("nodeError", (node, error) => {
        console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
    })

    client.manager.on("queueEnd", player => {
        const channel = client.channels.cache.get(player.textChannel);
        channel.send("Queue has ended.");
        player.destroy();
    });
}