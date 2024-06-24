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
  author: "Mesbah Bb'e",
  countDown: 5,
  role: 0,
  description: {
    en: "View Prayer time",
  },
  category: "𝗜𝗦𝗟𝗔𝗠",
  guide: {
    en: "{pn} <city name>",
  },
};

module.exports.onStart = async function ({ api, args, event }) {
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
      "🕋🌙 Prayer times 🕋🌙\n" +
      "🏙️ City Name: " + cityName + "\n\n" +
      "🕌 𝙵𝚊𝚓𝚛: " + fajr + "\n" +
      "🕌 Sunrise: " + sunrise + "\n" +
      "🕌 Dhuhr: " + dhuhr + "\n\n" +
      "🕌 𝙰𝚜𝚛: " + asr + "\n" +
      "🕌 Maghrib: " + maghrib + "\n" +
      "🕌 Isha: " + isha + "\n";

    api.sendMessage(prayerTimes, event.threadID);
  } catch (e) {
    console.error(e);
    api.sendMessage(`Error: ${e.message}`, event.threadID);
  }
};
