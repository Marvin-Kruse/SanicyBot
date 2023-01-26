const fs = require('fs')
const enmap = require('enmap')
const logsystem = require('./startlog')
class AntiRaid {
    constructor(client, currentpath) {
        let consolestart = 'Unequal - Antiraid: '
        if (!client) {
            return console.log(`${consolestart}`.cyan + 'client undefined'.red)
        }
        if (client) {
            console.log(`${consolestart}`.cyan + 'AntiRaid started'.green)
            console.log()
        }
        
        client.systemstartunequal = new enmap({
            name: 'systemstartunequal',
            dataDir: currentpath + '/data/systemstartunequal'
        })

        client.channelCreate = new enmap({
            name: 'channelCreate',
            dataDir: currentpath + '/data/channelCreate'
        })

        client.channelDelete = new enmap({
            name: 'channelDelete',
            dataDir: currentpath + '/data/channelDelete'
        })

        client.guildBanAdd = new enmap({
            name: 'guildBanAdd',
            dataDir: currentpath + '/data/guildBanAdd'
        })

        client.guildBanRemove = new enmap({
            name: 'guildBanRemove',
            dataDir: currentpath + '/data/guildBanRemove'
        })

        client.guildMemberAdd = new enmap({
            name: 'guildMemberAdd',
            dataDir: currentpath + '/data/guildMemberAdd'
        })

        client.messageCreate = new enmap({
            name: 'messageCreate',
            dataDir: currentpath + '/data/messageCreate'
        })

        client.roleCreate = new enmap({
            name: 'roleCreate',
            dataDir: currentpath + '/data/roleCreate'
        })

        client.roleDelete = new enmap({
            name: 'roleDelete',
            dataDir: currentpath + '/data/roleDelete'
        })

        client.threadCreate = new enmap({
            name: 'threadCreate',
            dataDir: currentpath + '/data/threadCreate'
        })

        client.threadDelete = new enmap({
            name: 'threadDelete',
            dataDir: currentpath + '/data/threadDelete'
        })
        logsystem(client)

        this.startlog = consolestart
        this.client = client
        this.currentpath = currentpath
    }
    async start() {
        let allevents = []
        try {
            const event_files = fs.readdirSync(this.currentpath + `/lib`).filter((file) => file.endsWith(".js"));
            for (const file of event_files) {
                const event = require(`../lib/${file}`)
                let eventName = file.split(".")[0];
                allevents.push(eventName);
                console.log(`${this.startlog}`.cyan + `${eventName}`.green)
                this.client.on(eventName, event.bind(null, this.client));
            }
            console.log();
        } catch (err) {
            console.log(`${this.startlog}`.cyan + `${err}`.red);
        }
    }
}
module.exports = AntiRaid;