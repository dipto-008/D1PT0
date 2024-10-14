const config = {
        name: "tag2",
        version: "1.6.9",
        author: "Dipto",
        credits: "Dipto",
        countDown: 0,
        role: 0,
        hasPermission: 0,
        description: "Tag user",
        category: "tag",
        commandCategory: "tag",
        guide: "{pn} [reply/mention]",
        usages: "reply or mention"
    };

const onStart = async ({ api, args, event }) => {
       try {
       const ID = Object.keys(event.mentions)[0] || event.messageReply.senderID;
       const mentionedUser = await api.getUserInfo(ID);
       if (mentionedUser && mentionedUser[ID]) {
       const userName = mentionedUser[ID].name;
       await api.sendMessage({
        body: `${userName}` + args.join(" "),
        mentions: [{
            tag: `${userName}`,
            id: ID 
         }]
       }, event.threadID, event.messageID);
     } else {
       api.sendMessage("Reply to a message to tag...", event.threadID, event.messageID);
       }
    } catch (error) {
        console.log(error);
        api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
   }
  };

module.exports = {
  config, 
  onStart,
  run: onStart
};
