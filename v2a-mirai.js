const axios = require("axios");
const fs = require("fs-extra");
module.exports = {
  config: {
    name: "v2a",
    description: "Convert Video to audio ",
    version: "1.2",
    credits: "dipto",
    cooldowns: 20,
    commandCategory: "media",
    usages: "{p}{n}",
    usePrefix: true, 
    hasPermission: 0
  },
  run: async function ({ api, event }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        message.reply("Please reply to a video message to convert it to audio.");
        return;
      }

      const dipto = event.messageReply.attachments[0];
      if (dipto.type !== "video") {
        api.sendMessage("The replied content must be a video.", threadID, messageID);
        return;
      }
      const { data } = await axios.get(dipto.url, { method: 'GET', responseType: 'arraybuffer' });
 const path = __dirname + `/assets/dvia.m4a`
      fs.writeFileSync(path, Buffer.from(data, 'utf-8'));

      const audioReadStream = fs.createReadStream(path);
      const msg = { body: "", attachment: [audioReadStream] };
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (e) {
      console.log(e);
api.sendMessage(e.message, threadID, messageID)
    }
  },
};