const { owner } = require("../../config.json");
const fs = require('fs');

module.exports = {
	name: 'reload',
	description: 'Reloads a command so that its function updates if a change was made. arg should be the name specified in the corresponding js file.',
    usage: '[command name]',
	hide: true,  // hides command from being listed from j?help
	execute(message, args) {
        if (message.author != owner) return message.channel.send('stoop! you are the not the flat fish');

		if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`!!!!!!!`);

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));
        console.log(`folderName: ${folderName} of requested command: ${commandName} to reload`)

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } 
        catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading command \`${command.name}\`:\n\`${error.message}\``);
        }

        message.channel.send(`the comand \`${command.name}\` has did reloaded`);
	},
};