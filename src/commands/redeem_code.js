const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('redeem_code')
    .setDescription('Daftar redeem code game hoyo yang beredar saat ini.'),
  run: async ({ interaction }) => {
    const embed = {
      title: 'Hoyo Redeem Code',
      description: 'Silahkan pilih game terlebih dahulu.',
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId('hoyo-redeem-select-game')
      .setPlaceholder('Pilih game')
      .setOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Honkai Impact 3rd')
          .setValue('honkai3rd'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Genshin Impact')
          .setValue('genshin'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Honkai Star Rail')
          .setValue('hkrpg'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Zenless Zone Zero')
          .setValue('nap')
      )

    const row = new ActionRowBuilder().addComponents(select)

    interaction.reply({ embeds: [embed], components: [row] })
  },
}
