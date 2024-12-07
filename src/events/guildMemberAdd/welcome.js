/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (member, client) => {
  const channel = client.channels.cache.get(process.env.WELCOME_CHANNEL_ID)

  channel.send({
    content: `Selamat datang ${member} aku adalah bot pembantu. kalau butuh bantuan gunain \`/help\` aja. semoga kamu betah disini`,
  })
}

