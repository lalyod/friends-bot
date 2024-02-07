const {SlashCommandBuilder} = require('discord.js');

module.exports =  {
  data: new SlashCommandBuilder()
    .setName('simulate-join')
    .setDescription('Simulates a user joining the server.')
    .addUserOption(option => option.setName('user')
                  .setDescription('target-user')),
  run: async ({interaction, client}) => {
    client.emit('guildMemberAdd', interaction.guild.members
                .cache.get(interaction.options.get('user').value));

    interaction
      .reply({content: 'Berhasil mengsimulasi', emepheral: true});
  }
}