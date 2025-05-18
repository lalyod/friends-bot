const { Client, Message } = require('discord.js')
const levelUp = require('../../utils/level-up.js')

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (message, client) => {
    if (!message.inGuild()) return
    if (message.author.bot) return
    if(message.channelId != "753081137248600124") return

    try {
        if (message.attachments.size > 0) {
            // give user 20 xp per image
            await levelUp(
                message.author.id,
                20 * message.attachments.size,
                client
            )

            if (message.attachments.size >= 4){
                await message.reply(`Puncak komedi <@${message.author.id}>, kamu mengirim lebih dari 4 memes sekaligus. Sekarang pergi sentuh rumput. Nolep!`)
            }

            await message.react('✅')
        }
    } catch (err) {
        console.log(err)
    }
}
