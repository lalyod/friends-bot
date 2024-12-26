const { PermissionsBitField, SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Embed builder buat dev')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Channel dimana embed akan dikirim')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('title').setDescription('Judul embed')
    )
    .addStringOption((option) =>
      option.setName('description').setDescription('Deskripsi embed')
    )
    .addAttachmentOption((option) =>
      option.setName('thumbnail').setDescription('Thumbnail embed')
    )
    .addAttachmentOption((option) =>
      option.setName('image').setDescription('Gambar embed')
    )
    .addStringOption((option) =>
      option.setName('color').setDescription('Color desimal')
    ),
  devOnly: true,
  run: async ({ interaction, client }) => {
    if (!interaction.inGuild()) {
      interaction.reply('Command hanya bisa digunankan di dalam server')
      return
    }

    const options = interaction.options
    const embed = {
      title: options.get('title')?.value,
      description: options.get('description')?.value.replaceAll('/\\n/g', '\n'),
      thumbnail: {
        url: options.get('thumbnail') ? options.getAttachment('thumbnail') : '',
      },
      image: {
        url: options.get('image') ? options.getAttachment('image').url : '',
      },
      color: options.get('color')
        ? parseInt(options.get('color')?.value)
        : 0x0099ff,
    }

    await interaction.deferReply({ ephemeral: true })

    const channel = options.get('channel').channel

    const isCanSendMessage = channel
      .permissionsFor(client.user)
      .has(PermissionsBitField.Flags.SendMessages)

    if (!isCanSendMessage) {
      await interaction.editReply('Bot tidak dapat mengirim pesan')
      return
    }

    await interaction.editReply('Berhasil')

    channel.send({ embeds: [embed] })
  },
}
