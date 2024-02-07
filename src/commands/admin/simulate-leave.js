const {SlashCommandBuilder} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('simulate-leave')
    .setDescription('Mentrigger leave event')
    .addUserOption(option => option.setName('user')
                  .setDescription('target-user')),
  devOnly: true,
  run: async ({interaction, client}) => {
  let user = interaction.guild.members.cache
    .get(interaction.options.get('user').value);
  
  client.emit('guildMemberRemove', user);

  interaction
    .reply({content: 'Berhasil mengsimulasi', emepheral: true});


  delete user;
  }
}