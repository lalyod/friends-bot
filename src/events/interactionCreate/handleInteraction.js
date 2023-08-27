const { default: axios } = require("axios");
const { EmbedBuilder } = require("discord.js");

/**
 * 
 * @param {import("discord.js").Interaction} interaction 
 */
module.exports = async (interaction) => {
    if (interaction.customId === 'anime') {
        interaction.values.forEach(async value => {
            const vlue = JSON.parse(value)
            const animesFetch = await axios.get(process.env.ANISAKI_API_URI).then(anime => {
                const data = anime.data?.schedule[vlue.schedule_index].filter(data => data.id === vlue.id)
                return data.map(data => {
                    const time = new Date(data.nextAiringEpisode.airingAt * 1000)

                    const text = data.title.romaji

                    let finalText = "";
                    let currentLine = "";

                    for (let i = 0; i < text.length; i++) {
                        if (i % 40 === 0 && i > 0) {
                            if (text.charAt(i) === " ") {
                                finalText += currentLine + "\n";
                                currentLine = "";
                            } else {
                                finalText += currentLine + "\n";
                                currentLine = "";
                            }
                        }
                        currentLine += text.charAt(i);
                    }

                    finalText += currentLine;
                    return {
                        title: finalText,
                        airingAt: `${time.getHours()}:${time.getMinutes()} ${time.getHours() > 12 ? 'PM' : "AM"}`,
                        episode: data.nextAiringEpisode.episode,
                        image: data.coverImage.large
                    }
                })
            })

            const embed = new EmbedBuilder({
                title: `Anime ${vlue.day}`,
                fields: [
                    { name: animesFetch[0].title, value: '' },
                    { name: 'Jam Tayang', value: animesFetch[0].airingAt, inline: true },
                    { name: 'Episode', value: animesFetch[0].episode, inline: true }
                ],
                image: {
                    url: animesFetch[0].image
                }
            })

            interaction.message.edit({
                embeds: [embed],
                components: []
            })
        });
    }
}