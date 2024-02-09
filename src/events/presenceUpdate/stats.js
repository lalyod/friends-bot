const { Colors } = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const { ClientApplication } = require('discord.js')

const dotenv = require('dotenv').config()

/**
 * @param {import('discord.js').Client} client 
 */
module.exports = function (oldState, newState, client) {
    const member = client.guilds.cache
        .get(process.env.GUILD_ID).members.cache
        .filter(member => !member.user.bot).size

    client.channels.cache
        .get(process.env.MEMBER_STATS_CHANNEL_ID)
        .setName(`Members: ${member}`)

    if (new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase() == 'sabtu') {
        client.channels.fetch('1204593050396008468').then(async channel => {
            const messages = await channel.messages.fetch({ limit: 1 })
            messages.forEach(message => {
                if (new Date(message.createdTimestamp).getDate() != new Date().getDate()){
                    const embed = new EmbedBuilder({
                        title: 'Info Maintenance',
                        color: 0xff0000,
                        description: 'Hari ini akan ada maintenance silahkan keluar voice channel agar exp mu tersave'
                    });
            
                    client.channels.cache.get('1204593050396008468').send({ embeds: [embed] });
                }
            });
        });

    }
}