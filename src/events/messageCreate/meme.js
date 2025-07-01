const { Client, Message } = require('discord.js')
const levelUp = require('../../utils/level-up.js')
const logger = require('../../utils/logger.js')

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (message, client) => {
    if (!message.inGuild()) return
    if (message.author.bot) return
    if (message.channelId != '753081137248600124') return

    logger.info('EvenTriggered: messageCreate: ')
    try {
        if (message.attachments.size > 0) {
            logger.info({ message }, 'message has attachment')
            // give user 20 xp per image
            await levelUp(
                message.author.id,
                20 * message.attachments.size,
                client
            )

            if (message.attachments.size >= 4) {
                await message.reply(
                    `Puncak komedi <@${message.author.id}>, kamu mengirim lebih dari 4 memes sekaligus. Sekarang pergi sentuh rumput. Nolep!`
                )
            }

            await message.react('✅')
        }
    } catch (err) {
        logger.err({ err }, 'failed give user xp')
    }
}
