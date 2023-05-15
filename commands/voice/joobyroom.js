const Discord = require("discord.js");
const { owner } = require("../../config.json");

const idleUntilDelete = 20_000;  // ms
const shutdownTimer = 300_000;  // ms

module.exports = {
	name: 'joobyroom',
	aliases: ['session', 'jroom', 'requestvc', 'jvc', 'rvc', 'temporaryvc', 'tempvc', ],
	description: `Create a temporary VC for anyone for a certain number of people, so that the for not annoying. The VC is deleted after being empty for ${idleUntilDelete/1000} seconds.
The VC is created in the category called jooby, if it exists, else it is created in voice channels, if it exists, and finally just at the top if neither is found.`,
    options: [
        { name: "--name", switches: ["--name", "-n"], usage: "NAME", description: "Give the channel a custom name.", nArgs: 1 },
        { name: "--limit", switches: ["--limit", "-l"], usage: "NUMBER", description: "Set the limit of the channel. (default first arg)", nArgs: 1 },
        { name: "--dc-deaf", switches: ["--dc-deaf"], usage: "SECONDS", description: "Set the amount of time before deafened users are disconnected from the jooby room. (set to 0 for no disconnections, default 360)", nArgs: 1 },
    ],
	usage: '[userLimit] <...options>',
	cooldown: idleUntilDelete/500,
    guildOnly: true,
	async execute(message, args) {
        let params = { NAME: undefined, LIMIT: args[0], DCDEAF: 360 };
        for (let i = 0; i < args.length; i++) {
            const msgArg = args[i];
            console.log(args[i]);
            const cmdOption = this.options.find(option => option.switches.includes(msgArg));
            if (!cmdOption) continue;
            console.log(cmdOption)

            for (let j = 0; j < cmdOption.nArgs && i < args.length; j++) {
                i++;
                switch (cmdOption.name)
                {
                case "--name":
                    params.NAME = args[i];
                    break;
                case "--limit":
                    params.LIMIT = args[i];
                    break;
                case "--dc-deaf":
                    params.DCDEAF = args[i];
                    break;
                }
            }
        }
        if (params.NAME) params.NAME = params.NAME.replace(/_/g, ' ');
        params.LIMIT = parseInt(params.LIMIT);
        params.DCDEAF = parseInt(params.DCDEAF);
        
        console.log(params);
        
        const author = message.author;

        let channelName = `${author.username} ${author}'s jooby room | j?help jvc`;
        let channelPrefix = params.NAME;
        let channelMiddle = ` — `;
        if (params.NAME) {
            const channelNameOverflow = (channelPrefix + channelMiddle + channelName).length - 100;  // 100 is max channel name length
            if (channelNameOverflow > 0) {
                channelPrefix = params.NAME.substr(0, params.NAME.length - channelNameOverflow - 3) + "...";
            }
            channelName = channelPrefix + channelMiddle + channelName;
        }

        const limit = typeof params.LIMIT !== 'number' || params.LIMIT > 99 ? undefined : params.LIMIT;

        const { channels } = message.guild;
        let category;
        // console.log(Array.from(channels.cache.values()).filter(chnl => chnl.type === "category").map(c => c.name));
        for (const ctgy of Array.from(channels.cache.values()).filter(chnl => chnl.type === 'GUILD_CATEGORY')) {
            console.log(`filtered category: ${ctgy}`)
            if (ctgy.name.toLowerCase() === "jooby") {
                category = channels.cache.get(ctgy.id);
                break;
            }
            else if (ctgy.name.toLowerCase() === "voice channels") {
                category = channels.cache.get(ctgy.id);
            }
            
        }
        // console.log(`${category.name} ${category.id} ${category.position}`);

        const newChannel = await channels.create(
            channelName, 
            { 
                type: 'GUILD_VOICE',
                userLimit: limit,
                parent: category ? category.id : null,
            }
        );
        console.log(`newChannel ${newChannel} position ${newChannel.position} in ${newChannel.parent}`);

        message.channel.send(`${message.author} Your VC ${newChannel} has been created in ${category ? category : message.guild}.·  :   ) enjo`);

        let vcDeletionTimeout, deafenedUserTimeouts = new Discord.Collection();

        // Function for deleting VC
        function deleteVC() {
            message.client.off("voiceStateUpdate", VCUpdate);
            message.client.off("messageCreate", checkForShutdown);
            if (vcDeletionTimeout)
                vcDeletionTimeout = clearTimeout(vcDeletionTimeout);  // = undefined

            if (!newChannel.deleted)
                return newChannel.delete();
            else return;
        }
        
        // Runs on message send to check if jongy wants to shutdown jooby rooms
        function checkForShutdown(msg) {
            if (msg.author == owner && msg.content === `j?shutdownjoobyrooms`) {
                message.channel.send(`${message.author} BEEP BEEP BOOP BOOP JOOP JOOP THE JONGY GUY HAS REQUESTED THE SHUT DOWN OF ALL JOOBY ROOMS IN ABOUT FIVE MINUTES!!!!!!!!!!`);  // message.author is the person who made the jooby room
                setTimeout(deleteVC, shutdownTimer);
            }
        }

        // Delete VC after timeout if VC is empty for certain amount of time
        function emptyVCTimeout() {
            return setTimeout(() => {
                if (!newChannel.members.size) {
                    deleteVC();
                    message.channel.send(`${message.author} Your VC has been deleted due to the ${idleUntilDelete/1000} second and empty.`);
                }
            }, idleUntilDelete);
        }

        // Add a timeout for deafened user in a jooby room
        function addDeafenedUserTimeout(newState) {
            if (!deafenedUserTimeouts.has(newState.id)) {
                console.log(`${newState.member.user.tag} added to deafened of jooby room ${newState.channel.name} (${newState.channel})`);
                deafenedUserTimeouts.set(newState.id, dcDeafenedTimeout(newState));
            }
        }

        // Remove timeout of user who is no longer deafened in a jooby room
        function deleteDeafenedUserTimeout(oldState) {
            if (deafenedUserTimeouts.has(oldState.id)) {
                console.log(`${oldState.member.user.tag} deleted from deafened of jooby room ${oldState.channel.name} (${oldState.channel})`);
                clearTimeout(deafenedUserTimeouts.get(oldState.id))
                deafenedUserTimeouts.delete(oldState.id);
            }
        }

        function dcDeafenedTimeout(deafenedState) {
            return setTimeout(() => {
                if (deafenedState.channelID === newChannel.id && deafenedState.deaf) {
                    deafenedState.setChannel(message.guild.afkChannel || null);
                    deafenedUserTimeouts.delete(deafenedState.id);
                    message.channel.send(`${deafenedState.member.user} You were disconnected from ${newChannel} due to the ${params.DCDEAF} second and deafened.`);
                }
            }, params.DCDEAF * 1000);
        }

        function VCUpdate(oldState, newState) {
            if (oldState.member.user.bot) return;
            
            // console.log(`params.DCDEAF: ${params.DCDEAF}`);
            if (params.DCDEAF) {
                if (newState.channelID === newChannel.id && newState.deaf)
                    addDeafenedUserTimeout(newState);
                else
                    deleteDeafenedUserTimeout(oldState);
            }
            
            if (newChannel.members.size) {
                if (vcDeletionTimeout)
                    vcDeletionTimeout = clearTimeout(vcDeletionTimeout);  // = undefined
            }
            else {
                vcDeletionTimeout = emptyVCTimeout();
            }
        }

        message.client.on("voiceStateUpdate", VCUpdate);
        message.client.on("messageCreate", checkForShutdown);
        
        vcDeletionTimeout = emptyVCTimeout();  // Run this once for creation of jooby room
	},
};