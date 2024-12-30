const {
  SlashCommandBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require('discord.js')
const { useAnisaki } = require('../utils/api')

const choices = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(new Date().getFullYear(), 0, i)
  return {
    name: date.toLocaleString('id-ID', { weekday: 'long' }),
    value: i.toString(),
  }
})

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Menampilkan jadwal anime yang tayang pada hari tertentu')
    .addStringOption((option) =>
      option
        .setName('day')
        .setDescription('masukan nama hari')
        .addChoices(...choices)
    ),
  /**
   * @param {import('discord.js').InteractionResponse} interaction
   */
  run: async ({ interaction }) => {
    try {
      const option = interaction.options.getString('day')
      const { data: animes, error } = await useAnisaki(
        !option ? new Date().getDay() : parseInt(option)
      )

      await interaction.deferReply()

      if (error) return await interaction.editReply('Terjadi kesalahan')

      const fields = animes?.map((anime) => {
        const airingAt = new Date(anime.nextAiringEpisode.airingAt * 1000)
        return {
          name: '> ' + anime.title.romaji + ' Ep ' + anime.nextAiringEpisode.episode,
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

      const date = new Date()

      await interaction.editReply({
        embeds: [
          {
            title:
              'Jadwal anime hari ' +
              new Date(
                date.getFullYear(),
                0,
                option ? parseInt(option) : date.getDay()
              ).toLocaleString('id-ID', {
                weekday: 'long',
              }),
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
