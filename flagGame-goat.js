const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "flag",
    aliases: ["flagGame"],
    version: "3.0",
    author: "Dipto",
    countDown: 0,
    role: 0,
    description: {
      en: "Guess the flag name",
    },
    category: "game",
    guide: {
      en: "{pn}",
    },
  },
  onReply: async function ({ api, event, Reply, usersData }) {
    const { country, attempts } = Reply;
    const maxAttempts = 5;
    if (event.type == "message_reply") {
      const reply = event.body.toLowerCase();
      const getCoin = 2 * 120.5;
      const getExp = 1 * 121;
      const userData = await usersData.get(event.senderID);
      if (attempts >= maxAttempts) {
        await api.sendMessage(
          "🚫 | You have reached the maximum number of attempts (5).",
          event.threadID,
          event.messageID,
        );
        return;
      }
      if (isNaN(reply)) {
        if (reply == country.toLowerCase()) {
          try {
            await api.unsendMessage(Reply.messageID);
            await usersData.set(event.senderID, {
              money: userData.money + getCoin,
              exp: userData.exp + getExp,
              data: userData.data,
            });
          } catch (err) {
            console.log("Error: ", err.message);
          } finally {
            const message = `✅ | Correct answer!\nYou have earned ${getCoin} coins and ${getExp} exp.`;
            await api.sendMessage(message, event.threadID, event.messageID);
          }
        } else {
          Reply.attempts += 1;
          global.GoatBot.onReply.set(Reply.messageID, Reply);
          api.sendMessage(
            `❌ | Wrong Answer.You have ${maxAttempts - Reply.attempts} attempts left.\n✅ | Try Again baby!`,
            event.threadID,
            event.messageID,
          );
        }
      }
    }
  },

  onStart: async function ({ api, args, event }) {
    try {
      if (!args[0]) {
        const response = await axios.get(
          `${await baseApiUrl()}/flagGame?randomFlag=random`,
        );
        const { link, country } = response.data;
        await api.sendMessage(
          {
            body: "Guess this flag name.",
            attachment: await global.utils.getStreamFromURL(link),
          },
          event.threadID,
          (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              link,
              country,
              attempts: 0,
            });
          },
          event.messageID,
        );
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      api.sendMessage(
        `Error: ${error.message}`,
        event.threadID,
        event.messageID,
      );
    }
  },
};
