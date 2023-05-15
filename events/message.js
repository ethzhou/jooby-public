module.exports = {
	name: 'messageCreate',
	execute(message) {
		const time = new Date(Date.now()).toLocaleTimeString('en-GB');
		if (message.guild) {
			console.log(`${time} [${message.guild.name}] ${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
		} 
		else {
			console.log(`${time} [${message.channel.recipient.tag}] ${message.author.tag} sent: ${message.content}`);
		}

		// if (message.author.id !== message.client.user.id /* && message.channel.id === 830685694644584469 */) {
		// 	message.channel.send(message.content);
		// 	// message.channel.send(message.cleanContent);
		// }

	},
};
