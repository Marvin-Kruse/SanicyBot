const fs = require('fs')
const Discord = require('discord.js')
const DiscordBotConfig = require('../config/discordbot/discordconfig.json')
const moduleconfig = require('../config/modules/settings.json')

module.exports = async (client) => {
  /**
   * @info 
   * Erstellt die Collection für die Commands
   */
  client.slashCommands = new Discord.Collection();

  /**
   * @info 
   * Diese Funktion läd die Commands in die Collection rein
   */
  fs.readdirSync("./commands/").forEach((dir) => {

    const commands = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
    for (let file of commands) {
      let pull = require(`../commands/${dir}/${file}`);
      if (pull.name) {
        try {
          client.slashCommands.set(pull.name, pull);
        } catch (err) {
          console.log(err)
        }
      } else {
        console.log(pull, "FEHLER")
        continue;
      }
    }
  });

  /**
   * @info
   * Dies Ladet die Events im Events Ordner
   */
  let allevents = []
  try {
    const load_dir = (dir) => {
      const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
      for (const file of event_files) {
        const event = require(`../events/${dir}/${file}`)
        let eventName = file.split(".")[0];
        allevents.push(eventName);
        client.on(eventName, event.bind(null, client));
      }
    }
    await ["client", "guild"].forEach(e => load_dir(e));
    for (let i = 0; i < allevents.length; i++) {
      try {
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }

  if (moduleconfig.antiraid.start) {
    const AntiRaid = require('../module/AntiRaid/index')
    const AR = AntiRaid(client)
    AR.start()
  }


  client.login(DiscordBotConfig.token)
}