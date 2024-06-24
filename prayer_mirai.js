const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};
module.exports.config = {
  name: "namaz",
  aliases: ["prayer"],
  version: "1.0",
  credits: "Mesbah Bb'e",
  usePrefix: true,
  cooldowns: 5,
  hasPermssion: 0,
  description: "View Prayer time",
  commandCategory: "𝗜𝗦𝗟𝗔𝗠",
  usages: "{pn} <city name>",
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const cityName = args.join(" ");
    const apiUrl = `${await baseApiUrl()}/namaj?cityName=${encodeURIComponent(cityName)}`;
    const response = await axios.get(apiUrl);
    const {
      fajr,
      sunrise,
      dhuhr,
      asr,
      maghrib,
      isha
    } = response.data.prayerTimes;

    const prayerTimes =
      "🕋🌙 𝙿𝚛𝚊𝚢𝚎𝚛 𝚝𝚒𝚖𝚎𝚜 🕋🌙\n" +
      "🏙️ 𝙲𝚒𝚝𝚢 𝙽𝚊𝚖𝚎: " + cityName + "\n\n" +
      "🕌 𝙵𝚊𝚓𝚛: " + fajr + "\n" +
      "🕌 𝚂𝚞𝚗𝚛𝚒𝚜𝚎: " + sunrise + "\n" +
      "🕌 𝙳𝚑𝚞𝚛: " + dhuhr + "\n\n" +
      "🕌 𝙰𝚜𝚛: " + asr + "\n" +
      "🕌 𝙼𝚊𝚐𝚑𝚛𝚒𝚋: " + maghrib + "\n" +
      "🕌 𝙸𝚜𝚑𝚊: " + isha + "\n";

    api.sendMessage(prayerTimes, event.threadID);
  } catch (e) {
    console.error(e);
    api.sendMessage(`Error: ${e.message}`, event.threadID);
  }
};
