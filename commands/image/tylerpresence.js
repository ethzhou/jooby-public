const Discord = require('discord.js');
const Canvas = require('canvas');

const TYLER_URL = "https://cdn.discordapp.com/attachments/831003773651648513/875561404395028500/IsoTylerTransparent.png";
const N_BYTES_8MB = 8388608;

module.exports = {
    name: 'tylerpresence',
    aliases: ['tylertravel'],
    description: 'tyler assertion',
    usage: '<imageURL/attachment>',
    cooldown: 5,
    availableInGuilds: [
        '737849661670555689',  // House of Commons
        '457724467255181332',  // 𝕆𝕗𝕗𝕚𝕔𝕒𝕝 𝕄𝕔ℂ𝕦𝕔𝕜lord 𝕃𝕠𝕦𝕟𝕘𝕖
        '695803582343282787',  // Royal Family
        '821548631081484299',  // popcorn's server
    ],
    async execute(message, args) {
        if (!(message.attachments.size || args.length)) return message.channel.send("no image:(");

        try {
            const client = message.client;

            // console.log(args.length);
            const msgAttachInURL = args.length ? args[0] : message.attachments.first().url;
            console.log(`Input: ${msgAttachInURL}`);

            const tyler = await Canvas.loadImage(
                // "./commands/image/tylerpresence/IsoTylerTransparent.png"
                TYLER_URL,
            );
            const background = await Canvas.loadImage(msgAttachInURL);
            console.log(`${background.width} x ${background.height}`);
            console.log(`${background} BACKGROUND`);

            const img = Canvas.createCanvas(background.width, background.height);
            const ctx = img.getContext('2d');

            ctx.drawImage(background, 0, 0, img.width, img.height);
            ctx.globalAlpha = .4;
            ctx.drawImage(tyler, 0, 0, img.width, img.height);
            
            if (img.toBuffer().length > N_BYTES_8MB) {
                return message.channel.send("!!!!!! image TOO SIZEABLE");
            }

            const msgAttachOut = new Discord.MessageAttachment(
                img.toBuffer(), 
                `tyler-in-${msgAttachInURL.substring(msgAttachInURL.lastIndexOf("/") + 1)}.png`
            );
            
            console.log(msgAttachOut.attachment.length);
            message.channel.send({ 
                content: message.author.toString(), 
                files: [msgAttachOut],
            });
            message.delete();
        } 
        catch (error) {
            console.log(error);
            message.channel.send("can'ted");
        }
    }
}