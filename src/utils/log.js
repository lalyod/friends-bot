const { Client, Interaction } = require('discord.js')

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
async function sendErrorInteractionLog(client, interaction, error) {
  const channel = await client.channels.fetch(process.env.ERROR_LOG_CHANNEL_ID)

  channel.send({
    embeds: [
      {
        title: new Date().toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta',
        }),
        fields: [
          {
            name: 'Author',
            value: `\`${interaction.member.id}\``,
            inline: true,
          },
          {
            name: 'Command',
            value: `\`${interaction.commandId}\``,
            inline: true,
          },
          {
            name: 'Message',
            value: `\`${typeof error == 'string' ? error : error?.message}\``,
          },
        ],
        color: 0xff0000,
      },
    ],
  })
}

module.exports = { sendErrorInteractionLog }
