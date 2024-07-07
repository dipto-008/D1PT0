module.exports = {
  config: {
    name: "profile",
    aliases: ["pfp", "pp"],
    version: "1.1",
    author: "dipto",
    countDown: 5,
    role: 0,
    description: "PROFILE image",
    category: "image",
    guide: { en: "{pn} @tag or userID or reply to a message or provide a Facebook URL" }
  },
  onStart: async function ({ event, message, usersData, args }) {
    const getAvatarUrl = async (uid) => await usersData.getAvatarUrl(uid);
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
      message.reply({ body: "", attachment: await global.utils.getStreamFromURL(avt) });
    } catch (error) {
      message.reply(`⚠️ Error: ${error.message}`);
    }
  }
};
