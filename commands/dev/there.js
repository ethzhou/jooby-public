const { owner } = require("../../config.json");

module.exports = {
	name: 'there',
	description: "he's there",
	usage: '<duration>',
	cooldown: 0,
	hide: true,
	execute(message, args) {
		if (message.author != owner) return;
		if (args.length < 1) return;
		
		const { joinVoiceChannel } = require('@discordjs/voice');
		const { VoiceConnectionStatus } = require('@discordjs/voice');

		const channel = message.client.channels.cache.get(args[0]);
		const duration = args[1] ? args[1] : 0;  // in seconds

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		connection.on(VoiceConnectionStatus.Ready, () => {
			console.log(`jooby's connection to ${channel.guild} has entered the Ready state`);

			setTimeout(() => {
				console.log(`destryoing jooby's conecntion to ${channel.guild} after ${duration} segconds`);
				connection.destroy(); 
			}, duration * 1000);
		});	
	},
};