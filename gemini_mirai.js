const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "gemini",
  version: "1.0",
  hasPermssion: 0,
  credits: "Dipto",
  description: "gemeini ai",
  usePrefix: true,
  commandCategory: "google",
  cooldowns: 5,
};

module.exports.run = async function ({ api, args, event }) => {
    const prompt = args.join(" ");
    //---- Image Reply -----//
    if (event.type === "message_reply") {
      var t = event.messageReply.attachments[0].url;
      try {
        const response = await axios.get(
          `${await baseApiUrl()}/gemini?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(t)}`,
        );
        const data2 = response.data.dipto;
        api.sendMessage(data2, event.threadID, event.messageID);
      } catch (error) {
        console.error("Error:", error.message);
        api.sendMessage(error, event.threadID, event.messageID);
      }
    }
    //---------- Message Reply ---------//
    else if (!prompt) {
      return api.sendMessage(
        "Please provide a prompt or message reply",
        event.threadID,
        event.messageID,
      );
    } else {
      try {
        const respons = await axios.get(
          `${await baseApiUrl()}/gemini?prompt=${encodeURIComponent(prompt)}`,
        );
        const message = respons.data.dipto;
        api.sendMessage(message, event.threadID, event.messageID);
      } catch (error) {
        console.error("Error calling Gemini AI:", error);
        api.sendMessage(
          `Sorry, there was an error processing your request.${error}`,
          event.threadID,
          event.messageID,
        );
      }
    }
  },
};
