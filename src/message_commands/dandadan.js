const {
  Message,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js')

/**
 * @param {Message} message
 * @param {string} args
 */
const danDanDan = async (message, args) => {
  const chapter = parseInt(args[0] ?? '1')

  const waitMessage = await message.reply('Tunggu sebentar sedang prosess...')

  const next = new ButtonBuilder()
    .setCustomId('dandadan-next')
    .setLabel('Selanjutnya')
    .setStyle(ButtonStyle.Primary)
  const prev = new ButtonBuilder()
    .setCustomId('dandadan-prev')
    .setLabel('Sebelumnya')
    .setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder().addComponents(prev, next)

  await waitMessage.edit({
    embeds: [
      {
        title: 'DandaDan',
        fields: [
          { name: 'Panel', value: 1 },
          { name: 'Chapter', value: chapter },
        ],
        image: {
          url: `https://cdn.readkakegurui.com/file/cdnpog/dandadan/chapter-${chapter}/${1}.webp`,
        },
      },
    ],
    components: [row],
  })
}

module.exports = { danDanDan }
