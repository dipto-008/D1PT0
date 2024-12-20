const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

const config = {
  name: "coverphoto",
  aliases: ["cp", "cover"],
  author: "Dipto",
  credits: "Dipto",
  role: 2,
  countDown: 5,
  description: "Get Fb profile cover photo",
  usePrefix: true,
  hasPermission: 2,
  premium: false,
  category: "user",
  commandCategory: "user",
  guide: {
    en: "{pn} [uid/link]",
  },
  usages: "-coverphoto [uid/link]",
  cooldowns: 5,
};

const onStart = async ({ api, event, args }) => {
  try {
    const uid1 = event.senderID;

    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      uid =
        event.type === "message_reply"
          ? event.messageReply.senderID
          : uid2 || uid1;
    }
    const { data } = await axios.get(
      `${await baseApiUrl()}/coverphoto?userName=${uid}`
    );
    if (data) {
      const response = await axios.get(data.data.cover.source, {
        responseType: "stream",
      });

      await api.sendMessage(
        { body: `Username: ${data.data.id}`, attachment: response.data },
        event.threadID,
        event.messageID
      );
    }
  } catch (err) {
    console.log(err);
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports = {
  config,
  onStart,
  run: onStart,
};
