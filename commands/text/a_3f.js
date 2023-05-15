const fs = require("fs");

module.exports = {
    name: 'A_3F',
    aliases: ['A?'],
    description: '?????? with extra pungency mmmmm',
    cooldown: 0,
    execute(message) {
        function weightedDistribution(dict) {
            const keys = Object.keys(dict);
            let cumm = 0, sum = keys.map(key => dict[key])
                                    .reduce((a, b) => a + b, 0);
            let r = Math.floor(Math.random() * sum);
            for (const key of keys)
            {
                cumm += dict[key];
                if (r <= cumm) return key;
            }   
        }

        const A_3F_Model = JSON.parse(fs.readFileSync("./commands/text/a_3f/model.json"));
        // console.log(A_3F_Model);
        const min_len = A_3F_Model.min_len, max_len = A_3F_Model.max_len, markov = A_3F_Model.markov;

        // console.log(markov["\r"]);
        let length = Math.floor(Math.random() * (max_len - min_len)) + min_len, 
            generated = weightedDistribution(markov["\r"]);
        for(let i = 0; i < length; i++)
        {
            generated += weightedDistribution(markov[generated[generated.length - 1]])
        }
        // console.log(generated);

        return message.delete()
            .then(msg => {
                msg.channel.send(generated)
                    .then(m => console.log(`Bot successfully sent ${m.content}`))
            })
            .catch(err => console.log(err));
    },
};