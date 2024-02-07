const leave = require("../../utils/leave")

module.exports = async (member, client) => {
  client.channels.cache
    .get(process.env.WELCOME_CHANNEL_ID)
    .send({ files: [await leave(member, client)] });
}