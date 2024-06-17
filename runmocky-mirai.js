const fs = require("fs").promises;
const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "runmocky",
  version: "6.9.0",
  hasPermission: 2,
  credits: "dipto",
  usePrefix: true,
  description: "Convert code into link",
  commandCategory: "convert",
  usages: "[filename]/[reply and file name]",
  cooldowns: 1,
};

module.exports.run = async function ({ api, event, args }) {
  const admin = ["your uid here"];
  const fileName = args[0];
  if (!admin.includes(event.senderID)) {
    api.sendMessage(
      "⚠ | You do not have permission to use this command.",
      event.threadID,
      event.messageID,
    );
    return;
  }
  const filePath = `modules/commands/${fileName}.js`;
  try {
    const code =
      event.type === "message_reply"
        ? event.messageReply.body
        : await fs.readFile(filePath, "utf-8");
    const en = encodeURIComponent(code);
    const url = `${await baseApiUrl()}/runmocky`;
    const response = await axios.post(url, { code: en });
    if (response.data && response.data.data) {
      const diptoUrl = response.data.data;
      api.sendMessage(diptoUrl, event.threadID, event.messageID);
    } else {
      throw new Error("API response does not contain expected data.");
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      api.sendMessage("File not found.", event.threadID, event.messageID);
    } else {
      console.error("An error occurred:", error.message);
      api.sendMessage(
        "Error occurred while processing the command.",
        event.threadID,
        event.messageID,
      );
    }
  }
};
