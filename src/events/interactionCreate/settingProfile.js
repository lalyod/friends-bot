const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ModalBuilder,
    ActionRow,
    TextInputBuilder,
    TextInputStyle,
    MessageFlags,
} = require('discord.js')
const logger = require('../../utils/logger')
const Level = require('../../models/Level')
const { ButtonBuilder } = require('discord.js')
const levelCanvas = require('../../utils/level-canvas')

// handle for every setting profile interaction

/**
 * @param {import('discord.js').InteractionResponse} interaction
 */
module.exports = async (interaction) => {
    if (interaction.customId?.startsWith('editProfile')) {
        const levelCardOwner = interaction.customId.split('-')[1]
        if (levelCardOwner != interaction.member.id){
            await interaction.reply(
                'Anda tidak bisa mengatur profil orang lain.'
            )
            return
        }

        try {
            await interaction.deferReply()

            const embed = new EmbedBuilder()
                .setTitle('Pengaturan Profil')
                .setDescription(
                    'Atur profil level dengan sesuai keinginan anda.'
                )

            const actionRow = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setLabel('Atur Warna Banner')
                    .setCustomId('edit-profile-banner-modal')
                    .setStyle(ButtonStyle.Primary),
            ])

            await interaction.editReply({
                embeds: [embed],
                components: [actionRow],
            })
        } catch (err) {
            logger.error({ err }, 'failed to send setting menu.')

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'gagal menampilkan menu pengaturan.',
                })
            } else {
                await interaction.reply({
                    content: 'gagal menampilkan menu pengaturan.',
                })
            }
        }
    }

    if (interaction.customId == 'edit-profile-banner-modal') {
        try {
            const modal = new ModalBuilder()
                .setCustomId('banner-modal')
                .setTitle('Atur Banner Profil')

            const firstActionRow = new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('bannerColorInput')
                    .setLabel('Warna Banner')
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(4)
                    .setMaxLength(7)
                    .setPlaceholder('#000000')
            )

            modal.addComponents(firstActionRow)

            await interaction.showModal(modal)
        } catch (err) {
            logger.error({ err }, 'failed to show modal')
        }
    }

    if (interaction.customId == 'banner-modal') {
        const color = interaction.fields.getTextInputValue('bannerColorInput')

        const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
        // Regex for 4-digit or 8-digit hex colors with alpha (e.g., #F00A, #FF0000AA)
        const hexAlphaRegex = /^#([0-9A-Fa-f]{4}|[0-9A-Fa-f]{8})$/
        // Test the input string against both regex patterns
        const isValidColor = hexRegex.test(color) || hexAlphaRegex.test(color)

        if (!isValidColor) throw 'Warna tidak valid.'

        const level = await Level.findOneAndUpdate(
            { userId: interaction.member.id },
            { $set: { banner_color: color } }
        )

        const attachment = await levelCanvas(
            level.level,
            level.xp,
            color,
            interaction.member
        )

        await interaction.reply({
            content: 'Berhasil mengganti warna banner.',
            files: [attachment],
            flags: MessageFlags.Ephemeral,
        })
    }
}
