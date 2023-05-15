
module.exports = {
	name: 'nothing',
    aliases: ["​"],
	description: '',
	cooldown: 1,
	execute(message) {
        message.channel.send("​")
        .then(message => {
            message.delete();
        })
        .catch(err => {
            console.log("how the did this fail");
        });
	},
};
