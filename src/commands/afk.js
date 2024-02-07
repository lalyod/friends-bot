const { InteractionResponse, SlashCommandBuilder } = require('discord.js')
const Afk = require('../models/Afk')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Memberikan afk status ke member')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Alasan afk karena apa?')
        ),
    /**
     * @param {InteractionResponse} interaction
     */
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) return

        try {
            await interaction.deferReply();

            const query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
                reason: interaction.options.get('reason')?.value,
                timestamp: Date.now()
            };

            const afk = new Afk(query);

            await afk.save();

            interaction.editReply(`${interaction.member} sudah afk karena **${interaction.options.get('reason')?.value}**`);
        } catch (error) {
            interaction.editReply('Sepertinya terjadi kesalahan, tolong jalakan command kembali atau contact developer');
        }
    }
}