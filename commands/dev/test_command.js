const { owner } = require("../../config.json");

module.exports = {
	name: 'test_command',
    aliases: ['tc'],
	description: 'for testing purposes',
	hide: true,  // hides command from being listed from j?help
	execute(message, args) {
        if (message.author != owner) return message.channel.send('stoop! you are the not the flat fish 1!! (how did you find this command, anyway?)');
        try {
            message.client.off('messageCreate', () => {
                console.log("ttt");
            })
        }
        catch (err) {
            console.log(err);
        }
    },
};