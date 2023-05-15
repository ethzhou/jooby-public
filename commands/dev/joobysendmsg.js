const { owner } = require("../../config.json");
const COMMAND_SECURITY_PARAM = '..,'

module.exports = {
	name: 'joobysendmsg',
    aliases: ['jsm'],
	description: 'have jooby send a message',
    usage: '[channel id] [message]',
	hide: true,  // hides command from being listed from j?help
	async execute(message, args) {
        if (args[0] !== COMMAND_SECURITY_PARAM) return;
        if (message.author != owner) return message.channel.send('stoop! you are the not the flat fish!!! (how did you find this command, anyway?)');

        const channelID = args[1];
        const messageContent = args.slice(2).join(" ");

        try {
            const channel = await message.client.channels.fetch(channelID);
            if (channel && channel.type == 'GUILD_TEXT')
                channel.send(messageContent);
            else
                message.channel.send('that is not a text channel');
        } catch (err) {
            console.log("There is no channel in sight with that ID.");
            message.reply("There is no channel in sight with that ID.");
        }
	},
};