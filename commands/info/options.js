const Discord = require("discord.js");
const { prefix, default_cd } = require("../../config.json")

module.exports = {
	name: 'options',
	aliases: ['option'],
	description: 'Some commands have special options which can be passed as parameters following the usual arguments, available when <...options> is specified as an optional parameter by the `help` command.',
	usage: '<command name>',
	cooldown: 1,
	async execute(message, args) {
        if (!args.length) return message.reply(`You didn't pass any command name, ${message.author}!`);

        const { commands } = message.client;
        
        console.log(args.length);
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) return message.reply(`There is no command with name or alias \`${commandName}\`!!!!!!!`);
        if (command.availableInGuilds && !command.availableInGuilds.includes(message.guild.id))
            return message.reply(`this command is not available in this this this place`);
        if (!command.options) return message.reply(`The  command \`${command.name}\` has no extra  options         .`)

        // const clientGuildUser = await message.guild.members.fetch(message.client.user);  // Type Promise<GuildMember>
        const roleColor = message.guild.me.roles.color.hexColor || '#fffffe';

        console.log(`roleColor: ${roleColor}`);

        const commandHelpEmbed = new Discord.MessageEmbed()
            .setColor(roleColor)
            .setTitle("COMMAND OPTIONS");

        commandHelpEmbed.addField("Command", `\`${command.name}\``);
        commandHelpEmbed.addField(
            "Switches",
            "`" + command.options.map(option => `${option.switches.join(", ")} ${option.usage || ""}`).join('\n') + "`",
            true
            );
        commandHelpEmbed.addField(
            "Description",
            command.options.map(option => option.description).join('\n'),
            true
            );
        
        message.reply({ embeds: [commandHelpEmbed], split: true });
	},
};