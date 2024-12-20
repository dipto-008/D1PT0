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
  role: 2,
  author: "Dipto",
  description: "Generate images with Flux.1 Pro",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  preimum: true,
  guide: "{pn} [prompt] --ratio 1024x1024\n{pn} [prompt]",
  countDown: 15,
};

module.exports.onStart = async ({ message, event, args, api }) => {
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
    const ok = message.reply('wait baby <😘')
    api.setMessageReaction("⌛", event.messageID, (err) => {}, true);
    const apiUrl = `${await baseApiUrl()}/flux11?prompt=${prompt}`;

    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
     message.unsend(ok.messageID)
    const attachment = await global.utils.getStreamFromURL(apiUrl);
    const endTime = new Date().getTime();
    await message.reply({
          body: `Here's your image\nModel Name: "Flux.1 Pro"\nTime Taken: ${(endTime - startTime) / 1000} second/s`, 
          attachment
      });
  } catch (e) {
    console.log(e);
    message.reply("Error: " + e.message);
  }
};

