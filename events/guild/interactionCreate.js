const { EmbedBuilder } = require('discord.js')
const path = require('path')
const { Client, GatewayIntentBits, PermissionsBitField, Partials } = require('discord.js');
const botconfig = require('../../config/discordbot/discordconfig.json')
const { databasing, embed_builder } = require('../../handlers/function')
const owners = require('../../config/discordbot/owner.json').owners
module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    try {
      databasing(client, interaction.guild.id)
      await interaction.deferReply({ ephemeral: true })
      const lang = client.lang.get(interaction.guildId, "lang");
      const translation = client.langfiles[lang].events.guild[path.parse(__filename).name];
      const player = client.manager.players.get(interaction.guildId);
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) {
        return interaction.followUp({ embeds: [embed_builder(translation.noCommand, interaction)], ephemeral: true }).catch(err => console.log(err));
      }
      if (client.slashCommands.get(interaction.commandName).mod) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
          return interaction.followUp({ embeds: [embed_builder(translation.modtrue, interaction)] })
      }
      if (client.slashCommands.get(interaction.commandName).botadmin) {
        if (!owners.includes(interaction.user.id))
          return interaction.followUp({ embeds: [embed_builder(translation.botadmin, interaction)] })
      }
      let args = [];
      for (let option of interaction.options.data) {
        if (option.value) {
          if (option.type === "STRING") {
            let value = option.value.trim().split(/ +/);
            args.push(value[0]);
          } else {
            args.push(option.value);
          }
        }
      }
      command.run(client, interaction, args, lang, player);
    } catch (err) {
      console.log(err)
    }
  }
}