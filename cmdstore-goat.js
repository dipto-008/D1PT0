const axios = require("axios");
const availableCmdsUrl =
  "https://raw.githubusercontent.com/Blankid018/D1PT0/main/availableCmds.json";
const cmdUrlsJson =
  "https://raw.githubusercontent.com/Blankid018/D1PT0/main/cmdUrls.json";

const ITEMS_PER_PAGE = 20;

module.exports.config = {
  name: "cmdstore",
  aliases: ["cs", "cmds"],
  author: "Dipto",
  role: 0,
  version: "2.0",
  description: {
    en: "Commands Store of Dipto",
  },
  countDown: 3,
  category: "goatbot",
  guide: {
    en: "{pn} [page number]",
  },
};

module.exports.onStart = async function ({ api, event, args }) {
  const page = parseInt(args[0]) || 1;
  try {
    const response = await axios.get(availableCmdsUrl);
    const cmds = response.data.cmdName;
    const totalPages = Math.ceil(cmds.length / ITEMS_PER_PAGE);

    if (page < 1 || page > totalPages) {
      return api.sendMessage(
        `❌ | 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗽𝗮𝗴𝗲 𝗻𝘂𝗺𝗯𝗲𝗿. 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝗻𝘂𝗺𝗯𝗲𝗿 𝗯𝗲𝘁𝘄𝗲𝗲𝗻 1 𝗮𝗻𝗱 ${totalPages}.`,
        event.threadID,
        event.messageID
      );
    }

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const cmdsToShow = cmds.slice(startIndex, endIndex);
    let msg = `🧾 | 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 | 📌\n𝙿𝚊𝚐𝚎 ${page} 𝚘𝚏 ${totalPages}\n\n`;

    cmdsToShow.forEach((cmd, index) => {
      msg += `${startIndex + index + 1}. ${cmd.cmd} (𝐀𝐮𝐭𝐡𝐨𝐫: ${cmd.author})\n`;
    });

    if (page < totalPages) {
      msg += `\n𝚃𝚢𝚙𝚎 "${this.config.name} ${page + 1}" 𝚏𝚘𝚛 𝚖𝚘𝚛𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜.`;
    }

    api.sendMessage(
      msg,
      event.threadID,
      (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          cmdName: cmds,
          page: page
        });
      },
      event.messageID
    );
  } catch (error) {
    api.sendMessage(
      "❌ | Failed to retrieve commands.",
      event.threadID,
      event.messageID
    );
  }
};

module.exports.onReply = async function ({ api, event, Reply }) {
  if (Reply.author != event.senderID) {
    return api.sendMessage("𝗪𝗵𝗼 𝗮𝗿𝗲 𝘆𝗼𝘂🐸", event.threadID, event.messageID);
  }

  const reply = parseInt(event.body);
  const startIndex = (Reply.page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  if (isNaN(reply) || reply < startIndex + 1 || reply > endIndex) {
    return api.sendMessage(
      `❌ | Please reply with a number between ${startIndex + 1} and ${Math.min(endIndex, Reply.cmdName.length)}.`,
      event.threadID,
      event.messageID
    );
  }

  try {
    const cmdName = Reply.cmdName[reply - 1].cmd.replace(/-/g, "_");
    const response = await axios.get(cmdUrlsJson);
    const selectedCmdUrl = response.data[cmdName];

    if (!selectedCmdUrl) {
      return api.sendMessage(
        "❌ | Command URL not found.",
        event.threadID,
        event.messageID
      );
    }

    api.unsendMessage(Reply.messageID);
    api.sendMessage(selectedCmdUrl, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(
      "❌ | Failed to retrieve the command URL.",
      event.threadID,
      event.messageID
    );
  }
};