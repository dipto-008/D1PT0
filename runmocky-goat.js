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
  role: 2,
  author: "dipto",
  usePrefix: true,
  description: "Convert code into link",
  category: "convert",
  guide: { en: "[filename]/[reply and file name]" },
  countDown: 1,
};

module.exports.onStart = async function ({ api, event, args }) {
  const admin = "100044327656712";
  const fileName = args[0];
  if (!admin.includes(event.senderID)) {
    api.sendMessage(
      "⚠ | You do not have permission to use this command.",
      event.threadID,
      event.messageID,
    );
    return;
  }
  const filePath = `scripts/cmds/${fileName}.js`;
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
