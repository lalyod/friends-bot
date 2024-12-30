const { VoiceState, Client } = require('discord.js')
const Voice = require('../../models/voice')

/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @param {Client} client
 */
module.exports = async (oldState, newState, client) => {
  if (oldState?.channel && !newState?.channel) return
  const member = oldState?.member ?? newState?.member

  const voice = await Voice.findOne({ user_id: member.id })

  if (voice) {
    await voice.deleteOne({ user_id: member.id })
    return
  }

  const newVoice = new Voice({ user_id: member.id })
  await newVoice.save()
}
