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
                if (!member) throw 'Member not found'

                const voice = await Voice.findOne({ user_id: member.id })
                if (!voice) return

                const timeElapse = Math.round(
                        (Date.now() - voice.createdAt) / 1000
                )

                if (timeElapse > 60) {
                        const xp = 5 * Math.round(timeElapse / 60)
                        const level = await levelUp(member.id, xp, client)
                        if (!level) return

                        const roles = member.roles.cache

                        role_rewards.map((reward) => {
                                if (level.level >= reward.level) {
                                        if (member.roles.cache.has(reward.id))
                                                return

                                        const role = roles.get(reward.id)
                                        if (!role)
                                                throw `Roles "${reward.id}" does not exist`

                                        member.roles.add(role)
                                }
                        })
                }
        }
}
