const { InteractionResponse, SlashCommandBuilder } = require('discord.js')
const Level = require('../models/Level')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Menampilkan level anda/orang lain')
    .addMentionableOption((option) =>
      option.setName('user').setDescription('Orang yang ingin dilihat levelnya')
    ),
  /**
   * @param {InteractionResponse} interaction
   */
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply('Command hanya bisa di jalankan di server')
      return
    }

    await interaction.deferReply()

    try {
      const options = interaction.options

      const user = options.get('user')?.user ?? interaction.member.user

      const level = await Level.findOne({
        userId: user.id,
      })

      if (!level) {
        await interaction.editReply(
          options.get('user')
            ? `${user.tag} Belum memiliki level sama sekali`
            : 'Kamu belum memiliki level '
        )
        return
      }

      await interaction.editReply({
        embeds: [
          {
            description: `Saat ini kamu Level ${level.level}. Saat init xp kamu ${level.xp}.\n Jangan lupa sering-sering chat dan voice untuk naik level`,
            thumbnail: { url: user.displayAvatarURL() },
          },
        ],
      })
    } catch (err) {
      console.log(err)
      await interaction.editReply(
        'Telah terjadi kesalahan, silahkan coba lagi'
      )
    }
  },
}
