const randint = n => Math.floor(Math.random() * n);
const randelem = arr => arr[randint(arr.length)];

module.exports = {
	name: 'messageCreate',
	execute(message) {
        if (message.author.id === message.client.user.id) return;
        
        const greetings = ["hey", "yo", "what's up", "hi", "hello", "hello?"];

        const payAttention = greetings.includes(
            message.content.toLowerCase().replace(/[.!?]+/g, '')
        );

        if (payAttention) {

            const responses = ["hey", "yo", "hi", "hello", "bojour!"];
            const address = ["guy", "person", "folk"];
            const followups = ["what is going?", "how does it go?", "how's the day"];

            message.channel.awaitMessages(msg => msg.author.id !== message.author.id, { max: 1, idle: 100000, errors: ['idle'] })
            .then(collected => { return; })
            .catch(collected => {
                let response = `${randelem(responses)} `;
                if (!randint(3)) 
                    response += randelem(address);
                if (!randint(3)) 
                    for (let i = 0; i < randint(7); i++) response += "!";
                response += " ";
                if (!randint(7)) 
                    response += randelem(followups);

                message.channel.send(response);
            });
        }
	},
};