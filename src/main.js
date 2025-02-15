const dotenv = require('dotenv')
dotenv.config()

const { Client, IntentsBitField } = require('discord.js')
const { CommandHandler } = require('djs-commander')
const path = require('path')
const mongoose = require('mongoose')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
})

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    new CommandHandler({
      client,
      commandsPath: path.join(__dirname, 'commands'),
      eventsPath: path.join(__dirname, 'events'),
      validationsPath: path.join(__dirname, 'validations'),
    })
    client.login(process.env.TOKEN)
  } catch (error) {
    console.log(error)
  }
}

connect()
