const dotenv = require('dotenv').config()

module.exports = function (oldState, newState, client) {
    const member = client.guilds.cache
        .get(process.env.GUILD_ID).members.cache
        .filter(member => !member.user.bot).size

    client.channels.cache
        .get(process.env.MEMBER_STATS_CHANNEL_ID)
        .setName(`Members: ${member}`)
}