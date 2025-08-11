const bot = {
    token: process.env['TOKEN'],
    welcome_channel: process.env['WELCOME_CHANNEL_ID'],
    level_channel: process.env['LEVEL_CHANNEL_ID'],
}

Object.freeze(bot)

module.exports = { bot }
