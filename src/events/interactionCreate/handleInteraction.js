const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { useAnisakiOne, useAnisaki } = require('../../utils/api')
const { StringSelectMenuBuilder } = require('discord.js')
const { StringSelectMenuOptionBuilder } = require('discord.js')

/**
 *
 * @param {import("discord.js").Interaction} interaction
 */
module.exports = async (interaction) => {
  if (interaction.customId === 'detail-anime') {
    console.log(
      `[${new Date().toString()}] handling interaction 'detail-anime' started`
    )

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
                value: anime?.nextAiringEpisode.episode.toString(),
                inline: true,
              },
              {
                name: 'Jam Tayang',
                value: new Date(
                  anime?.nextAiringEpisode.airingAt * 1000
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
        components: []
      })

    console.log(
      `[${new Date().toString()}] handling interaction 'detail-anime' completed successfully`
    )
    } catch (err) {
      console.log(err)
      await interaction.message.edit({ content: 'Terjadi kesalahan' })
    }
  }

  if (interaction.customId == 'anime_schedule') {
    console.log(
      `[${new Date().toString()}] handling command /jadwal_anime started`
    )

    const values = interaction.values

    if (values === undefined || values.length == 0) {
      interaction.reply(`<@793991682310799360>, tulung error mas.`)
      console.log(
        `[${new Date().toString()}] handling command /jadwal_anime failed`
      )
      return
    }

    const dayIndex = parseInt(values[0])
    const { data } = await useAnisaki(dayIndex)

    const embed = {
      title: `> Anime yang tayang hari ${new Date(2000, 0, dayIndex).toLocaleString('id-ID', { weekday: 'long' })}`,
      fields: data?.map((anime) => ({
        name: `**${anime?.title?.romaji}**, Ep ${anime?.nextAiringEpisode?.episode}`,
        value: new Date(
          anime?.nextAiringEpisode?.airingAt * 1000
        ).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }),
      })),
    }

    const options = data?.map((anime) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(
          `${anime.title.romaji?.substr(0, 94)}${anime?.title?.length >= 100 ? '...' : ''}`
        )
        .setValue(JSON.stringify([dayIndex, anime.id.toString()]))
    )

    const select = new StringSelectMenuBuilder()
      .setCustomId('detail-anime')
      .setPlaceholder('Lihat anime')
      .addOptions(...options)

    const row = new ActionRowBuilder().addComponents(select)

    interaction.channel.send({ embeds: [embed], components: [row] })
    interaction.message.delete()

    console.log(
      `[${new Date().toString()}] handling command /jadwal_anime completed successfully`
    )
  }
}
