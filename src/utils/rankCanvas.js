const { GlobalFonts, createCanvas, loadImage } = require('@napi-rs/canvas')

module.exports = async (levels, members) => {
    GlobalFonts.registerFromPath(
        './src/assets/fonts/Poppins-SemiBold.ttf',
        'Poppins'
    )

    const canvas = createCanvas(510, 408)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#18191C'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let cardY = 10
    for (let i = 0; i < levels.length; i++) {
        const member = await members.fetch(levels[i].userId)

        ctx.fillStyle = '#1F2129'
        ctx.roundRect(10, cardY, canvas.width - 20, 60, 10)
        ctx.fill()
        ctx.beginPath()

        const avatar = await loadImage(
            member.displayAvatarURL({ extension: 'jpg' })
        )

        const xpProgress = levels[i].xp / (levels[i].level * 10)
        ctx.beginPath()
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 3
        ctx.arc(50, cardY + 30, 23, 0, xpProgress * (-Math.PI * 2), true)
        ctx.stroke()

        ctx.save()
        ctx.beginPath()
        ctx.arc(50, cardY + 30, 20, 0, Math.PI * 2, true)
        ctx.clip()
        ctx.drawImage(avatar, 30, cardY + 10, 40, 40)
        ctx.restore()
        ctx.beginPath()

        ctx.font = '100 16px Poppins'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(member.displayName, 30 + 40 + 15, cardY + 35)

        ctx.font = '100 16px Poppins'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(
            levels[i].level.toString(),
            canvas.width - 30 - 20,
            cardY + 35
        )

        cardY += 70
    }

    return canvas.toBuffer('image/png')
}
