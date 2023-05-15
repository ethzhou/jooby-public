module.exports = {
	name: 'pingy',
	description: 'i will pong you',
	cooldown: 1,
	execute(message) {
		message.channel.send('pongy.');
	},
};