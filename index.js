const fs = require('fs');
const Discord = require('discord.js');
const { Intents } = Discord;

const { prefixes, token, default_cd, owner } = require('./config.json');
// const { availableInGuilds } = require('./commands/image/saucyin');  // delete this line? in case you forget, basically i only left this here commented because it wanted to see if the bot would break without it but i don't think it will anyway next time you run it check this line i think

const client = new Discord.Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,  // requires whitelisting: https://discord.com/developers/applications/
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        // Intents.FLAGS.GUILD_PRESENCES,  // requires whitelisting
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
    partials: [
        'CHANNEL',
    ],
});

//#region Read events and commands
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} 
    else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const dir of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        if (command.aliases)
            command.aliases = command.aliases.map(alias => alias.toLowerCase());
        client.commands.set(command.name.toLowerCase(), command); 
    }
}
// console.log(client.commands);

//#endregion

client.login(token);

client.cooldowns = new Discord.Collection();  // This collection holds the IDs of users who have called the current command

// Command handler
client.on("messageCreate", message => {
    if (message.author.bot) return;

    let prfx, prefixFound;
    for (prfx of prefixes) {
        // console.log(prfx);
        if (message.content.toLowerCase().startsWith(prfx)) {
            prefixFound = true;
            break;
        }
    }
    if (!prefixFound) return;
    const prefix = prfx;  // THIS VALUE IS NOT NECESSARILY "prefix" FROM CONFIG.JSON

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && !message.guild)
        return message.channel.send("PLEASE DO DO DO THIS ONE IN A GUILD NOT IN THE DIRECT MESSAGES PLEASE THANK YOU THANK YOU THANK YOU");

    if (command.availableInGuilds && !command.availableInGuilds.includes(message.guild.id))
        return message.channel.send("not available in this server");

    if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('stoop! you are not to do this one one');
		}
	}

    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || default_cd) * 1000;

    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.channel.send(`turbo fast as heck fellow1! wait some ${timeLeft.toFixed(1)} time`);
    }

    if (message.author.id != owner)
        timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply("running command resulted in a bad one (ask the guy if this part of the bot is under development!)");
    }
});

    

// let american = client.channels.fetch('827632032234340352')
//     .then(channel => channel.send("ban him"))
//     .catch(console.log("There's no channel with that ID."));
