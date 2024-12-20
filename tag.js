const config = {
        name: "tag",
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
       const ID = event.messageReply?.senderID || args[0] || event.senderID;
       const mentionedUser = await api.getUserInfo(ID);
       if (mentionedUser && mentionedUser[ID]) {
       const userName = mentionedUser[ID].name;
       const text = args.join(" ");
       await api.sendMessage({
        body: `${userName} ${text}`,
        mentions: [{
            tag: userName,
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
