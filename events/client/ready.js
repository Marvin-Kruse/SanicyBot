const YoutubePoster = require('../../module/youtube_poster/index')
const webconfig = require('../../config/api/settings.json')
const ownerkey = require('../../config/owner/settings.json').ownerkey
const { ownerdatabasing } = require('../../handlers/function')
const mysqlconfig = require('../../config/mysql/settings.json')
module.exports = async (client) => {

    // let data = [];
    // for (let cmd of client.slashCommands) {
    //     if (cmd[1].options) data.push({ name: cmd[1].name, description: cmd[1].description, options: cmd[1].options });
    //     else data.push({ name: cmd[1].name, description: cmd[1].description });
    // }
    // console.log(`${data.length} Commands gefunden!`);
    // await client.application.commands.set(data);
    // console.log(`Slash Commands wurden geladen!`);


    ownerdatabasing(client, ownerkey)
    client.shard.fetchClientValues('guilds.cache.size').then(server => {
        if (webconfig.start) {
            require('./api/index')(client)
            console.table({
                api: webconfig.start,
                bot: client.user.tag,
                shard_servers: `${server}`,
                shard_id: client.shard.ids[0]
            })
        } else {
            console.table({
                api: webconfig.start,
                bot: client.user.tag,
                shard_servers: `${server}`,
                shard_id: client.shard.ids[0]
            })
        }
    })

    client.user.setPresence({ type: 'WATCHING', status: 'online', activities: [{ name: '/help' }] });
    client.manager.init(client.user.id)
    const options = {
        loop_delays_in_min: 1,
    };
    if (client.owner.get(ownerkey, 'yt')) {
        client.YTP = new YoutubePoster(client, options)
    } else {
        console.log('Youtube Feature is Loading, Youtube Logger Check is: ' + client.owner.get(ownerkey, 'yt'))
    }
    /**
     * @param Loading the MYSQL Function
     */
    if (mysqlconfig.login) {
        require('../../handlers/mysql/index')
    }
}