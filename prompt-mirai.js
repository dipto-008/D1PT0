const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};
module.exports.config ={
    name: "prompt",
    version: "6.9",
    credits: "dipto",
    countDown: 5,
    hasPermssion: 0,
    description: " image to prompt",
    category: "tools",
    commandCategory: "tools",
    usePrefix: true,
    prefix: true,
    usages: "reply [image]"
  },

module.exports.run = async ({ api, event,args }) =>{
    const dip = event.messageReply?.attachments[0]?.url || args.join(' ');
    if (!dip) {
      return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
    }
    try {
      const prom = (await axios.get(`${await baseApiUrl()}/prompt?url=${encodeURIComponent(dip)}`)).data.data[0].response;
         api.sendMessage(prom, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage('Failed to convert image into text.', event.threadID, event.messageID);
    }
  };
