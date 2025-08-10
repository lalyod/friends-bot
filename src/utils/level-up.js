const { EmbedBuilder } = require('discord.js')
const Level = require('../models/Level')
const calculateLevelXp = require('./calculateLevelXp')
const logger = require('./logger')

/**
 * @param {String} userId
 * @param {Number} xp
 * @param {import('discord.js').Client} client
 */
async function levelUp(userId, xp, client) {
    const level = await Level.findOne({ userId: userId })
    const channel = client.channels.cache.get(process.env.LEVEL_CHANNEL_ID)

    if (level) {
        level.xp += xp

        if (level.xp > calculateLevelXp(level.level)) {
            level.xp = 0
            level.level += 1

            const embed = new EmbedBuilder()
                .setColor(level.banner_color)
                .setDescription(
                    `Selamat, <@${userId}>! Anda telah naik ke level ${level.level}`
                )

            channel.send({ embeds: [embed] })
            logger.info('send level up message')
        }

        await level.save()
    } else {
        // create level if there is not exist
        const level = new Level({
            userId: userId,
            level: 1,
            xp: xp,
        })

        await level.save()

        const embed = new EmbedBuilder()
            .setTitle('Selamat Datang')
            .setDescription(
                `Selamat <@${userId}>, kamu sudah memiliki level pertama mu, jangan lupa sering chat dan voice agar level mu naik terus`
            )

        channel.send({ embeds: [embed] })
        logger.info('send welcome message')
    }

    return level
}

module.exports = levelUp
