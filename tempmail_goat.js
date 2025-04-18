const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.romim;
};

module.exports.config = {
  name: "tempmail",
  aliases: ["tmail", "tempemail", "mail"],
  version: "1.0.0",
  author: "Nyx",
  category: 'Tempmail',
  countDown: 5,
  guide: {
    en: "{pn} --gen [name] - Generate a temporary email (name is optional)\n{pn} --inbox [email] - Check email inbox."
  }
};

module.exports.onStart = async ({ api, event, args }) => {
  const command = args[0];
  const styles = {
    bold: (text) => `𝗧${text.slice(1)}`,
    italic: (text) => `𝘐${text.slice(1)}`,
    fancy: (text) => {
      const fancyChars = {
        'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
        'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
        'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
        'y': '𝔂', 'z': '𝔃', 'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕',
        'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝',
        'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥',
        'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩'
      };
      return text.split('').map(char => fancyChars[char] || char).join('');
    },
    aesthetic: (text) => text.split('').join(' '),
    smallcaps: (text) => {
      const smallCaps = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ',
        'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
        'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
        'y': 'ʏ', 'z': 'ᴢ'
      };
      return text.toLowerCase().split('').map(char => smallCaps[char] || char).join('');
    }
  };

  if (command === '--gen') {
    try {
      const name = args[1] || "";
      const url = name
        ? `${await baseApiUrl()}api/tempmail/Gen?name=${name}`
        : `${await baseApiUrl()}api/tempmail/Gen?email=`;

      const response = await axios.get(url);
      const { email, token } = response.data;

      const gm = `
╭─────『 ${styles.fancy("TempMail Generator")} 』─────╮
│
│ ✅ ${styles.smallcaps("Email Generated Successfully")}
│
│ 📧 ${styles.bold("Email")}: ${email}
│ 🔑 ${styles.bold("Token")}: ${token}
│
│ 💡 ${styles.italic("Use")} "${global.GoatBot.config.prefix}tempmail --inbox ${email}" 
│    ${styles.italic("to check your inbox")}
│
╰───────────────────────────────────╯`;

      await api.sendMessage(gm, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`❌ 𝗘𝗿𝗿𝗼𝗿 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗲𝗺𝗮𝗶𝗹: ${error.message}`, event.threadID, event.messageID);
    }
  }

  else if (command === '--inbox') {
    try {
      if (!args[1]) {
        return api.sendMessage("⚠️ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙖𝙣 𝙚𝙢𝙖𝙞𝙡 𝙖𝙙𝙙𝙧𝙚𝙨𝙨 𝙩𝙤 𝙘𝙝𝙚𝙘𝙠 𝙞𝙣𝙗𝙤𝙭.", event.threadID, event.messageID);
      }

      const email = encodeURIComponent(args[1]);
      const url = `${await baseApiUrl()}api/tempmail/inbox?email=${email}`;
      const response = await axios.get(url);
      const emails = response.data;

      if (!Array.isArray(emails) || emails.length === 0 || !emails[0]) {
        return api.sendMessage(`📭 𝙉𝙤 𝙚𝙢𝙖𝙞𝙡𝙨 𝙛𝙤𝙪𝙣𝙙 𝙛𝙤𝙧 ${decodeURIComponent(email)}`, event.threadID, event.messageID);
      }

      const latestEmail = emails[0];
      const {
        from = 'Unknown',
        to = 'Unknown',
        subject = '(No Subject)',
        body_text = '',
        created_at = new Date().toISOString()
      } = latestEmail;

      const cleanBodyText = body_text.replace(/\s+/g, ' ').trim();
      const linkRegex = /https?:\/\/[^\s)]+/g;
      const links = cleanBodyText.match(linkRegex) || [];

      const magicLinks = links.filter(link =>
        link.includes('magic-link') ||
        link.includes('authenticate') ||
        link.includes('verification')
      );

      const auth = magicLinks.length > 0 ? "✓ 𝐘𝐞𝐬" : "✗ 𝐍𝐨";

      const formattedMessage = `
╭─────『 📬 𝓘𝓷𝓫𝓸𝔁 𝓡𝓮𝓼𝓾𝓵𝓽𝓼 』─────╮
│
│ 📧 𝗧𝗼: ${to}
│ 👤 𝗙𝗿𝗼𝗺: ${from}
│ 📅 𝗗𝗮𝘁𝗲: ${new Date(created_at).toLocaleString()}
│ 📝 𝗦𝘂𝗯𝗷𝗲𝗰𝘁: ${subject}
│
├─────『 📄 𝓜𝓮𝓼𝓼𝓪𝓰𝓮 』─────┤
│ ${cleanBodyText.substring(0, 300)}${cleanBodyText.length > 300 ? '...' : ''}
│
${links.length > 0 ? `├─────『 🔗 𝓛𝓲𝓷𝓴𝓼 𝓕𝓸𝓾𝓷𝓭 』─────┤\n│ ${links.join('\n│ ')}\n│\n` : ''}├─────『 🔐 𝓐𝓾𝓽𝓱𝓮𝓷𝓽𝓲𝓬𝓪𝓽𝓲𝓸𝓷 』─────┤
│ Authentication Links: ${auth}
│ Total Emails: ${emails.length}
│
╰───────────────────────────────────╯`;

      await api.sendMessage(formattedMessage, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`❌ 𝗘𝗿𝗿𝗼𝗿 𝗰𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗶𝗻𝗯𝗼𝘅: ${error.message}`, event.threadID, event.messageID);
    }
  }

  else {
    const helpMessage = `
╭─────『 📋 𝓣𝓮𝓶𝓹𝓜𝓪𝓲𝓵 𝓗𝓮𝓵𝓹 』─────╮
│
│ ${global.GoatBot.config.prefix}tempmail --gen [name]
│ ┗━━➤ Generate a temporary email
│
│ ${global.GoatBot.config.prefix}tempmail --inbox [email]
│ ┗━━➤ Check email inbox
│
╰───────────────────────────────────╯`;

    api.sendMessage(helpMessage, event.threadID, event.messageID);
  }
};
