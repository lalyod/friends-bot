const { SlashCommandBuilder, InteractionResponse } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Butuh bantuan tentang server?. gunakan command ini'),
  /**
   * @param {Interaction} interaction
   */
  run: async ({ interaction }) => {
    interaction.reply({
      embeds: [
        {
          title: 'Tunggu ya!',
          description:
            'Command sedang dalam pengembangan, jadi mohon ditunggu.',
          image: {
            url: 'https://static.wikia.nocookie.net/houkai-star-rail/images/f/fa/Sticker_PPG_18_Slumbernana_Monkey_03.png/revision/latest?cb=20241023134338',
          },
        },
      ],
    })
  },
}
