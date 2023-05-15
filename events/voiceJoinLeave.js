module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState) {
        const channel = oldState.channel || newState.channel;
        try {
            if (!channel.guild) {
                // console.log(`[${message.channel.recipient.tag}] ${message.author.tag} sent: ${message.content}`);
            } 
            else {
                if (oldState.channel && newState.channel && oldState.channel.id === newState.channel.id) {
                    
                }
                else {
                    const time = new Date(Date.now()).toLocaleTimeString('en-GB');
                    if (oldState.channel) {
                        console.log(`${time} [${channel.guild.name}] ${oldState.member.user.tag} left #${oldState.channel.name}`);
                    } 
                    if (newState.channel) {
                        console.log(`${time} [${channel.guild.name}] ${newState.member.user.tag} joined #${newState.channel.name}`);
                    }
                }
            }
        }
        catch(err) {
            console.log(err);
            console.log(oldState);
            console.log(newState);
        }
    },
};