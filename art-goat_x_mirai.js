const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const APIURL = "https://rexy-apis-production.up.railway.app/api/art";

const config = {
    name: "art",
    aliases: ["artimg"],
    version: "2.9.0",
    author: "Rexy", // don't change  author :)
    credits: "Rexy",
    cooldowns: 8,
    countDown: 8,
    role: 0,
    description: "Apply art effect to mentioned user, replied image, or your avatar",
    category: "TOOLS",
    commandCategory: "TOOLS",
    guide: "{pn} [mention | reply image]",
    usages: "art [mention | reply image]"
  };

 const onStart = async function ({ event, args, api }) {
    try {
      const { senderID, mentions, type, messageReply } = event;
      const message = {};
      message.reply = async function (msg, cb) {
        if (typeof msg === "string") {
          return api.sendMessage(msg, event.threadID, cb, event.messageID);
        }
        if (typeof msg === "object") {
          return api.sendMessage(msg, event.threadID, cb, event.messageID);
        }
      };
      message.reaction = async function (emoji, msgID) {
        return api.setMessageReaction(emoji, msgID || event.messageID, () => {}, true);
      };
      const uid = Object.keys(mentions)?.[0] || (messageReply?.senderID || senderID);

      // Add reaction and waiting message
      await message.reaction("⏳", event.messageID);
      const wm = await message.reply("⏳ Please wait, generating your art image ✨");

      let imageUrl;
      if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
        imageUrl = messageReply.attachments[0]?.url;
      } else {
        imageUrl = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`;
      }

      const apiResponse = await axios.get(`${APIURL}?url=${encodeURIComponent(imageUrl)}`);

      if (
        apiResponse.data &&
        apiResponse.data.data &&
        Array.isArray(apiResponse.data.data.text2ImageVoList) &&
        apiResponse.data.data.text2ImageVoList.length > 0
      ) {
        const artImageUrl = apiResponse.data.data.text2ImageVoList[0].resultUrl;
        const imgPath = __dirname + '/cache/art.png';
        const imageResp = await axios.get(artImageUrl, { responseType: "arraybuffer" });
        await fs.writeFileSync(imgPath, imageResp.data);
        api.unsendMessage(wm.messageID);
        await message.reply({
          body: " Here’s your art image ✨",
          attachment: fs.createReadStream(imgPath)
        });

        fs.unlinkSync(imgPath);
      } 
    } catch (err) {
      message.reply("❌ Failed to get art image");
      console.error("❌ Art API Error:", error );
     }
  };

module.exports = {
  onStart,
  config,
  run: onStart
};
