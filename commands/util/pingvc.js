module.exports = {
	name: 'pingvc',
	aliases: ['@vc', '@voice'],
	description: 'Ping everyone in the voice channel.',
    guildOnly: true,
	execute(message) {
        const voiceChannel = message.member.voice.channel;
		if (!(voiceChannel && message.member.voice.guild.id === message.guild.id)) {
            message.channel.send("yoou arenot in a voice channel in this serverw");
            return;
        }

        // let out = `${message.author} pings ${voiceChannel}:`;
        let out = `${message.author} pings the voice channel:`;
        const members = voiceChannel.members;

        for (const [, member] of members) {
            console.log(member.constructor.name);
            if (member.id !== message.author.id) 
                // out += member;
                out = out.concat(" ", member);
        }

        message.delete();
        message.channel.send(out);

	},
};