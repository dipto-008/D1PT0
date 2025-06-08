const axios = require("axios");

module.exports.config = {
  name: "flux",
  version: "2.0",
  role: 2,
  author: "Dipto",
  description: "flux Image Generator",
  category: "Image gen",
  guide: "{pn} [prompt] --ratio 1024x1024\n{pn} [prompt]",
  countDown: 15,
};

module.exports.onStart = async ({ message, event, args, api }) => {
  try {
    const prompt = args.join(" ");
    const waitMsg = await message.reply('wait baby <😘');
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    
    const response = await axios.get(`https://www.noobs-api.rf.gd/dipto/flux?prompt=${encodeURIComponent(prompt)}`, {
      responseType: 'stream',
    });

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    message.unsend(waitMsg.messageID);

    await message.reply({
      body: `Here's your image`,
      attachment: response.data,
    });

  } catch (e) {
    console.log("Flux Error:", e);
    message.reply("Error: " + e.message);
  }
};
