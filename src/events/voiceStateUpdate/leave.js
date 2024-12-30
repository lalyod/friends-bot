const Voice = require('../../models/voice')
const levelUp = require('../../utils/level-up')

module.exports = async (oldState, newState, client) => {
  if (!oldState?.channel && newState?.channel) return
  const member = oldState?.member ?? newState?.member

  const voice = await Voice.findOneAndDelete({ user_id: member.id })

  if(!voice) return

  const timeElapse = Math.round((Date.now() - voice.createdAt) / 1000)

  if (timeElapse > 60) {
    const xp = 5 * Math.round(timeElapse / 60)
    await levelUp(member.id, xp, client)
  }
}
