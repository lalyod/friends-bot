const { SlashCommandBuilder } = require('discord.js');
const leave = require('../../utils/leave')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('simulate-canvas')
    .setDescription('Menampil canvas'),
  devOnly: true,
  run: async ({interaction, client}) => {
    interaction.reply({
      files: [await leave(interaction.member, client)],
      emepheral: true
    })
  }
}