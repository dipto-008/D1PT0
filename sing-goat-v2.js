const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};
module.exports = {
  config: {
    name: "sing",
    version: "1.1.5",
    aliases: ["song", "music", "play"],
    author: "dipto",
    countDown: 5,
    role: 0,
    description: {
      en: "Download audio from YouTube"
    },
    category: "media",
    guide: {
      en: "{pn} [<song name>|<song link>]:"+ "\n   Example:"+"\n{pn} chipi chipi chapa chapa"
    }
  },
  onStart: async ({api,args, event,commandName }) =>{
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const urlYtb = checkurl.test(args[0]);
if (urlYtb) {
        const { data: { title, downloadLink } } = await axios.get(
          `${await baseApiUrl()}/ytDl2?link=${args[0]}&format=mp3`
        );
    return  api.sendMessage({
      body: title,
      attachment: await dipto(downloadLink,'audio.mp3')
    },event.threadID,event.messageID)
}
    let keyWord = args.join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    const maxResults = 6;
    let result;
    try {
      result = ((await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${keyWord}`)).data).slice(0, maxResults);
    } catch (err) {
      return api.sendMessage("❌ An error occurred:"+err.message,event.threadID,event.messageID);
    }
    if (result.length == 0)
      return api.sendMessage("⭕ No search results match the keyword:"+ keyWord,event.threadID,event.messageID);
    let msg = "";
    let i = 1;
    const thumbnails = [];
    for (const info of result) {
thumbnails.push(dipto(info.thumbnail,'photo.jpg'));
      msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
    }
    api.sendMessage({
      body: msg+ "Reply to this message with a number want to listen",
      attachment: await Promise.all(thumbnails)
    },event.threadID, (err, info) => {
global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        author: event.senderID,
        result
      });
    },event.messageID);
  },
  onReply: async ({ event, api, Reply }) => {
    try {
    const { result } = Reply;
    const choice = parseInt(event.body);
    if (!isNaN(choice) && choice <= result.length && choice > 0) {
      const infoChoice = result[choice - 1];
      const idvideo = infoChoice.id;
  const { data: { title, downloadLink } } = await axios.get(`${await baseApiUrl()}/ytDl2?link=https://m.youtube.com/watch?v=${idvideo}&format=mp3`);
    await api.unsendMessage(Reply.messageID)
        await  api.sendMessage({
          body: title,
          attachment: await dipto(downloadLink,'audio.mp3')
        },event.threadID,event.messageID)
    } else {
      api.sendMessage("Invalid choice. Please enter a number between 1 and 6.",event.threadID,event.messageID);
    }
    } catch (error) {
      console.log(error);
      api.sendMessage("⭕ Sorry, audio size was less than 26MB",event.threadID,event.messageID)
    }   
 }
};
async function dipto(url,pathName) {
  try {
    const response = await axios.get(url,{
      responseType: "stream"
    });
    response.data.path = pathName;
    return response.data;
  }
  catch (err) {
    throw err;
  }
}
async function getVideoInfo(url) {
  //pore korbo😋.
}
