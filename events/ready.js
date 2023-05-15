
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({
			activity: {
				type: "COMPETING",
				name: "j? jj jj  j j (j?help)",
			},
		});

        console.log(`Ready! Logged in as ${client.user.tag}`);

		console.log(`GUILDS (${client.guilds.cache.size}):`);
		for (const guild of client.guilds.cache)
			// console.log(guild);
			console.log(`  ${guild[1].name}`);
	},
};