const dotenv = require('dotenv')
dotenv.config()

const { Client, IntentsBitField } = require('discord.js')
const { CommandHandler } = require('djs-commander')
const path = require('path')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
})

async function connect() {
    try {
        logger.info('setup mongodb')
        await mongoose.connect(process.env.MONGODB_URI)

        logger.info('setup command handle')
        new CommandHandler({
            client,
            commandsPath: path.join(__dirname, 'commands'),
            eventsPath: path.join(__dirname, 'events'),
            validationsPath: path.join(__dirname, 'validations'),
        })

        logger.info('starting discord bot')
        client.login(process.env.TOKEN)
    } catch (error) {
        logger.error({ error }, 'failed to start bot.')
    }
}

connect()
