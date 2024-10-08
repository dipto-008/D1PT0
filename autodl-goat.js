const axios = require("axios");
const fs = require("fs");
const { shortenURL } = global.utils;
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "autodl",
    version: "1.0.1",
    author: "Dipto",
    countDown: 0,
    role: 0,
    description: {
      en: "Auto download video from tiktok, facebook, Instagram, YouTube, and more",
    },
    category: "media",
    guide: {
      en: "[video_link]",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event }) {
    let dipto = event.body ? event.body : "";

    try {
      if (
        dipto.startsWith("https://vt.tiktok.com") ||
        dipto.startsWith("https://www.tiktok.com/") ||
        dipto.startsWith("https://www.facebook.com") ||
        dipto.startsWith("https://www.instagram.com/") ||
        dipto.startsWith("https://youtu.be/") ||
        dipto.startsWith("https://youtube.com/") ||
        dipto.startsWith("https://x.com/") ||
        dipto.startsWith("https://twitter.com/") ||
        dipto.startsWith("https://vm.tiktok.com") ||
        dipto.startsWith("https://fb.watch")
      ) {
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

        const path = __dirname + `/cache/diptoo.mp4`;
          if(!fs.existsSync(path)){
        fs.mkdir(__dirname + '/cache');
      }
        const { data } = await axios.get(
          `${await baseApiUrl()}/alldl?url=${encodeURIComponent(dipto)}`,
        );
        const vid = (
          await axios.get(data.result, { responseType: "arraybuffer" })
        ).data;

        fs.writeFileSync(path, Buffer.from(vid, "utf-8"));
        const url = await shortenURL(data.result);
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        api.sendMessage(
          {
            body: `${data.cp || null}\n✅ | Link: ${url || null}`,

            attachment: fs.createReadStream(path),
          },
          event.threadID,
          () => fs.unlinkSync(path),
          event.messageID,
        );
      }
    } catch (e) {
      api.setMessageReaction("❎", event.messageID, (err) => {}, true);
      api.sendMessage(e, event.threadID, event.messageID);
    }
  },
};
