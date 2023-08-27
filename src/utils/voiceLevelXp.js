const { Client } = require('discord.js')
const Level = require('../models/Level')
const calculateLevelXp = require('./calculateLevelXp')

/**
 * 
 * @param {Client} client 
 */
function getRandomXp(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = (client) => {
    const xpToGive = getRandomXp(5,10)
    setInterval(() => {
        client.guilds.cache.forEach(guild => {
            guild.members.cache.forEach(async member => {
                if (member.voice.channel) {
                    const query = {
                        userId: member.id,
                        guildId: member.guild.id
                    }

                    try {
                        const level = await Level.findOne(query)
                
                        if (level) {
                            level.xp += xpToGive;
                
                            if (level.xp > calculateLevelXp(level.level)) {
                                level.xp = 0
                                level.level += 1
                
                                client.channels.cache.get(process.env.LEVEL_CHANNEL_ID).send(`${member} you has level up to **${level.level}** level`)
                            }
                
                            await level.save().catch((e) => {
                                console.log(e);
                                return
                            })
                        }
                
                        // if(!level)
                        else {
                            const newLevel = new Level({
                                userId: message.author.id,
                                guildId: message.guild.id,
                                xp: xpToGive
                            })

                            await newLevel.save();
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })
    }, 300000)
}