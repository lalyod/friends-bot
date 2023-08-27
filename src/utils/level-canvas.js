const { AttachmentBuilder, InteractionResponse } = require('discord.js')
const { createCanvas, GlobalFonts, Image } = require('@napi-rs/canvas')
const { request } = require('undici')
const calculateLevelXp = require('./calculateLevelXp')
const dotenv = require('dotenv').config()

/**
 * @param {InteractionResponse} interaction 
 */
module.exports = async (level, rank, member) => {
    GlobalFonts.registerFromPath('./src/assets/fonts/Poppins-SemiBold.ttf', 'Poppins')
    const canvas = createCanvas(510, 408);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#18191C';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const grd = ctx.createLinearGradient(0, 0, 200, 0)
    grd.addColorStop(0, '#7F86EC')
    grd.addColorStop(1, '#3A44DE')

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height / 4)

    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvas.height - 5, Math.floor((canvas.width * level.xp) / calculateLevelXp(level.level)), 5)

    ctx.font = 'bold 30px Poppins';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(member.displayName, 40, 230);
    const nameWidth = ctx.measureText(member.displayName).width

    ctx.font = 'bold 30px Poppins';
    ctx.fillStyle = 'gray';
    ctx.fillText('#' + rank, (40 + nameWidth) + 10, 230);

    ctx.font = '100 50px Poppins';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`LEVEL ${level.level}`, 40, canvas.height - 50);

    ctx.font = '100 10px Poppins';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${level.xp} XP`, 44, canvas.height - 30);

    ctx.globalAlpha = 0.2
    ctx.beginPath();
    ctx.arc(120, 100, 80, 9.4, (Math.PI + 0.02) * 2, false);
    ctx.lineWidth = 30
    ctx.stroke()

    ctx.globalAlpha = 1.0
    ctx.beginPath();
    ctx.arc(120, 100, 80, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const { body } = await request(member.displayAvatarURL({ extension: 'jpg' }));
    const avatar = new Image();
    avatar.src = Buffer.from(await body.arrayBuffer());
    ctx.drawImage(avatar, 38, 20, 160, 160);

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

    return attachment
}