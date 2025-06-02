const fs = require('fs');
const axios = require('axios');
const apiUrl = "https://www.noobs-api.rf.gd/dipto";

module.exports.config = {
  name: "code",
  version: "6.9.0",
  role: 2,
  author: "dipto",
  usePrefix: true,
  description: "Convert code into link",
  category: "convert",
  guide: { en: "[filename]/[reply and file name]" },
  coolDowns: 1
};

module.exports.onStart = async function ({ api, event, args }) {
  const admin = "Admin UID ";
  const fileName = args[0];
  if (!admin.includes(event.senderID)) {
    return api.sendMessage("⚠ | You do not have permission to use this command.", event.threadID, event.messageID);
  }

  const path = `scripts/cmds/${fileName}.js`;

  try {
    let code = '';
    if (event.type === "message_reply") {
      code = event.messageReply.body;
    } else {
      code = await fs.promises.readFile(path, 'utf-8');
    }

    const res = await axios.post(`${apiUrl}/paste`, {
      code,
      name: fileName,
      type: 'js'
    });

    api.sendMessage(res.data.url, event.threadID, event.messageID);
  } catch (error) {
    console.error("An error occurred:", error.message);
    api.sendMessage("❌ | Error occurred while processing the command.", event.threadID, event.messageID);
  }
};
