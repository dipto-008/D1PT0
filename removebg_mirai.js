const axios = require("axios");
const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
    );
    return base.data.api;
};

module.exports = {
    config: {
        name: "removebg",
        aliases: ["rbg"], 
        version: "1.0", 
        hasPermssion: 0,
        credits: "Mesbah Saxx", // khing Aryan and Aiyan mahi fan
        usePrefix: false,
        prefix: true,
        commandCategory: "utility",
        category: "utility",
        cooldowns: 5,
        usages: "removebg reply with a image"
    }  , 
  run: async ({api , event }) => {
        try {
            if (event.messageReply && event.messageReply.attachments[0]?.url) {
                const imageUrl = event.messageReply.attachments[0].url;
                const response = await axios.get(`${await baseApiUrl()}/rmbg?url=${encodeURIComponent(imageUrl)}`, {
                    responseType: 'stream'
                });
                api.sendMessage({
                    attachment: response.data
                }, event.threadID, event.messageID);
            } else {
                api.sendMessage("Please reply to an image to remove its background.", event.threadID);
            }
        } catch (e) {
            api.sendMessage("An error occurred while processing the command.", event.threadID);
        }
    }
};
