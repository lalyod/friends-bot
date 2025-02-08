const { StringSelectMenuBuilder } = require('discord.js')
const { ActionRowBuilder } = require('discord.js')
const { StringSelectMenuOptionBuilder } = require('discord.js')
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jadwal_anime')
    .setDescription('Lihat jadwal anime.'),
  run: async ({ interaction }) => {
    const embed = {
      title: 'Jadwal Anime',
      description:
        'Silahkan pilih hari terlebih dahulu untuk melihat jadwal anime.',
    }

    const days = Array.from({ length: 7 }, (_, i) => ({
      name: new Date(new Date().getFullYear(), 0, i).toLocaleString('id-ID', {
        weekday: 'long',
      }),
      value: i.toString(),
    }))

    const options = days.map((day) =>
      new StringSelectMenuOptionBuilder().setLabel(day.name).setValue(day.value)
    )

    const select = new StringSelectMenuBuilder()
      .setCustomId('anime_schedule')
      .setPlaceholder('Pilih hari')
      .addOptions(...options)

    const row = new ActionRowBuilder().addComponents(select)

    interaction.reply({ embeds: [embed], components: [row] })

    console.log(
      `[${new Date().toString()}] ${interaction.member.id} use command /jadwal_anime `
    )
  },
}
