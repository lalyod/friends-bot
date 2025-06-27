const { AttachmentBuilder, InteractionResponse } = require('discord.js')
const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas')
const calculateLevelXp = require('./calculateLevelXp')

/**
 * @param {number} level
 * @param {number} xp
 * @param {string|undefined} bannerColor
 * @param {import('discord.js').GuildMember} member
 * @returns {Promise<import('discord.js').AttachmentBuilder>}
 */
module.exports = async (level, xp, bannerColor, member) => {
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

    ctx.fillStyle = bannerColor ?? grd
    ctx.fillRect(0, 0, canvas.width, canvas.height / 3)

    ctx.fillStyle = 'green'
    ctx.fillRect(
        0,
        canvas.height - 5,
        (canvas.width * xp) / calculateLevelXp(level),
        5
    )

    ctx.font = 'bold 30px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(member.displayName, 40, 250)

    ctx.font = 'normal 16px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(member.user.username, 40, 280)

    ctx.font = '100 30px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`LEVEL ${level}`, 40, canvas.height - 55)

    ctx.font = '100 14px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${xp} XP`, 40, canvas.height - 30)

    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.strokeStyle = '#18191C'
    ctx.arc(120, canvas.height / 3 - 10, 80, 9, (Math.PI + 0.2) * 2, false)
    ctx.lineWidth = 30
    ctx.stroke()

    ctx.globalAlpha = 1.0
    ctx.beginPath()
    ctx.arc(120, canvas.height / 3 - 10, 80, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    const avatar = await loadImage(
        member.displayAvatarURL({ extension: 'jpg' })
    )
    ctx.drawImage(avatar, 40, canvas.height / 3 - (160 / 2 + 10), 160, 160)

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        name: 'level.png',
    })

    return attachment
}
