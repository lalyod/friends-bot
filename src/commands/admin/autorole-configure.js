const {
  Client,
  SlashCommandBuilder,
} = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole-configure")
    .setDescription("Configure your auto-role for this server.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want users to get join.")
        .setRequired(true)
    ),
  devOnly: true,
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    try {
      await interaction.deferReply();

      let targetRoleId = interaction.options.get('role').value;

      let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });
      
      if (autoRole) {
        if (autoRole.roleId === targetRoleId) {
          interaction.editReply("Role tersebut sudah di konfigurasi, untuk menonaktifkan auto role jalankan command `/autorole-disable`");
          return;
        }
        autoRole.roleId = targetRoleId;
      } else {
        autoRole = new AutoRole({
          guildId: interaction.guild.id,
          roleId: targetRoleId,
        });
      }

      await autoRole.save();
      interaction.editReply("Auto role sekarang sudah terkonfigurasi, untuk menonaktifkan jalankan `/autorole-disable`");
    } catch (error) {
      console.log(error);
    }
  },
};
