const Level = require('../models/Level')
const calculateLevelXp = require('./calculateLevelXp')

/**
 * @param {String} userId
 * @param {Number} xp
 * @param {import('discord.js').Client} client
 */
async function levelUp(userId, xp, client) {
  const level = await Level.findOne({ userId: userId })

  if (level) {
    level.xp += xp

    if (level.xp > calculateLevelXp(level.level)) {
      level.xp = 0
      level.level += 1

      client.channels.cache.get(process.env.LEVEL_CHANNEL_ID).send({
        embeds: [
          {
            description: `Selamat, <@${userId}>! Anda telah naik ke level ${level.level}`,
          },
        ],
      })
    }

    await level.save()
  } else {
    const level = new Level({
      userId: userId,
      level: 1,
      xp: xp,
    })

    await level.save()

    client.channels.cache.get(process.env.LEVEL_CHANNEL_ID).send({
      embeds: [
        {
          title: 'Selamat datang',
          description: `Selamat <@${userId}>, kamu sudah memiliki level pertama mu, jangan lupa sering chat dan voice agar level mu naik terus`,
        },
      ],
    })
  }

  return level
}

module.exports = levelUp
