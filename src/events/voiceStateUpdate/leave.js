const Voice = require('../../models/voice')
const { role_rewards } = require('../../../config.json')
const levelUp = require('../../utils/level-up')

/**
 * @param {import('discord.js').VoiceState} oldState
 * @param {import('discord.js').VoiceState} newState
 */
module.exports = async (oldState, newState, client) => {
    if (oldState.channel && !newState.channel) {
        const member = oldState?.member ?? newState?.member
        if (!member) return
        if (member.user.bot) return

        try {
            const voice = await Voice.findOne({ user_id: member.id })
            if (!voice) return

            const timeElapse = Math.round((Date.now() - voice.createdAt) / 1000)

            if (timeElapse > 60) {
                const xp = 5 * Math.round(timeElapse / 60)
                const level = await levelUp(member.id, xp, client)
                if (!level) return

                const memberRoles = member.roles.cache

                role_rewards.map((reward) => {
                    if (level.level >= reward.level) {
                        if (memberRoles.has(reward.id)) return

                        member.roles.add(reward.id)
                    }
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}
