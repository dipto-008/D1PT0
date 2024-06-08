const axios = require('axios');
const link = "https://noobs-api2.onrender.com/dipto"
module.exports.config ={
    name: "imgur",
    version: "6.9",
    credits: "dipto",
    countDown: 5,
    hasPermssion: 0,
    usePrefix: true,
    commandCategory: "media",
    description: "convert image/video into Imgur link",
    usages: "reply [image, video]"
  },

module.exports.run = async function ({ api, event }) {
    const dip = event.messageReply?.attachments[0]?.url;
    if (!dip) {
      return api.sendMessage('Please reply to an image or video.', event.threadID, event.messageID);
    }
    try {
      const res = await axios.get(`${link}/imgur?url=${encodeURIComponent(dip)}`);
      const dipto = res.data.data;
         api.sendMessage(dipto, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage('Failed to convert image or video into link.', event.threadID, event.messageID);
    }
  };
