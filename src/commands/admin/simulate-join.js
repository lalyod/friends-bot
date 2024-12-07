const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('simulate-join')
    .setDescription('Simulates a user joining the server.')
    .addUserOption((option) =>
      option.setName('user').setDescription('target-user').setRequired(true)
    ),
  run: async ({ interaction, client }) => {
    try {
      const user = interaction.options.get('user').value
      const member = interaction.guild.members.cache.get(user)
      client.emit('guildMemberAdd', member)

      await interaction.reply({
        content: 'Berhasil mengsimulasi',
        emepheral: true,
      })
    } catch (err) {
      const dev = await client.users.fetch(process.env.BOT_DEV_ID)
      dev.send({ content: `\`${err.message}\`` })

      await interaction.reply({
        content: 'Sorry sedang terjadi masalah, silahkan contact developer',
      })
    }
  },
}

