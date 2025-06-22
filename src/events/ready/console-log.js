module.exports = (client) => {
    console.log(`${client.user.tag} is ready`);

    client.user.setPresence({ activities: [{ name: 'With FriendsLand' }], status: 'online' })
}
