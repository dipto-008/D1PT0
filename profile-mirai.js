module.exports = {
  config: {
    name: "profile",
    aliases: ["pfp", "pp"],
    version: "1.1",
    credits: "dipto",
    countDown: 5,
    hasPermssion: 0,
    description: "PROFILE image",
    category: "image",
    commandCategory: "image",
    usePrefix: true,
    prefix: true,
    usages: "{pn} @tag or userID or reply to a message or provide a Facebook URL" 
  },
  run: async function ({ event, api, args }) {
    const getAvatarUrl = async (uid) => await `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const uid = Object.keys(event.mentions)[0] || args[0] || event.senderID;
    let avt;
    try {
      if (event.type === "message_reply") {
        avt = await getAvatarUrl(event.messageReply.senderID);
      } else if (args.join(" ").includes("facebook.com")) {
        const match = args.join(" ").match(/(\d+)/);
        if (match) avt = await getAvatarUrl(match[0]);
        else throw new Error("Invalid Facebook URL.");
      } else {
        avt = await getAvatarUrl(uid);
      }
      api.sendMessage({ body: "", attachment: (await require('axios').get(avt,{ responseType: 'stream' })).data }, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`⚠️ Error: ${error.message}`,event.threadID, event.messageID);
    }
  }
};
