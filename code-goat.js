const fs = require("fs");
const request = require("request");
const baseApiUrl = async () => {
  const base = await require("axios").get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "code",
  version: "6.9.0",
  role: 2,
  author: "dipto",
  usePrefix: true,
  description: "Convert code into link",
  category: "goatbot",
  guide: { en: "[filename]/[reply and file name]" },
  countDown: 1,
};

module.exports.onStart = async function ({ api, event, args }) {
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
  const path = `scripts/cmds/${fileName}.js`;
  try {
    let code = "";
    if (event.type === "message_reply") {
      code = event.messageReply.body;
    } else {
      code = await fs.promises.readFile(path, "utf-8");
    }
    const en = encodeURIComponent(code);
    const options = {
      url: `${await baseApiUrl()}/paste`,
      method: "POST",
      json: true,
      body: {
        code: en,
        name: `${fileName}.js`,
      },
    };
    request(options, (error, response, body) => {
      if (error) {
        api.sendMessage(
          "Error occurred while processing the command.",
          event.threadID,
          event.messageID,
        );
        return;
      }
      const diptoUrl = body.url;
      api.sendMessage(diptoUrl, event.threadID, event.messageID);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    api.sendMessage(
      "Error occurred while processing the command.",
      event.threadID,
      event.messageID,
    );
  }
};
