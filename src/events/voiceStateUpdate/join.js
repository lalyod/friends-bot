const { VoiceState } = require('discord.js')
const Voice = require('../../models/voice')

/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */
module.exports = async (oldState, newState) => {
    // ensure that this is join voice event
    if (oldState.channelId !== newState.channelId) {
        // prevent mute and unmute trigger this event
        if (!oldState.channelId && newState.channelId) {
            const member = oldState?.member ?? newState?.member
            if (!member) return
            if (member.user.bot) return

            try {
                const voice = await Voice.findOne({ user_id: member.id })

                if (voice) {
                    await voice.deleteOne({ user_id: member.id })
                }

                const newVoice = new Voice({ user_id: member.id })
                await newVoice.save()
            } catch (err) {
                console.log(err)
            }
        }
    }
}
