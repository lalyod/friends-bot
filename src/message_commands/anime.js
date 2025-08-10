const { Message } = require('discord.js')
const { useAnisaki } = require('../utils/api')
/**
 * @param {Message} message
*/
const animeAll = async (message) => {
  const { data: animes } = await useAnisaki()

  const waitingMessage = await message.reply('Sedang nyari jadwal, tolong tunggu mas bro ...')

  const fields = animes.map((anime) => {
    const airingAt = new Date(anime.nextAiringEpisode.airingAt * 1000)
    const time = airingAt.toLocaleDateString('id-ID', {
      weekday: 'long',
      hour: '2-digit', minute: '2-digit'
    })

    return {
      name: anime.title.romaji,
      value: `Tayang pada \`${time}\``
    }
  })

  await message.reply({ embeds: [{ title: 'Anime yang tayang hari ini', fields }] });
  await waitingMessage.delete()
}

module.exports = { animeAll }
