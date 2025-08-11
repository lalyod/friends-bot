const axios = require('axios')
const dotenv = require('dotenv')
const { discloud } = require('../config/discloud')
dotenv.config()

const useAnisaki = async (index = new Date().getDay()) => {
    const uri = process.env.ANISAKI_API_URL

    if (!uri) throw 'ANISAKI_API_URI is not defined'

    let error = '',
        response = []
    try {
        const { data } = await axios.get(uri)
        response = data.schedule[index]
    } catch (err) {
        error = err
    }

    return { data: response, error }
}

async function useAnisakiOne(index = new Date().getDay(), id = 1) {
    const uri = process.env.ANISAKI_API_URL

    if (!uri) throw 'ANISAKI_API_URI is not defined'

    let error = '',
        response = []
    try {
        const { data } = await axios.get(uri)
        response = data.schedule[index]?.find((schedule) => schedule.id == id)
    } catch (err) {
        error = err
    }

    return { data: response, error }
}

const useHostingStatus = async () => {
    const { data } = await axios.get(
        `https://api.discloud.app/v2/app/${discloud.app_id}/status`,
        { headers: { 'api-token': discloud.token } }
    )

    if (data?.status === 'ok' && data?.apps) {
        return data?.apps
    } else {
        throw 'Failed to fetch status'
    }
}

module.exports = { useAnisaki, useAnisakiOne, useHostingStatus }
