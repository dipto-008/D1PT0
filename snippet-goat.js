const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
    name: 'snippet',
    aliases: ['snip'],
    version: '1.0',
    role: 0,
    countDowns: 5,
    author: 'dipto',
    description: 'This command transforms text image',
    category: 'command',
    guide: { en: '[code] []' }
  },
module.exports.onStart = async function ({ api,event,args}) {
  const code = args.join(" ");
  if(!code) return api.sendMessage('❎ | Please enter code', event.threadID,event.messageID)
    try {
      const { data } = await axios.post(`${await baseApiUrl()}/snippet`, {
          code: code,
          lang: 'javascript'
      });
      await api.sendMessage({ attachment:  (await require('axios').get(data.imageUrl,{ responseType: 'stream' })).data },event.threadID,event.messageID);
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage('An error occurred while processing your request.',event.threadID,event.messageID);
    }
  };
