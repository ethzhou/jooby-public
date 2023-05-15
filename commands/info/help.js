const Discord = require("discord.js");
const { prefix, default_cd } = require("../../config.json");

module.exports = {
	name: 'help',
	aliases: ['commands'],
	description: 'List all of my commands or info about a specific command.',
	usage: '<command name>',
	cooldown: 1,
	async execute(message, args) {
        const { commands } = message.client;
        
        if (!args.length) {
            const data = [];
            data.push('my capabiities  ::');
            data.push(commands.filter(command => !command.hide && (!command.availableInGuilds || command.availableInGuilds.includes(message.guild.id)))
                .map(command => `\`${command.name}\``)
                .join(', ')
            );
            data.push(`\nYou can send \`${prefix}help [command name]\` to for info`);

            return message.reply({ content: data.join('\n'),  split: false })
                .then(() => {
                
                })
                .catch(error => {
                    console.error(`Could not send help to ${message.author.tag}.\n`, error);
                    message.reply('i cannot do mesage you, tr exist');
                });
        }
        
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`There is no command with name or alias \`${name}\`!!!!!!!`);
        }

        if (command.availableInGuilds && !command.availableInGuilds.includes(message.guild.id))
            return message.reply(`this command is not available in this this this place`);

        // const clientGuildUser = await message.guild.members.fetch(message.client.user);  // Type Promise<GuildMember>
        const roleColor = message.guild.me.roles.color.hexColor || '#fffffe';

        console.log(`roleColor: ${roleColor}`);

        const commandHelpEmbed = new Discord.MessageEmbed()
            .setColor(roleColor)
            .setTitle(`COMMAND HELP: ${command.name.toUpperCase()}`);

        commandHelpEmbed.addField("Name", `\`${command.name}\``, true);
        if (command.aliases) commandHelpEmbed.addField(
            "Aliases",
            command.aliases.map(alias => `\`${alias}\``).join('\n'),
            true
            );
        if (command.description) commandHelpEmbed.addField(
            "Description",
            command.description
            );
        if (command.usage) commandHelpEmbed.addField(
            "Usage",
            `\`${prefix}${command.name} ${command.usage}\``
            );
        if (command.options)
            // commandHelpEmbed.addField("Options", `Try \`j?options ${command.name}\` on this command for more options!`);
            commandHelpEmbed.setFooter(`Try \`j?options ${command.name}\` for more options!`);

        const authorPerms = message.channel.permissionsFor(message.author);
        if (command.permissions && (!authorPerms || !authorPerms.has(command.permissions)))
            commandHelpEmbed.setDescription(`${message.author}, you cannot this.`);
        else
            commandHelpEmbed.setDescription(`${message.author}, you can this!`);
        
        message.reply({ embeds: [commandHelpEmbed], split: true })
	},
};