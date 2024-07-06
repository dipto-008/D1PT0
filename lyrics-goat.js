const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

(module.exports = {
  config: {
    name: "lyrics",
    version: "1.0",
    author: "Nazrul",
    countDown: 5,
    role: 0,
    description: {
      en: "Get song lyrics with their Images"
    },
    category: "Song Lyrics",
    guide: {
      en: "{pn} <song name>"
    }
  },

  onStart: async ({ api, event, args }) => {
    try {
      const Songs = args.join(' ');
      if (!Songs) {
        return api.sendMessage("Please provide a song name!", event.threadID, event.messageID);
      }

      const res = await axios.get(`${await baseApiUrl()}/lyrics2?songName=${encodeURIComponent(Songs)}`);
      const data = res.data;
      if (!data.title || !data.artist || !data.lyrics) {
        return api.sendMessage("An error occurred while fetching lyrics!", event.threadID, event.messageID);
      }

      const songMessage = { 
        body: `❏♡𝐒𝐨𝐧𝐠 𝐓𝐢𝐭𝐥𝐞: ${data.title}\n\n❏♡𝐀𝐫𝐭𝐢𝐬𝐭: ${data.artist}\n\n❏♡𝐒𝐨𝐧𝐠 𝐋𝐲𝐫𝐢𝐜𝐬:\n\n${data.lyrics}` 
      };
      
      if (data.image) {
        const stream = await axios.get(data.image, { responseType: 'stream' });
        songMessage.attachment = stream.data;
      }

      return api.sendMessage(songMessage, event.threadID, event.messageID);
    } catch (error) {
    api.sendMessage("error: " + error.message, event.threadID, event.messageID);
    }
  }
});
