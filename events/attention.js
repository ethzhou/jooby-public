const randint = n => Math.floor(Math.random() * n);
const randelem = arr => arr[randint(arr.length)];

module.exports = {
	name: 'messageCreate',
	execute(message) {
        if (message.author.id === message.client.user.id) return;
        if (message.content.search(/(^j|\sj)oob(y$|y\s)/i) === -1  // "jooby" with whitespace or start of string or end of string around
            && message.content.indexOf(message.client.user.id) === -1) return;

        const greetings = [
            "h", "he", ": <", ":", ":=", ":_", "- : -", "=:", "_:", ":h", ":t", "<<:",
        ];
        
        setTimeout(
            () => { message.channel.send(randelem(greetings)) },
            3000
        );
	},
};