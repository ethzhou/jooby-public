// node-fetch for making HTTP requests
const fetch = require('node-fetch');
API_URL = omitted;

const CHAT_CHANNELS = [
    // GUILD ID,  // SERVER NAME #CHANNEL-NAME
    omitted,
    omitted,
    omitted,
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
