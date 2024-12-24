const { Client, Message } = require('discord.js')
const Level = require('../../models/Level')
const { role_rewards } = require('../../../config.json')
const levelUp = require('../../utils/level-up')

function getRandomXp(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}
/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (message, client) => {
  if (!message.inGuild() || message.author.bot) return
  if (process.env.DEV_ENV === true) return

  const xp = getRandomXp(5, 10)

  try {
    const level = await levelUp(message.author.id, xp, client)
    if(!level) return

    const roles = message.guild.roles.cache
    const member = message.member

    role_rewards.map((reward) => {
      if (level.level >= reward.level) {
        if (member.roles.cache.has(reward.id)) return

        const role = roles.get(reward.id)
        if(!role) throw "Role not exist"

        member.roles.add(role)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
