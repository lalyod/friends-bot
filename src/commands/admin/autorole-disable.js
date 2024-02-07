const {InteractionCollector, PermissionFlagsBits, SlashCommandBuilder} = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole-disable')
        .setDescription('Disable auto role in this server.'),
    devOnly: true,
    /**
     * @param {Interaction} interaction 
     */
    run: async ({interaction}) => {
        try {
            await interaction.deferReply();

            if(!(await AutoRole.exists({guildId: interaction.guild.id}))){
                interaction.editReply("Auto role belum di konfigurasi. gunakan `/autorole-configure` untuk mengatur auto role");
                return;
            }

            await AutoRole.findOneAndDelete({guildId: interaction.guild.id});
            interaction.editReply('Auto role berhasil di nonaktifkan. Guanakan `/autorole-configure` untuk mengatur auto role');
        } catch (error) {
            console.log(error);
        }
    }
}