module.exports = {
	name: 'ava',
	aliases: ['avatar', 'icon', 'pfp'],
	description: 'get avatars of fellows by pinging them',
	usage: '<user>',
	cooldown: 5,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.channel.send(message.author.displayAvatarURL({ dynamic: true }));
		}

		const avatarList = message.mentions.users.map(user => {
			return user.displayAvatarURL({ dynamic: true });
		});

		message.channel.send(avatarList);
	},
};