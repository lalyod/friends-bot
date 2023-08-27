const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const axios = require('axios')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Menampilkan jadwal anime yang tayang pada hari tertentu')
        .addStringOption(option =>
            option.setName('day')
                .setDescription('masukan nama hari')
                .setRequired(true)
        )
    ,

    /**
     * 
     * @param {import('discord.js').InteractionResponse} interaction 
     */
    run: async ({ interaction }) => {
        const dayFormat = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

        let index = null;

        const data = await axios.get(process.env.ANISAKI_API_URI)


        dayFormat.forEach((day, i) => {
            if (interaction.options.get('day')?.value === dayFormat[i].toLowerCase()) index = i
            else return
        })

        if (index === null) return

        const animes = data.data?.schedule[index].map(anime => {
            return {
                id: anime.id,
                title: anime.title.romaji,
                airingAt: anime.nextAiringEpisode.airingAt,
                episode: anime.nextAiringEpisode.episode
            }
        })

        const select = new StringSelectMenuBuilder({
            custom_id: 'anime',
            options: animes.map(anime => {
                return {
                    label: anime.title.length >= 50 ? anime.title.slice(0, 50) + '...' : anime.title,
                    value: JSON.stringify({
                        id: anime.id,
                        schedule_index: index,
                        day: dayFormat[index]
                    })
                }
            })
        })


        const row = new ActionRowBuilder({ components: [select] })

        interaction.reply({ components: [row] })
    }
}