const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { useAnisakiOne } = require('../../utils/api')

/**
 *
 * @param {import("discord.js").Interaction} interaction
 */
module.exports = async (interaction) => {
  if (interaction.customId === 'detail-anime') {
    try {
      const { data: anime } = await useAnisakiOne(
        ...JSON.parse(interaction.values[0])
      )

      await interaction.message.edit({
        embeds: [
          {
            title: anime?.title.native,
            fields: [
              { name: anime?.title.romaji, value: '' },
              { name: anime?.title.english, value: '' },
              {
                name: 'Episode',
                value: anime.nextAiringEpisode.episode.toString(),
                inline: true,
              },
              {
                name: 'Jam Tayang',
                value: new Date(
                  anime.nextAiringEpisode.airingAt * 1000
                ).toLocaleString('id-ID', {
                  hour: 'numeric',
                  minute: 'numeric',
                }),
                inline: true,
              },
            ],
            image: { url: anime?.coverImage.large },
          },
        ],
      })
    } catch (err) {
      console.log(err)
      await interaction.message.edit({ content: 'Terjadi kesalahan' })
    }
  }
  if (interaction.customId == 'dandadan-prev') {
    const message = await interaction.message.fetch()

    const embeds = message?.embeds
    if (embeds.length > 0) {
      const panel = parseInt(embeds[0].fields[0]?.value)
      const chapter = parseInt(embeds[0].fields[1]?.value)

      const next = new ButtonBuilder()
        .setCustomId('dandadan-next')
        .setLabel('Selanjutnya')
        .setStyle(ButtonStyle.Primary)
      const prev = new ButtonBuilder()
        .setCustomId('dandadan-prev')
        .setLabel('Sebelumnya')
        .setStyle(ButtonStyle.Primary)

      const row = new ActionRowBuilder().addComponents(prev, next)

      await interaction.message.edit({
        embeds: [
          {
            ...embeds[0],
            fields: [
              { name: 'Panel', value: panel - 1, inline: true },
              { name: 'Chapter', value: chapter, inline: true },
            ],
            image: {
              url: `https://cdn.readkakegurui.com/file/cdnpog/dandadan/chapter-${chapter}/${panel - 1}.webp`,
            },
          },
        ],
        components: [row],
      })
    }
  }
  if (interaction.customId == 'dandadan-next') {
    const message = await interaction.message.fetch()

    const embeds = message?.embeds
    if (embeds.length > 0) {
      const panel = parseInt(embeds[0].fields[0]?.value)
      const chapter = parseInt(embeds[0].fields[1]?.value)

      const next = new ButtonBuilder()
        .setCustomId('dandadan-next')
        .setLabel('Selanjutnya')
        .setStyle(ButtonStyle.Primary)
      const prev = new ButtonBuilder()
        .setCustomId('dandadan-prev')
        .setLabel('Sebelumnya')
        .setStyle(ButtonStyle.Primary)

      const row = new ActionRowBuilder().addComponents(prev, next)

      await interaction.message.edit({
        embeds: [
          {
            ...embeds[0],
            fields: [
              {
                name: 'Panel',
                value: (panel >= 19 ? 0 : panel) + 1,
                inline: true,
              },
              {
                name: 'Chapter',
                value: panel >= 19 ? chapter + 1 : chapter,
                inline: true,
              },
            ],
            image: {
              url: `https://cdn.readkakegurui.com/file/cdnpog/dandadan/chapter-${panel >= 19 ? chapter + 1 : chapter}/${(panel >= 19 ? 0 : panel) + 1}.webp`,
            },
          },
        ],
        components: [row],
      })
    }
  }
}
