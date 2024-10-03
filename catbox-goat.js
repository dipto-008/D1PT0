const axios = require("axios");

module.exports.config = {
  name: "catbox",
  aliases: ["cat","cb"],
  version: "1.6.9",
  author: "Nazrul",
  role: 0,
  category: "utility",
  Description: "Convert mp4/mp3/image to link",
  countdown: 5,
  guide: {
    en: "reply to a mp4/mp3/image to upload in catbox"
  }
}

module.exports.onStart = async ({ api, event }) => {
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
