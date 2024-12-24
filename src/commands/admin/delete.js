const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-message')
    .setDescription('Hapus pesan yang dikirim oleh bot')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Channel dari pesan yang akan dihapus')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('id_message').setDescription('Id pesan').setRequired(true)
    ),
  devOnly: true,
  run: async ({ interaction }) => {
    const options = interaction.options

    interaction.deferReply({ ephemeral: true })

    try {
      const channel = options.get('channel').channel
      const message = await channel.messages.fetch(
        options.get('id_message').value
      )

      await message.delete()

      interaction.editReply('Berhasil')
    } catch (err) {
      interaction.editReply('Gagal')
    }
  },
}
