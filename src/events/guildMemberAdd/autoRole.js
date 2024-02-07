const {Client, GuildMember} = require('discord.js');
const AutoRole = require('../../models/AutoRole');

/**
 * @param {Client} client 
 * @param {GuildMember} member 
 */
module.exports = async (member, client) => {
    try {
        let guild = member.guild;
        if(!guild) return;

        let autoRole = await AutoRole.findOne({guildId: guild.id});
        if(!autoRole) return;

        await member.roles
          .add(member.guild.roles.cache.get(autoRole.roleId));

        guild = null;
        autoRole = null;
    } catch (error) {
        console.log(`Error giving role automatically: ${error}`);
    }
};