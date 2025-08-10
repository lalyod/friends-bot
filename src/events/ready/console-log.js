const { Client } = require('discord.js');
const logger = require('../../utils/logger')

/** @param {Client} client */
module.exports = (client) => {
    logger.info(`${client.user.tag} has started succesfully`);

    client.user.setPresence({ activities: [{ name: 'With FriendsLand' }], status: 'online' })
}
