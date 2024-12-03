const {
  SlashCommandBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require('discord.js')
const { useAnisaki } = require('../utils/api')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Menampilkan jadwal anime yang tayang pada hari tertentu')
    .addStringOption((option) =>
      option.setName('day').setDescription('masukan nama hari')
    ),
  /**
   * @param {import('discord.js').InteractionResponse} interaction
   */
  run: async ({ interaction }) => {
    try {
      const { data: animes, error } = await useAnisaki()

      await interaction.deferReply()

      if (error) return await interaction.editReply('Terjadi kesalahan')

      const fields = animes.map((anime) => {
        const airingAt = new Date(anime.nextAiringEpisode.airingAt * 1000)
        return {
          name: anime.title.romaji + '. Ep ' + anime.nextAiringEpisode.episode,
          value: `Tayang pada ${airingAt.getHours()}:${airingAt.getMinutes()}`,
        }
      })

      const options = animes.map((anime) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(anime.title.romaji)
          .setValue(JSON.stringify([new Date().getDay(), anime.id.toString()]))
      )

      const select = new StringSelectMenuBuilder()
        .setCustomId('detail-anime')
        .setPlaceholder('Pilih anime')
        .addOptions(...options)

      const row = new ActionRowBuilder().addComponents(select)

      await interaction.editReply({
        embeds: [
          {
            title: 'Anime yang tanyang hari ini',
            fields,
          },
        ],
        components: [row],
      })
    } catch (err) {
      console.log(err)
      await interaction.editReply('Terjadi kesalahan')
    }
  },
}
