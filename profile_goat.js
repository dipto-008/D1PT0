module.exports = {
  config: {
    name: "profile",
    aliases: ["pfp","pp"],
    version: "1.1",
    author: "dip",
    countDown: 5,
    role: 0,
    description: "PROFILE image",
    category: "image",
    guide: {
      en: "   {pn} @tag"
    }
  },
  onStart: async function ({ event, message, usersData, args, getLang }) {
    let avt;
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
 const uid3 = args[0];
const uid4 = args.join(" ")

    if(event.type == "message_reply"){
      avt = await usersData.getAvatarUrl(event.messageReply.senderID)
    } else{
if(uid4.includes("facebook")){
avt = await usersData.getAvatarUrl(event.attachments[0].target.id)
}else if(uid4.includes("@")){avt = await usersData.getAvatarUrl(uid2)}else if(uid3){avt = await usersData.getAvatarUrl(uid3)}else if (!uid2){avt =  await usersData.getAvatarUrl(uid1)
              }
}
    message.reply({
      body:"",
      attachment: await global.utils.getStreamFromURL(avt)
  })
  }
};
