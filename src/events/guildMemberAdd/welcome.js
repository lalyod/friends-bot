const welcome = require('../../utils/welcome')

module.exports = async (member, client) => {
  client.channels.cache
    .get(process.env.WELCOME_CHANNEL_ID)
    .send({ files: [await welcome(member, client)] });
}