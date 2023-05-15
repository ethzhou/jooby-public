const fs = require("fs")

module.exports = {
    name: 'corn',
    description: 'your favorite vegetable, grain, and fruit.',
    execute(message, args) {
        const client = message.client;

        const jokes = JSON.parse(fs.readFileSync("./commands/text/corn/jokes.json")).jokes;
        const rand = Math.floor(Math.random() * jokes.length);
        const joke = jokes[rand];

        message.channel.send(joke.Q)
        .then(() => {
            message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: 6000, errors: ['time'] })
            .then(collected => {
                message.channel.send(joke.A);
            })
            .catch(collected => {
                message.channel.send(`${message.author} ${joke.A}`);
            });
        })
        .then(() => {
            if (Math.floor(Math.random() * 5)) {
                setTimeout(
                    () => {    
                        const r = Math.floor(Math.random() * 3);
                        // console.log(`${r} big`);
                        for (let i = 0; i < r; i++)
                            message.channel.send({ 
                                files: ["./commands/text/corn/corned.png"],
                                files: ["https://cdn.discordapp.com/attachments/831003773651648513/894363332264468571/corned.png"] ,
                            });
                    },
                    3000
                )
            }
        })
        .catch(err =>
            console.log(err)
        );
        
    },
}