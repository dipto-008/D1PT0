const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const configPath = __dirname + "/uptime_config.json";

const boldText = (text) => {
  const boldMap = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰',
    '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };
  return text.split('').map(c => boldMap[c] || c).join('');
};

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt"],
    version: "1.3",
    usePrefix: false,
    author: "𝐌𝐨𝐬𝐭𝐚𝐤𝐢𝐦",
    role: 0,
    shortDescription: {
      en: "View bot uptime and usage stats."
    },
    longDescription: {
      en: "Get the bot's current uptime, total users, active threads, and timezone info."
    },
    category: "system",
    guide: {
      en: "uptime --image on\nuptime --image off"
    }
  },

  onStart: async function ({ api, event, args, usersData, threadsData }) {
    try {
      let config = {};
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath));
      }

      const argStr = args.join(" ").toLowerCase();
      if (argStr.includes("--image on")) {
        config.image = true;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return api.sendMessage("✅ Image mode is now ON.", event.threadID);
      } else if (argStr.includes("--image off")) {
        config.image = false;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return api.sendMessage("✅ Image mode is now OFF.", event.threadID);
      }

      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;
      const totalUsers = allUsers.length.toLocaleString();
      const totalThreads = allThreads.length.toLocaleString();

      const timeZone = "Asia/Dhaka";
      const currentTime = moment().tz(timeZone).format("YYYY-MM-DD HH:mm:ss");
      const startTime = moment().subtract(uptime, "seconds").tz(timeZone).format("YYYY-MM-DD HH:mm:ss");

      const message =
`╭─⏱️ ${boldText("BOT STATUS & UPTIME")} ─╮
│
│ 📌 ${boldText("Uptime")}     : ${uptimeFormatted}
│ 🕒 ${boldText("Timezone")}   : ${timeZone}
│ ⏰ ${boldText("Current")}    : ${currentTime}
│ 🚀 ${boldText("Started")}    : ${startTime}
│
├─📊 ${boldText("USAGE STATS")} ──────
│ 👤 ${boldText("Users")}      : ${totalUsers}
│ 💬 ${boldText("Threads")}    : ${totalThreads}
╰─────────────────────╯`;

      if (config.image) {
        try {
          const imageUrl = "http://160.191.129.54:5000/cdn/zYMnhVKfG.jpg";
          const imgPath = __dirname + "/uptime.jpg";
          const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
          fs.writeFileSync(imgPath, Buffer.from(response.data));

          return api.sendMessage({
            body: message,
            attachment: fs.createReadStream(imgPath)
          }, event.threadID, () => fs.unlinkSync(imgPath));
        } catch (imgErr) {
          console.error("Image download error:", imgErr);
          return api.sendMessage(message + "\n\n⚠️ Image download failed, showing text only.", event.threadID);
        }
      } else {
        return api.sendMessage(message, event.threadID);
      }

    } catch (error) {
      console.error("Uptime Error:", error);
      api.sendMessage("❌ Sorry, I couldn't fetch the uptime info right now.", event.threadID);
    }
  }
};
