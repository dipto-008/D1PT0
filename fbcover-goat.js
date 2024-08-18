const axios = require("axios");
const baseApiUrl = async () => {
  const { data } = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return data.api;
};
module.exports.config = {
  name: "fbcover",
  version: "6.9",
  role: 0,
  author: "Dipto",
  description: "Generate a Facebook cover",
  category: "Cover",
  guide: {
    en: "name - title - address - email - phone - color (default = white)",
  },
  coolDowns: 5,
};
module.exports.onStart = async function ({ api, event, args, usersData }) {
  const dipto = args.join(" ").trim();
  if (!dipto) {
    return api.sendMessage(
      `❌| Incorrect usage\nTry ${global.GoatBot.config.prefix}fbcover v1/v2/v3 - name - title - address - email - phone - color (default = white)`,
      event.threadID,
      event.messageID
    );
  }
  const id = event.type === "message_reply" ? event.messageReply.senderID : Object.keys(event.mentions)[0] || event.senderID;
  const user = await usersData.get(id);
  const userName = user?.name || "User";
  const [v = "v1", name = "name", subname = "title", address = "address", email = "gmail", phone = "number", color = "white"] = dipto.split("-").map(item => item.trim());
  const info = api.sendMessage("Processing your cover, Wait koro baby < 😘",event.threadID);
  const img = `${await baseApiUrl()}/cover/${v}?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&number=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&colour=${encodeURIComponent(color)}&uid=${id}`;
  try {
    const { data } = (await axios.get(img, { responseType: "stream" })).data;
    api.unsendMessage(info.messageID)
    api.sendMessage({
      body: `✿━━━━━━━━━━━━━━━━━━━━━━━✿\n🔵𝗙𝗜𝗥𝗦𝗧 𝗡𝗔𝗠𝗘: ${name}\n⚫𝗦𝗘𝗖𝗢𝗡𝗗 𝗡𝗔𝗠𝗘:${subname}\n⚪𝗔𝗗𝗗𝗥𝗘𝗦𝗦: ${address}\n📫𝗠𝗔𝗜𝗟: ${email}\n☎️𝗣𝗛𝗢𝗡𝗘 𝗡𝗨𝗠𝗕𝗘𝗥: ${phone}\n☢️𝗖𝗢𝗟𝗢𝗥: ${color}\n💁𝗨𝗦𝗘𝗥 𝗡𝗔𝗠𝗘: ${userName}\n✅𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : ${v}\n✿━━━━━━━━━━━━━━━━━━━━━━━━✿`,
      data,
    }, event.threadID, event.messageID);
  } catch (error) {
    console.error("Error generating FB cover:", error);
    api.sendMessage("An error occurred while generating the FB cover.", event.threadID, event.messageID);
  }
};
