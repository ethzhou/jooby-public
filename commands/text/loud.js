module.exports = {
    name: 'loud',
    aliases: ['nato'],
    description: 'alert alert—ALPHA, LIMA, ECHO, ROMEO, TANGO',
    usage: '[message]',
    cooldown: 1,
    execute(message, args) {
        if (!args.length) return;
        if (!args.every(word => /^[\x00-\x7F]*$/.test(word))) return;
        
        const NATODict = {
            A: 'ALPHA',
            B: 'BRAVO',
            C: 'CHARLIE',
            D: 'DELTA',
            E: 'ECHO',
            F: 'FOXTROT',
            G: 'GOLF',
            H: 'HOTEL',
            I: 'INDIA',
            J: 'JULIET',
            K: 'KILO',
            L: 'LIMA',
            M: 'MIKE',
            N: 'NOVEMBER',
            O: 'OSCAR',
            P: 'PAPA',
            Q: 'QUEBEC',
            R: 'ROMEO',
            S: 'SIERRA',
            T: 'TANGO',
            U: 'UNIFORM',
            V: 'VICTOR',
            W: 'WHISKY',
            X: 'X-RAY',
            Y: 'YANKEE',
            Z: 'ZULU',
        }

        let data = "";
        for (const word of args) {
            if (Math.floor(Math.random() * Math.max(args.length / 3, 20 / args.length))) {  // A portion of words will pass
                data += word.toUpperCase() + " ";
                continue;
            }

            data += word.toUpperCase() + "—";
            for (const letter of word) {
                const natoLetter = NATODict[letter.toUpperCase()];
                if (natoLetter)
                    data += natoLetter + " ";
            }
            data = data.trim() + "—";
        }

        message.channel.send(data);
    }
}