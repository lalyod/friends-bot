const { AttachmentBuilder, InteractionResponse } = require('discord.js')
const { createCanvas, GlobalFonts, Image } = require('@napi-rs/canvas')
const { request } = require('undici')
const calculateLevelXp = require('./calculateLevelXp')

/**
 * @param {number} level
 * @param {number} xp
 * @param {import('discord.js').GuildMember} member
 * @returns {Promise<import('discord.js').AttachmentBuilder>}
 */
module.exports = async (level, xp, member) => {
    GlobalFonts.registerFromPath(
        './src/assets/fonts/Poppins-SemiBold.ttf',
        'Poppins'
    )
    const canvas = createCanvas(510, 408)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#18191C'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const grd = ctx.createLinearGradient(0, 0, 200, 0)
    grd.addColorStop(0, '#7F86EC')
    grd.addColorStop(1, '#3A44DE')

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height / 3)

    ctx.fillStyle = 'green'
    ctx.fillRect(
        0,
        canvas.height - 5,
        canvas.width * xp / calculateLevelXp(level),
        5
    )

    ctx.font = 'bold 30px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(member.displayName, 40, 250)

    ctx.font = 'normal 16px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(member.user.username, 40, 280)

    ctx.font = '100 50px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`LEVEL ${level}`, 40, canvas.height - 50)

    ctx.font = '100 10px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${xp} XP`, 44, canvas.height - 30)

    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.strokeStyle = "#18191C"
    ctx.arc(120, canvas.height / 3 - 10, 80, 9, (Math.PI + 0.2) * 2, false)
    ctx.lineWidth = 30
    ctx.stroke()

    ctx.globalAlpha = 1.0
    ctx.beginPath()
    ctx.arc(120, canvas.height / 3 - 10, 80, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    const { body } = await request(
        member.displayAvatarURL({ extension: 'jpg' })
    )
    const avatar = new Image()
    avatar.src = Buffer.from(await body.arrayBuffer())
    ctx.drawImage(avatar, 40, canvas.height / 3 - (160 / 2 + 10), 160, 160)

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        name: 'level.png',
    })

    return attachment
}
