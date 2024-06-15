const axios = require("axios");
const availableCmdsUrl =
"https://raw.githubusercontent.com/Blankid018/D1PT0/main/availableCmds.json";
const cmdUrlsJson =
"https://raw.githubusercontent.com/Blankid018/D1PT0/main/cmdUrls.json";

module.exports.config = {
  name: "cmdstore",
  credits: "Dipto",
  hasPermission: 0,
  version: "2.0",
  description: "Commands Store of Dipto",
  cooldowns: 3,
  usePrefix: true,
  commandCategory: "Tools",
  usages: "{pn}"
};

module.exports.onStart = async function ({ api, event, args }) {
  if (!args[0]) {
    try {
      const response = await axios.get(availableCmdsUrl);
      const cmds = response.data.cmdName;
      let msg = `🧾 | CMD STORE | 📌\n`;

      cmds.forEach((cmd, index) => {
        msg += `${index + 1}. ${cmd}\n`;
      });

      api.sendMessage(
        msg,
        event.threadID,(error, info) => {
global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            cmdName: cmds,
          });
        },
        event.messageID
      );
    } catch (error) {
      api.sendMessage(
        "Failed to retrieve commands.",
        event.threadID,
        event.messageID,
      );
    }
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (handleReply.author != event.senderID) {
    return api.sendMessage("who are you🐸", event.threadID, event.messageID);
  }

  const reply = parseInt(event.body);
  if (isNaN(reply) || reply < 1 || reply > handleReply.cmdName.length) {
    return api.sendMessage(
      `Please reply with a number between 1 - ${handleReply.cmdName.length}.`,
      event.threadID,
      event.messageID,
    );
  }

  try {
    const cmdName = handleReply.cmdName[reply - 1].replace(/-/g, "_");
    const response = await axios.get(cmdUrlsJson);
    const selectedCmdUrl = response.data[cmdName];

    if (!selectedCmdUrl) {
      return api.sendMessage(
        "Command URL not found.",
        event.threadID,
        event.messageID,
      );
    }

    api.sendMessage(selectedCmdUrl, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(
      "Failed to retrieve the command URL.",
      event.threadID,
      event.messageID,
    );
  }
};