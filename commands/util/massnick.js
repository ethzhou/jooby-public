module.exports = {
    name: 'massnick',
    aliases: ['nickall'],
    description: 'we are all one within the iris',
    usage: '[nick]',
    permissions: 'ADMINISTRATOR',
    cooldown: 300,
    guildOnly: true,
    execute(message, args) {
        if (!args.length) return message.channel.send(`You didn't pass any nickname, ${message.author}  :   )`);
        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send(`i cannot change nicknames, ${message.author}. please give permission?`);

        const members = message.channel.guild.members, newNick = args.join(" ");
        members.fetch()
            .then(members => { members.forEach(member => {
                    // return console.log(`${member} ${newNick}`);
                    member.setNickname(newNick);
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
}