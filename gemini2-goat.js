const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "gemini2",
  version: "1.0.0",
  role: 0,
  author: "dipto",
  description: "gemini ai with multiple conversation",
  usePrefix: true,
  guide: "[message]",
  category: "Ai",
  coolDowns: 5,
};
module.exports.onReply = async function ({ api, event, Reply }) {
  //api.unsendMessage(Reply.messageID);
  const { author } = Reply;
  if (author != event.senderID) return;
  const uid = event.senderID;
  if (event.type == "message_reply") {
    const reply = event.body.toLowerCase();
    if (isNaN(reply)) {
      const response = await axios.get(
        `${await baseApiUrl()}/gemini2?text=${encodeURIComponent(reply)}&senderID=${uid}`,
      );
      const ok = response.data.response;
      await api.sendMessage(
        ok,
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            link: ok,
          });
        },
        event.messageID,
      );
    }
  }
};
module.exports.onStart = async function ({ api, args, event }) {
  const uid = event.senderID;
  try {
    const dipto = args.join(" ").toLowerCase();
    if (!args[0]) {
      api.sendMessage(
        "Please provide a question to answer\n\nExample:\ngemini2 hey",
        event.threadID,
        event.messageID,
      );
      return;
    }
    if (dipto) {
      const response = await axios.get(
        `${await baseApiUrl()}/gemini2?text=${encodeURIComponent(dipto)}&senderID=${uid}`,
      );
      const mg = response.data.response;
      await api.sendMessage(
        { body: mg },
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            link: mg,
          });
        },
        event.messageID,
      );
    }
  } catch (error) {
    console.error(`Failed to get an answer: ${error.message}`);
    api.sendMessage(
      `${error.message}.\nAn error`,
      event.threadID,
      event.messageID,
    );
  }
};
