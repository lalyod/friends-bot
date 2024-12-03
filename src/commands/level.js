const { InteractionResponse, SlashCommandBuilder } = require('discord.js')
const Level = require('../models/Level')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Menampilkan level')
    .addStringOption((option) =>
      option.setName('target-user').setDescription('Mention member')
    ),
  /**
   * @param {InteractionResponse} interaction
   */
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply('Command hanya bisa di jalankan di server')
      return
    }

    try {
      await interaction.deferReply()

      const mentionUserId = interaction.options
        .get('target-user')
        ?.value.replace('@', '')
        .replace('<', '')
        .replace('>', '')
      const targetUserId = mentionUserId || interaction.member.id

      const [fetchRank, fetchLevel, targetUserObj] = await Promise.all([
        Level.find({ guildId: interaction.guild.id }).sort({ level: -1 }),
        Level.findOne({
          userId: targetUserId,
          guildId: interaction.guild.id,
        }),
        interaction.guild.members.fetch(targetUserId),
      ])
      const rank = fetchRank.findIndex((rank) => rank.userId === targetUserId)

      if (!fetchLevel) {
        await interaction.editReply(
          mentionUserId
            ? `${targetUserObj.user.tag} Belum memiliki level sama sekali`
            : 'Kamu belum memiliki level '
        )
        return
      }

      await interaction.editReply({
        embeds: [
          {
            title: 'Info  ' + targetUserObj.displayName,
            thumbnail: { url: targetUserObj.user.displayAvatarURL() },
            fields: [
              { name: 'Rank', value: rank, inline: true },
              { name: 'Level', value: fetchLevel.level, inline: true },
              { name: 'XP', value: fetchLevel.xp },
            ],
          },
        ],
      })
    } catch (err) {
      await interaction.channel.send(
        'Telah terjadi kesalahan, silahkan coba lagi'
      )
    }
  },
}
