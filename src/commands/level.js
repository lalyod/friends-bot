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
const logger = require('../utils/logger')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Menampilkan level anda/orang lain')
        .addMentionableOption((option) =>
            option
                .setName('user')
                .setDescription('Orang yang ingin dilihat levelnya')
        ),
    /**
     * @param {InteractionResponse} interaction
     */
    run: async ({ interaction }) => {
        try {
            await interaction.deferReply()

            const member = interaction.member
            if (!member) throw 'levelCommand: member not found.'

            const profile = await Level.findOne({ userId: member.id })
            if (!profile) throw 'levelCommand: level not found'

            const attachment = await levelCanvas(
                profile.level,
                profile.xp,
                member
            )

            // TODO: make button handler
            const actions = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setLabel('✨ Edit Profile')
                    .setCustomId('edit-profile')
                    .setStyle(ButtonStyle.Secondary)
            ])

            await interaction.editReply({
                files: [attachment],
                components: [actions],
            })
            logger.info(`level card send for user ${member.id}`)
        } catch (err) {
            logger.error(
                { err, userId: interaction.user?.id },
                'failed to generate level card'
            )
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'gagal membuat kartu level.',
                })
            } else {
                await interaction.reply({
                    content: 'gagal membuat kartu level.',
                })
            }
        }
    },
}
