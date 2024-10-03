const axios = require("axios");

module.exports.config = {
  name: "catbox",
  version: "1.6.9",
  credits: "Nazrul",
  hasPermission: 0,
  commandCategory: "utility",
  usePrefix: true,
  Prefix: true,
  description: "Convert mp4/mp3/image to link",
  cooldowns: 5,
  usages: "reply to a mp4/mp3/image to upload in catbox"
}

module.exports.run = async ({ api, event }) => {
  try {
   const allUrl = event.messageReply?.attachments[0]?.url;
 
   const msg = await api.sendMessage("✨ Uploading Your attachment.. Please Wait✨", event.threadID);

   const { data } = await axios.get(`https://www.noobs-api.000.pe/dipto/catbox?url=${encodeURIComponent(allUrl)}`);

  await api.unsendMessage(msg.messageID);

     api.sendMessage(`✅ Here's your Uploaded Url ✨\n\n`+ data.url , event.threadID, event.messageID);
        
  } catch (e) {
    api.sendMessage("❌ error while uploading your attachment.", event.threadID);
  }
  };
