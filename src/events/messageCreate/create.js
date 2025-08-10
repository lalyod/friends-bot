const { Client, Message } = require('discord.js')
const { animeAll } = require('../../message_commands/anime.js')
const { danDanDan } = require('../../message_commands/dandadan.js')

/**
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (message) => {
  if (message.author.bot || !message.content.startsWith(';')) return

  const args = message.content.slice(1).trim().split(/ +/)
  const command = args.shift().toLowerCase()

  if (command === 'anime') {
    await animeAll(message)
  }
  if (command == 'dandadan') {
    await danDanDan(message, args)
  }
}
