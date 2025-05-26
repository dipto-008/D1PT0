const axios = require('axios');
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    author: "Nyx",
    countDown: 5,
    role: 0,
    category: "TOOLS"
  },
  
  onStart: async function({ args, threadsData, event, message }) {
    const threadID = event.threadID;
    const firstArg = args[0]?.toLowerCase();
    const secondArg = args[1]?.toLowerCase();
    
    if (["-i", "-image"].includes(firstArg)) {
      if (secondArg === "on") {
        await threadsData.set(threadID, true, "data.prefixImage");
        return message.reply("✅ Image preview is now enabled for this thread.");
      }
      
      if (secondArg === "off") {
        await threadsData.set(threadID, false, "data.prefixImage");
        return message.reply("❌ Image preview is now disabled for this thread.");
      }
      
      return message.reply("Please use: prefix -i on  /  prefix -i off");
    }
    
    return message.reply("Usage:\n- prefix -i on\n- prefix -i off");
  },
  onChat: async function({ event, message, threadsData,usersData }) {
    const { threadID, body } = event;
    if (!body || body.trim().toLowerCase() !== "prefix") return;
    const imageEnabled = await threadsData.get(threadID, "data.prefixImage") || false;
    const data = await usersData.get(global.GoatBot.config.adminBot[0]);
    const msg = `• ${global.GoatBot.config.nickNameBot}\n
• ${global.GoatBot.config.prefix} \n
• ${data.name}\n
• Have a great day!\n
•Admin || https://www.facebook.com/profile.php?id=${global.GoatBot.config.adminBot[0]}`;
    
    if (imageEnabled) {
      const response = await axios({
        method: 'GET',
        url: "https://i.imgur.com/pp6T2Jv.mp4",
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
    message.reply({
        body: msg,
        attachment: response.data
      });
    } else {
       message.reply(msg);
    }
  }
};
