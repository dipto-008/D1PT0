const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "art",
    version: "1.6.9",
    author: "Nazrul",
    role: 0,
    description: "{pn} - Enhance your photos with artful transformations!",
    category: "art",
    countDown: 5,
    guide: { 
      en: "{pn} reply to an image"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      const cp = ["bal","zombie","anime","ghost", "watercolor", "sketch", "abstract", "cartoon","monster"];
      const prompts = args[0] || cp[Math.floor(Math.random() * cp.length)];

      const msg = await api.sendMessage("🎨 Processing your image, please wait...", event.threadID);

      let photoUrl = "";

      if (event.type === "message_reply" && event.messageReply?.attachments?.length > 0) {
        photoUrl = event.messageReply.attachments[0].url;
      } else if (args.length > 0) {
        photoUrl = args.join(' ');
      }

      if (!photoUrl) {
        return api.sendMessage("🔰 Please reply to an image or provide a URL!", event.threadID, event.messageID);
      }

      const response = await axios.get(`${await baseApiUrl()}/art2?url=${encodeURIComponent(photoUrl)}&prompt=${encodeURIComponent(prompts)}`);

      if (!response.data || !response.data.imageUrl) {
        await api.sendMessage("⚠ Failed to return a valid image URL. Please try again.", event.threadID, event.messageID);
        return;
      }

      const imageUrl = response.data.imageUrl;
      await api.unsendMessage(msg.messageID);

      const imageStream = await axios.get(imageUrl, { responseType: 'stream' });

      await api.sendMessage({ 
        body: `Here's your artful image! 🎨`, 
        attachment: imageStream.data 
      }, event.threadID, event.messageID);

    } catch (error) {
      await api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
