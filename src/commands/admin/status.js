const {
    SlashCommandBuilder,
    EmbedBuilder,
    InteractionResponse,
    Client,
} = require('discord.js')
const { useHostingStatus } = require('../../utils/api')
const logger = require('../../utils/logger')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get a hosting status'),
    devOnly: true,
    /**
     * @param {InteractionResponse} = interaction
     * @param {Client} client
     */
    run: async ({ interaction, client }) => {
        try {
            const data = await useHostingStatus()

            if (!data) {
                await interaction.reply('API No Response')
                return
            }

            const embed = new EmbedBuilder()
                .setColor('#4990E2')
                .setTitle(`${client.user.tag} Status`)
                .setFields([
                    { name: 'CPU', value: data.cpu },
                    { name: 'RAM', value: data.memory },
                    { name: 'Download', value: data.netIO.down, inline: true },
                    { name: 'Upload', value: data.netIO.up, inline: true },
                ])

            await interaction.reply({ embeds: [embed] })
        } catch (err) {
            logger.error({ err }, 'Failed to handle /status commands')
        }
    },
}
