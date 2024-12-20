const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "fluxpro",
  version: "2.0",
  hasPermission: 2,
  credits: "Dipto",
  usePrefix: true,
  prefix: true,
  description: "Generate images with Flux.1 Pro",
  commandCategory: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  preimum: true,
  usages: "{pn} [prompt] --ratio 1024x1024\n{pn} [prompt]",
  cooldowns: 15,
};

module.exports.onStart = async ({ event, args, api }) => {
  try {
  const prompt = args.join(" ");
  /*let prompt2, ratio;
  if (prompt.includes("--ratio")) {
    const parts = prompt.split("--ratio");
    prompt2 = parts[0].trim();
    ratio = parts[1].trim();
  } else {
    prompt2 = prompt;
    ratio = "1024x1024";
  }*/
    const startTime = new Date().getTime();
    const ok = api.sendMessage('wait baby <😘', event.threadID, event.messageID);
    api.setMessageReaction("⌛", event.messageID, (err) => {}, true);
    const apiUrl = `${await baseApiUrl()}/flux11?prompt=${prompt}`;

    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
     api.unsendMessage(ok.messageID)
    const attachment = (await axios.get(apiUrl, { responseType: "stream" }).data;
    const endTime = new Date().getTime();
    await api.sendMessage({
          body: `Here's your image\nModel Name: "Flux.1 Pro"\nTime Taken: ${(endTime - startTime) / 1000} second/s`, 
          attachment
      }, event.threadID, event.messageID);
  } catch (e) {
    console.log(e);
    api.sendMessage("Error: " + e.message, event.threadID, event.messageID);
  }
};

