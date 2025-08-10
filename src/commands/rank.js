const {
    InteractionResponse,
    SlashCommandBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js')
const Level = require('../models/Level')
const levelCanvas = require('../utils/level-canvas.js')
const rankCanvas = require('../utils/rankCanvas.js')
const logger = require('../utils/logger')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Menampilkan rank semua member'),
    /**
     * @param {InteractionResponse} interaction
     */
    run: async ({ interaction }) => {
        try {
            logger.info("handling '/rank' commands")
            await interaction.deferReply()

            const members = interaction.guild.members
            if (!members) throw 'rankCommand: member not found.'

            const levels = await Level.find({}).sort({ level: -1 }).limit(5)
            if (!levels) throw 'rankCommand: level not found'

            const attachment = new AttachmentBuilder(
                await rankCanvas(levels, members),
                { name: 'rank.jpg' }
            )

            await interaction.editReply({ files: [attachment] })
            logger.info(`level card send for user ${interaction.member.id}`)
        } catch (err) {
            logger.error(
                { err, userId: interaction.user?.id },
                'failed to generate level card'
            )
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'gagal membuat kartu rank.',
                })
            } else {
                await interaction.reply({
                    content: 'gagal membuat kartu rank.',
                })
            }
        }
    },
}
