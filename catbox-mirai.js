const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

(module.exports.config = {
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
},

module.exports.run = async ({ api, event }) => {
  try {
   const allUrl = event.messageReply?.attachments[0]?.url;

   if (!allUrl) {
        return api.sendMessage("❌ Please reply to a attachment for Upload..!", event.threadID, event.messageID);
      };
 
   const msg = await api.sendMessage("✨ Uploading Your attachment.. Please Wait✨", event.threadID);

   const { data } = await axios.get(`${await baseApiUrl()}/catbox?url=${encodeURIComponent(allUrl)}`);

  await api.unsendMessage(msg.messageID);

     api.sendMessage(`✅ Here's your Uploaded Url ✨\n\n`+ data.url , event.threadID, event.messageID);
        
  } catch (e) {
    api.sendMessage("❌ error while uploading your attachment.", event.threadID);
  }
  });
