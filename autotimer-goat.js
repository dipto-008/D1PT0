module.exports.config = {
  name: "autotimer",
  version: "2.0",
  role: 0,
  author: "Dipto",
  description: "সেট করা সময় অনুযায়ী স্বয়ংক্রিয়ভাবে বার্তাগুলি পাঠানো হবে!",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async ({ api }) => {
  const timerData = {
      "12:00:00 PM": {
        message: "This is an auto schedule message at 12:00 PM 🌞 🌟",
        url: null
      },
      "01:00:00 AM": {
        message: "This is an auto schedule message at 01:00 AM 🌜 🌟",
        url: null
      },
      "02:00:00 AM": {
        message: "This is an auto schedule message at 02:00 AM 🌜 🌟",
        url: null
      },
      "03:00:00 AM": {
        message: "This is an auto schedule message at 03:00 AM 🌜 🌟",
        url: null
      },
      "04:00:00 AM": {
        message: "This is an auto schedule message at 04:00 AM 🌜 🌟",
        url: null
      },
      "05:00:00 AM": {
        message: "This is an auto schedule message at 05:00 AM 🌜 🌟",
        url: null
      },
      "06:00:00 AM": {
        message: "This is an auto schedule message at 06:00 AM 🌜 🌟",
        url: null
      },
      "07:00:00 AM": {
        message: "This is an auto schedule message at 07:00 AM 🌜 🌟",
        url: null
      },
      "08:00:00 AM": {
        message: "This is an auto schedule message at 08:00 AM 🌜 🌟",
        url: null
      },
      "09:00:00 AM": {
        message: "This is an auto schedule message at 09:00 AM 🌜 🌟",
        url: null
      },
      "10:00:00 AM": {
        message: "This is an auto schedule message at 10:00 AM 🌞 🌟",
        url: null
      },
      "11:00:00 AM": {
        message: "This is an auto schedule message at 11:00 AM 🌞 🌟",
        url: null
      },
      "12:00:00 PM": {
        message: "This is an auto schedule message at 12:00 PM 🌞 🌟",
        url: null
      },
      "01:00:00 PM": {
        message: "This is an auto schedule message at 01:00 PM 🌞 🌟",
        url: null
      },
      "02:00:00 PM": {
        message: "This is an auto schedule message at 02:00 PM 🌞 🌟",
        url: null
      },
      "03:00:00 PM": {
        message: "This is an auto schedule message at 03:00 PM 🌞 🌟",
        url: null
      },
      "04:00:00 PM": {
        message: "This is an auto schedule message at 04:00 PM 🌞 🌟",
        url: null
      },
      "05:00:00 PM": {
        message: "This is an auto schedule message at 05:00 PM 🌞 🌟",
        url: null
      },
      "06:00:00 PM": {
        message: "This is an auto schedule message at 06:00 PM 🌞 🌟",
        url: null
      },
      "07:00:00 PM": {
        message: "This is an auto schedule message at 07:00 PM 🌜 🌟",
        url: null
      },
      "08:00:00 PM": {
        message: "This is an auto schedule message at 08:00 PM 🌜 🌟",
        url: null
      },
      "09:00:00 PM": {
        message: "This is an auto schedule message at 09:00 PM 🌜 🌟",
        url: null
      },
      "10:00:00 PM": {
        message: "This is an auto schedule message at 10:00 PM 🌜 🌟",
        url: null
      },
      "11:00:00 PM": {
        message: "This is an auto schedule message at 11:00 PM 🌜 🌟",
        url: null
      }
  };
  if(timerData){
const checkTimeAndSendMessage = async() => { 
  const currentTime = new Date(Date.now() + 21600000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).split(',').pop().trim(); 
  // const attachment = await global.utils.getStreamFromURL(timerData[currentTime].url);
  
    if (timerData[currentTime]) global.GoatBot.config.whiteListModeThread.whiteListThreadIds.forEach(async threadID => await api.sendMessage({body: timerData[currentTime].message/*, attachment*/}, threadID)); 
    setTimeout(checkTimeAndSendMessage, 1200 - new Date().getMilliseconds()); 
   }; 
  checkTimeAndSendMessage();
 }
};

module.exports.onStart = ({}) => {};

