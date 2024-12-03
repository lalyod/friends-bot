const axios = require('axios')
const dotenv = require('dotenv')
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

const useDanDaDan = async (chapter = 1, panel = 1) => {
  let response = ''
  try {
    const { data } = await axios.get(
      `https://cdn.readkakegurui.com/file/cdnpog/dandadan/chapter-${chapter}/${panel}.webp`
    )
    console.log(data)
    response = data
  } catch (err) {
    console.log(err)
  }

  return { response }
}

module.exports = { useAnisaki, useAnisakiOne, useDanDaDan }
