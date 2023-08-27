const { Client, InteractionResponse, SlashCommandBuilder } = require('discord.js')
const Level = require('../models/Level')
const levelCanvas = require('../utils/level-canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription("Menampilkan level")
        .addStringOption(option =>
            option.setName('target-user')
                .setDescription('Mention member')
        ),
    /**
     * @param {InteractionResponse} interaction
     */
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply('Command hanya bisa di jalankan di server')
            return
        }

        try {
            await interaction.deferReply()

            const mentionUserId = interaction.options.get('target-user')?.value.replace('@', '').replace('<', '').replace('>', '');
            const targetUserId = mentionUserId || interaction.member.id;
            const targetUserObj = await interaction.guild.members.fetch(targetUserId);

            const fetchRank = await Level.find({ guildId: interaction.guild.id }).sort({ level: -1 });
            const rank = fetchRank.findIndex(rank => rank.userId === targetUserId);
            const fetchLevel = await Level.findOne({
                userId: targetUserId,
                guildId: interaction.guild.id
            });


            if (!fetchLevel) {
                interaction.editReply(
                    mentionUserId ? `${targetUserObj.user.tag} Belum memiliki level sama sekali` : "Kamu belum memiliki level "
                )
                return
            }

            interaction.editReply({ files: [await levelCanvas(fetchLevel, rank + 1, targetUserObj)] })
        } catch (err) {
            interaction.editReply('Sepertinya terjadi kesalahan, tolong jalakan command kembali atau contact developer');
        }
    }
}