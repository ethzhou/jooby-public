const Discord = require("discord.js");
const { prefix, default_cd } = require("../../config.json");

module.exports = {
	name: 'updates',
	aliases: ['update', 'changelogs', 'changelog', 'history', 'diary'],
	description: 'List all of my commands or info about a specific command.',
	cooldown: 1,
	async execute(message, args) {
		message.channel.send(`${message.author} https://docs.google.com/document/d/1rjTkp1oGpiPVYMSnvJ0ff2vs3TiTMUGr0J9fQaYFQIs/edit`);
	},
};