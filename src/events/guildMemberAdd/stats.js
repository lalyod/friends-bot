const { Client, GuildMember } = require('discord.js')
const welcome = require('../../utils/welcome')

/**
 * 
 * @param {GuildMember} member 
 * @param {Client} client 
 */
module.exports = (member, client) => {
    welcome(member, client)
}