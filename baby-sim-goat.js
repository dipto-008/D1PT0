const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
  return base.data.api;
}; 

module.exports = {
  config: {
    name: "baby",
    aliases: ["baby", "bbe", "babe" ],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    shortDescription: "Chat with bot",
    longDescription: "Chat with bot",
    category: "chat",
    guide: {
      en: "{pn}[anyMessage] teach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR remove [YourMessage] - [indexNumber] or msg or list OR edit [YourMessage] - [NewReply]"
    }
  },
onStart: async ({ api, event, args }) => {
  const link = await baseApiUrl();
  const dipto = args.join(" ").toLowerCase();
      const uid = event.senderID;
      let command;
      let comd;
      let final;
      try{
      if(!args[0]){
        const ran = ["Bolo baby","hum","type help baby"];
        const r = ran[Math.floor(Math.random() * ran.length)];
    return api.sendMessage(r,event.threadID,event.messageID);
      }
//-------------------------------------------//
      else if (args[0] === 'remove') {
      const fina = dipto.replace("remove ", "");
            const respons = await axios.get(`${link}?remove=${fina}`);
            const dat = respons.data.message;
            api.sendMessage(`${dat}`, event.threadID, event.messageID);
        }
      //------------------------------------//
    else if (args[0] === 'rm' && dipto.includes('-')) {
          const fina = dipto.replace("rm ", "");
         const fi = fina.split(' - ')[0]
         const f = fina.split(' - ')[1]
            const respons = await axios.get(`${link}?remove=${fi}&index=${f}`);
            const da = respons.data.message;
            api.sendMessage(`${da}`, event.threadID, event.messageID);
    }
  //-------------------------------------//
       else if (args[0] === 'list') {
            const respo = await axios.get(`${link}?list=all`);
            const d = respo.data.length;
            api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
        }
    //-------------------------------------//
          else if (args[0] === 'msg' || args[0] === 'message') {
      const fuk = dipto.replace("msg ", "");
            const respo = await axios.get(`${link}?list=${fuk}`);
            const d = respo.data.data;
            api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
          }
  //-------------------------------------//
        else if (args[0] === 'edit') {
            const command = dipto.split(' - ')[1];
            if (command.length < 2) {
                return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            }
            const res = await axios.get(`${link}?edit=${args[1]}&replace=${command}`);
            const dA = res.data.message;
            api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        } 
 //-------------------------------------//

        else if (args[0] === 'teach' && args[1] !== 'amar'){
           command = dipto.split(' - ')[1];
          comd = dipto.split(' - ')[0];
          final = comd.replace("teach ", "");
                if (command.length < 2) {
                return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            }
            const re = await axios.get(`${link}?teach=${final}&reply=${command}`);
            const tex = re.data.message;
            api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }
  //-------------------------------------//
    else if (args[0] === 'teach' && args[1] === 'amar'){
         command = dipto.split(' - ')[1];
          comd = dipto.split(' - ')[0];
          final = comd.replace("teach ", "");
            if (command.length < 2) {
                return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            }
            const re = await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}`);
            const tex = re.data.message;
            api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }
     //-------------------------------------//
        else if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki')){
        const response = await axios.get(`${link}?text=amar name ki&senderID=${uid}`);
        const data = response.data.reply;
        api.sendMessage(`${data}`, event.threadID, event.messageID);
           }
  //----------------------------------//
      else {
        const response = await axios.get(`${link}?text=${dipto}`);
        const data = response.data.reply;
        api.sendMessage(`${data}`, event.threadID, event.messageID);
           }
      } catch (e){
        console.log(e)
        api.sendMessage("Check console for error ",event.threadID,event.messageID);
      }
    }
}
