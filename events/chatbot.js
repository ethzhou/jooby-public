// node-fetch for making HTTP requests
const fetch = require('node-fetch');
API_URL = 'https://api-inference.huggingface.co/models/ethzhou/newJooby';

const CHAT_CHANNELS = [
    // '830685694644584469',  // 𝕆𝕗𝕗𝕚𝕔𝕒𝕝 𝕄𝕔ℂ𝕦𝕔𝕜lord 𝕃𝕠𝕦𝕟𝕘𝕖 #jooby-development
    '901009778023747604',  // 𝕆𝕗𝕗𝕚𝕔𝕒𝕝 𝕄𝕔ℂ𝕦𝕔𝕜lord 𝕃𝕠𝕦𝕟𝕘𝕖 #jooby-development
    '888262045156405278',  // House of Commons #secretary—jooby-bot-conversing-playground
    '888294345424384020',  // 1046 Colorado Place, Palo Alto, CA, 94303 #ministry-of-love
];

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Ignore messages from the bot itself
        if (message.author.id == message.client.user.id) {
            return;
        }
        
        // Respond only in certain channels
        if (CHAT_CHANNELS.indexOf(message.channel.id) == -1) {
            return;
        }

        // Form the payload
        const payload = {
            inputs: {
                text: message.content
            }
        };
        // Form the request headers with Hugging Face API key
        const headers = {
            'Authorization': 'Bearer ' + process.env.HUGGINGFACE_TOKEN
        };

        // Set status to typing
        message.channel.sendTyping();
        // Query the server
        const response = await fetch(API_URL, {
            method: 'post',
            body: JSON.stringify(payload),
            headers: headers
        });
        const data = await response.json();
        let botResponse = '';
        if (data.hasOwnProperty('generated_text')) {
            botResponse = data.generated_text;
        } else if (data.hasOwnProperty('error')) {  // Error condition
            botResponse = data.error;
        }
        // Stop typing
        // message.channel.stopTyping();

        // Send message to channel as a reply
        if (botResponse !== "Model ethzhou/newJooby is currently loading")
            message.channel.send(botResponse.substr(0, 2000));
    }
}