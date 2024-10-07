const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.xnil;
};

module.exports = {
  config: {
    name: "tikstalk",
    aliases: ["stalktik"],
    version: "1.0",
    author: "XNIL",
    countDown: 5,
    role: 0,
    shortDescription: "Get TikTok user info",
    longDescription: {
      en: "Provides you the information of TikTok user"
    },
    category: "info",
    guide: {
      en: "{pn} <username>"
    }
  },

  onStart: async function({ api, event, args }) {
    const userName = args.join(' ');

    if (!userName) {
      return api.sendMessage("Please provide a TikTok username.", event.threadID);
    }

    try {
      const response = await axios.get(
        `${await baseApiUrl()}/tikstalk?uniqueid=${userName}`);

      if (!response.data || !response.data.id) {
        return api.sendMessage("User not found or invalid response.", event.threadID);
      }
      const userInfoMessage = {
        body: `Here's some information about:\n\n` +
          `ID─────── ${response.data.id} ────────\n` +
          `❏ Name: ${response.data.username}\n` +
          `❏ Username: ${response.data.nickname}\n` +
          `❏ Signature: ${response.data.signature}\n` +
          `❏ Total Followers: ${response.data.followerCount}\n` +
          `❏ Following: ${response.data.followingCount}\n` +
          `❏ Total Profile Hearts: ${response.data.heartCount}\n` +
          `❏ Total Videos: ${response.data.videoCount}\n` +
          `❏ Second UID: ${response.data.secUid}\n` +
          `❏ Profile Picture:`,
        attachment: await global.utils.getStreamFromURL(response.data.avatarLarger)
      };

      return api.sendMessage(userInfoMessage, event.threadID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred while fetching the user information.", event.threadID);
    }
  }
};
