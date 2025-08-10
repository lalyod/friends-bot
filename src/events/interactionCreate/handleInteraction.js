const { ActionRowBuilder } = require('discord.js')
const { useAnisakiOne, useAnisaki } = require('../../utils/api.js')
const { StringSelectMenuBuilder } = require('discord.js')
const { StringSelectMenuOptionBuilder } = require('discord.js')

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
        components: [],
      })
    } catch (err) {
      console.log(err)
      await interaction.message.edit({ content: 'Terjadi kesalahan' })
    }
  }

  if (interaction.customId == 'anime_schedule') {
    const values = interaction.values

    if (values === undefined || values.length == 0) {
      interaction.reply(`<@793991682310799360>, tulung error mas.`)
      return
    }

    const dayIndex = parseInt(values[0])
    const { data } = await useAnisaki(dayIndex)

    const embed = {
      title: `> Anime yang tayang hari ${new Date(
        2000,
        0,
        dayIndex
      ).toLocaleString('id-ID', { weekday: 'long' })}`,
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
          `${anime.title.romaji?.substr(0, 94)}${
            anime?.title?.length >= 100 ? '...' : ''
          }`
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
  }

  if (interaction.customId === 'hoyo-redeem-select-game') {
    const values = interaction.values
    let shortcut = ''

    if (values === undefined || values.length == 0) {
      interaction.send(`<@793991682310799360>, tulung error mas.`)
      return
    }

    await interaction.deferUpdate()

    if (values[0] == 'honkai3rd')
      shortcut = 'https://honkaiimpact3.hoyoverse.com'
    else if (values[0] == 'genshin')
      shortcut = 'https://genshin.hoyoverse.com/gift'
    else if (values[0] == 'hkrpg') shortcut = 'https://hsr.hoyoverse.com/gift'
    else if (values[0] == 'nap') shortcut = 'https://zzz.hoyoverse.com/gift'
    else shortcut = 'https://hoyoverse.com'

    try {
      const { codes } = await fetch(
        `https://hoyo-codes.seria.moe/codes?game=${values[0]}`
      ).then((res) => res.json())

      const embed = {
        title: 'Redeem Code',
        description: codes
          .map(
            (code) =>
              `**[${code.code}](${shortcut + '?code=' + code.code})** \n ${code.rewards.trim().length > 0 ? code.rewards : '-'}`
          )
          .reverse()
          .join('\n\n'),
      }

      await interaction.message.edit({ embeds: [embed] })

      setTimeout(async () => {
        await interaction.message.edit({ components: [] })
      }, 1000)
    } catch (err) {
      console.log('Redeem code interaction handler error: ', err)
      await interaction.editReply({
        content: 'Terjadi kesalahan saat mengambil kode redeem. coba lagi',
        ephemeral: true,
      })
    }
  }
}
