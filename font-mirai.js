const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};
module.exports.config = {
    name: 'font',
    aliases: ['style'],
    version: '1.0',
    role: 0,
    countDowns: 5,
    credits: 'dipto',
    description: 'This command transforms text with different fonts',
    category: 'command',
    usePrefix: true,
    prefix: true,
    commandCategory: 'command',
    guide: { en: '[numder] [text]' }
  },
module.exports.run = async ({ api,args})=>{
  const t = encodeURIComponent(args.slice(1).join(" "));
  const number = args[0];
 if(args[0] === 'list'){
      const response = await axios.get(`${await baseApiUrl()}/font?list=all`);
      const result = response.data;
      await api.sendMessage(result,event.threadID, event.messageID); 
   return
    } else if (!t || isNaN(number)) {
      return message.reply('Invalid command. Usage: font <number> <text> ');
 }
    try {
      const response = await axios.get(`${await baseApiUrl()}/font?message=${t}&number=${number}`);
      const result = response.data.data;
      await api.sendMessage(result,event.threadID, event.messageID); 
    } catch (error) {
      console.error('Error:', error);
await api.sendMessage(error.message,event.threadID, event.messageID); 
    }
  };
