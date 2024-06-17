const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

(module.exports.config = {
  name: "imgur",
  version: "6.9",
  author: "dipto",
  countDown: 5,
  role: 0,
  category: "media",
  description: "convert image/video into Imgur link",
  category: "tools",
  usages: "reply [image, video]",
}),
  (module.exports.onStart = async function ({ api, event }) {
    const dip = event.messageReply?.attachments[0]?.url;
    if (!dip) {
      return api.sendMessage(
        "Please reply to an image or video.",
        event.threadID,
        event.messageID,
      );
    }
    try {
      const res = await axios.get(
        `${await baseApiUrl()}/imgur?url=${encodeURIComponent(dip)}`,
      );
      const dipto = res.data.data;
      api.sendMessage(dipto, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        "Failed to convert image or video into link.",
        event.threadID,
        event.messageID,
      );
    }
  });
