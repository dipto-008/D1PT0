const shortenURL = require("tinyurl").shorten;
const { get } = require("axios");
const baseApiUrl = async () => {
  const base = await get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "getlink",
    aliases: ["gl", "g"],
    version: "1.0",
    author: "ASIF",
    countDown: 2,
    role: 0,
    description: "𝗚𝗲𝘁 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝘂𝗿𝗹 𝗳𝗿𝗼𝗺 𝘃𝗶𝗱𝗲𝗼, 𝗮𝘂𝗱𝗶𝗼 𝘀𝗲𝗻𝘁 𝗳𝗿𝗼𝗺 𝗴𝗿𝗼𝘂𝗽",
    category: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
    guide:{
     en: "{pn} [--t/t/tinyurl] [reply_attachment]\n{pn} [--i/i/imgbb] [reply_attachment]\n{pn} [--tg/tg/telegraph] [reply_attachment]\n{pn} [reply_attachment]\n{pn} [--p/postimg/postimage] [reply_attachment]\n{pn} [--dc/-d/dc] reply or add link image\n{pn} [--sl/s/shortlink] [reply_attachment]\n{pn} [imgur/imgurl] [reply_attachment]"
    }
  },

  onStart: async function ({ message, args, event }) {
    try {
      let { messageReply, type, senderID } = event;
      let num = 0;
      let length = messageReply.attachments.length;
      var msg = `✅ | 𝙷𝚎𝚛𝚎 𝚒𝚜 𝚢𝚘𝚞𝚛 ${length} 𝚏𝚒𝚕𝚎 𝚊𝚝𝚝𝚊𝚌𝚑𝚎𝚍 <😘\n\n`;
      if (
        args[0] === "--t" ||
        args[0] === "t" ||
        args[0] === "tinyurl" ||
        args[0] == "-t"
      ) {
        if (type !== "message_reply") {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        } else {
          for (let i = 0; i < length; i++) {
            let shortLink = await shortenURL(messageReply.attachments[i].url);
            num += 1;
            msg += `${num}: ${shortLink}\n`;
          }
          message.reply(msg);
        }
      } else if (
        args[0] == "i" ||
        args[0] == "--i" ||
        args[0] == "imgbb" ||
        args[0] == "-i"
      ) {
        if (
          type !== "message_reply" &&
          !["photo", "sticker"].includes(messageReply.attachments[i]?.type)
        ) {
          return message.reply("❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚙𝚑𝚘𝚝𝚘");
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply("❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚙𝚑𝚘𝚝𝚘");
        } else {
          for (let i = 0; i < length; i++) {
            let imgLink = await get(
              `${await baseApiUrl()}/imgbb?url=${encodeURIComponent(messageReply.attachments[i].url)}`,
            );
            num += 1;
            msg += `${num}: ${imgLink.data.data.url}\n`;
          }
          message.reply(msg);
        }
      } else if (
        args[0] == "tg" ||
        args[0] == "telegraph" ||
        args[0] == "-tg" ||
        args[0] == "--tg"
      ) {
        if (type !== "message_reply") {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        } else {
          for (let i = 0; i < length; i++) {
            let shortLink = await shortenURL(messageReply.attachments[i].url);
            const res = await get(`${await baseApiUrl()}/tg?url=${shortLink}`);
            num += 1;
            msg += `${num}: ${res.data.data}\n`;
          }
          message.reply(msg);
        }
      } else if (
        args[0] == "imgur" ||
        args[0] == "imgurl" ||
        args[0] == "-imgur" ||
        args[0] == "--imgur"
      ) {
        if (type !== "message_reply") {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        } else {
          for (let i = 0; i < length; i++) {
            let shortLink = await shortenURL(messageReply.attachments[i].url);
            const res = await get(
              `${await baseApiUrl()}/imgur?url=${shortLink}`,
            );
            num += 1;
            msg += `${num}: ${res.data.data}\n`;
          }
          message.reply(msg);
        }
      } else if (
        args[0] == "dc" ||
        args[0] == "discord" ||
        args[0] == "-d" ||
        args[0] == "--dc"
      ) {
        if (type !== "message_reply") {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        } else {
          for (let i = 0; i < length; i++) {
            const encLink = encodeURIComponent(messageReply.attachments[i].url);
            const res = await get(
              `${await baseApiUrl()}/dc?imageUrl=${encLink}`,
            );
            num += 1;
            msg += `${num}: ${res.data.url}\n`;
          }
          message.reply(msg);
        }
      } else if (
        args[0] == "sl" ||
        args[0] == "shortlink" ||
        args[0] == "-s" ||
        args[0] == "--sl"
      ) {
        if (type !== "message_reply") {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        } else {
          for (let i = 0; i < length; i++) {
            const { data } = await get(
              `${await baseApiUrl()}/linkshort?link=${encodeURIComponent(messageReply.attachments[i].url)}name=${encodeURIComponent(messageReply.attachments[i].filename)}`,
            );
            num += 1;
            msg += `${num}: ${data.shortLink}\n`;
          }
          message.reply(msg);
        }
      } else if (
        args[0] == "--p" ||
        args[0] == "postimg" ||
        args[0] == "postimage" ||
        args[0] == "-p"
      ) {
        if (
          type !== "message_reply" &&
          !["photo", "sticker"].includes(messageReply.attachments[i]?.type)
        ) {
          return message.reply("❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚙𝚑𝚘𝚝𝚘");
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply("❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚙𝚑𝚘𝚝𝚘");
        } else {
          for (let i = 0; i < length; i++) {
            const encLink = encodeURIComponent(messageReply.attachments[i].url);
            const res = await get(
              `${await baseApiUrl()}/postimg?imageUrl=${encLink}`,
            );
            num += 1;
            msg += `${num}: ${res.data.directLink}\n`;
          }
          message.reply(msg);
        }
      }

      if (!args[0]) {
        if (type !== "message_reply")
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        else if (!messageReply.attachments || length == 0)
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        else if (
          (type == "message_reply" && messageReply.attachments) ||
          length !== 0
        ) {
          for (let i = 0; i < length; i++) {
            num += 1;
            msg += `${num}: ${messageReply.attachments[i].url}\n\n`;
          }
          message.reply(msg);
        }
      }
    } catch (err) {
      console.log(err);
      message.reply(`❎ | 𝙴𝚛𝚛𝚘𝚛: ${err.message}`);
    }
  },
};
