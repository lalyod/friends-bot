const { AttachmentBuilder, GuildMember, Client } = require('discord.js')
const { createCanvas, GlobalFonts, Image } = require('@napi-rs/canvas')
const { readFile } = require('fs/promises');
const { request } = require('undici');
const dotenv = require('dotenv').config();

/**
 * 
 * @param {GuildMember} member 
 * @param {Client} client
 */

module.exports = async (member, client) => {
    try {
        GlobalFonts.registerFromPath('./src/assets/fonts/Poppins-SemiBold.ttf', 'Poppins')
        const canvas = createCanvas(1025, 500);
        const ctx = canvas.getContext('2d');

        const bg = await readFile('./src/assets/img/bg.jpg');
        const bgImage = new Image();
        bgImage.src = bg;
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 70px Poppins';
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText('GOOD BYE', canvas.width / 2, canvas.height / 1.35)

        ctx.font = 'bold 45px Poppins';
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(`${member.displayName.toUpperCase()}`, canvas.width / 2, (canvas.height + 70) / 1.35)

        ctx.font = 'bold 30px Poppins';
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(`SELAMAT TINGGAL ${member.displayName.toUpperCase()}`, canvas.width / 2, (canvas.height + 130) / 1.35)

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 3, 135, 0, Math.PI * 2, true);
        ctx.lineWidth = 8
        ctx.strokeStyle = '#ffffff'
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 3, 130, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const { body } = await request(member.displayAvatarURL({ extension: 'jpg' }));
        const avatar = new Image();
        avatar.src = Buffer.from(await body.arrayBuffer());
        ctx.drawImage(avatar, canvas.width / 2.675, canvas.height / 13.5, 260, 260);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

        return attachment;
    }catch(err){
        console.log(err);
    }
}