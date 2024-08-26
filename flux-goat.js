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
  /*let prompt2, ratio;
  if (prompt.includes("--ratio")) {
    const parts = prompt.split("--ratio");
    prompt2 = parts[0].trim();
    ratio = parts[1].trim();
  } else {
    prompt2 = prompt;
    ratio = "1:1";
  }*/
    const ok = message.reply('wait baby <😘')
    api.setMessageReaction("⌛", event.messageID, (err) => {}, true);
    const { data } = await axios.get(
      `https://www.noobs-api.000.pe/dipto/flux?prompt=${prompt}`
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
