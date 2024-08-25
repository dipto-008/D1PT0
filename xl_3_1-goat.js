const axios = require("axios");
const dip = "https://www.noobs-api.000.pe/dipto"
module.exports.config = {
  name: "xl31",
  version: "2.0",
  role: 2,
  author: "Dipto",
  description:{en: "Sdxl 3.1 Image Generator"},
  category: "Image gen",
  guide: "{pn} [prompt] --ratio 1:1\n{pn} [prompt]",
  countDown: 15,
};

module.exports.onStart = async ({ message, event, args, api }) => {
  try {
  const prompt = args.join(" ");
  let prompt2, ratio = "1:1";
  if (prompt.includes("--ratio")) {
    const parts = prompt.split("--ratio");
    prompt2 = parts[0].trim();
    ratio = parts[1].trim();
  } else {
    prompt2 = prompt;
    ratio = "1:1";
  }
    const ok = message.reply('wait baby <😘')
    api.setMessageReaction("⌛", event.messageID, (err) => {}, true);
    const { data } = await axios.get(
      `${dip}/xl31?prompt=${prompt2}&ratio=${encodeURIComponent(ratio)}`
    );
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
     message.unsend(ok.messageID)
    await message.reply({
          body: `Here's your image`, 
          attachment: await global.utils.getStreamFromURL(data.data) 
      });
  } catch (e) {
    console.log(e);
    message.reply("Error: " + e.message);
  }
};
