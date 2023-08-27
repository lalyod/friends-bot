const { VoiceState } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { Client } = require("discord.js");
const Afk = require("../../models/Afk");

/**
 * 
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 * @param {Client} client
 */
module.exports = async (oldState, newState, client) => {
    const { member, channel } = newState

    if (!oldState.channel && newState.channel) {
        member.joinedTime = Date.now()

        newState.channel.members.forEach(async member => {
            const afk = await Afk.findOne({
                userId: member.id,
                guildId: member.guild.id
            })
            if (afk) {
                const oldMember = client.guilds.cache.get(afk.guildId)?.members.cache.get(afk.userId)
                if (afk.userId !== newState.member.id)
                    if (oldMember.voice.channel.id === newState.member.voice.channel.id) {
                        oldMember.voice.channel.send(`${newState.member} saat ini ${oldMember.displayName} sedang afk selama ${Math.floor((Date.now() - afk.timestamp)/ 60000)} menit`)
                    }
            }
        })
    }
    if (oldState.channel && !newState.channel) {
        const voiceTime = Date.now() - member.joinedTime

        const xpToGive = 10 * Math.floor(voiceTime / 300000)

        const query = {
            userId: oldState.member.id,
            guildId: oldState.guild.id
        }

        try {
            const level = await Level.findOne(query)

            if (level) {
                if (!xpToGive) return
                level.xp += xpToGive;

                if (level.xp > calculateLevelXp(level.level)) {
                    level.xp = 0;
                    level.level += 1;

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
                    userId: message.member.id,
                    guildId: message.guild.id,
                    xp: xpToGive
                })

                await newLevel.save();
            }
        } catch (error) {
            console.log(error);
        }
    }
}