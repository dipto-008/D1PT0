const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
    console.log(base.data.api)
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
    description: "better then all sim simi",
    category: "chat",
    guide: {
      en: "{pn}[anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
  },
onStart: async ({ api, event, args ,usersData }) => {
const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
      const uid = event.senderID;
      let command;
      let comd;
      let final;
      try{
      if(!args[0]){
        const ran = ["Bolo baby","hum","type help baby","type !baby hi"];
        const r = ran[Math.floor(Math.random() * ran.length)];
    return api.sendMessage(r,event.threadID,event.messageID);
      }
//-------------------------------------//
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
//-----------------------------------//
    else if (args[0] === 'list') {
        if (args[1] === 'all') {
            const res = await axios.get(`${link}?list=all`);
            const data = res.data;
         Promise.all(data.teacher.teacherList.map(async (item) => {
                const number = Object.keys(item)[0];
                const value = item[number];
                const userData = await usersData.get(number);
                const name = userData.name;
                return { name, value };
            })).then(teachers => {
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((teacher, index) => `${index + 1}/ ${teacher.name}: ${teacher.value}`).join('\n');
                api.sendMessage(`Total Teach = ${data.length}\n\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            }).catch(error => {
                console.error(error);
                api.sendMessage(`Error fetching teacher data`, event.threadID, event.messageID);
            });
        } else {
            const respo = await axios.get(`${link}?list=all`);
            const d = respo.data.length;
            api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
        }
    }
//-----------------------------------//
          else if (args[0] === 'msg' || args[0] === 'message') {
      const fuk = dipto.replace("msg ", "");
            const respo = await axios.get(`${link}?list=${fuk}`);
            const d = respo.data.data;
            api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
          }
//----------------------------------//
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

else if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react'){
           command = dipto.split(' - ')[1];
          comd = dipto.split(' - ')[0];
          final = comd.replace("teach ", "");
                if (command.length < 2) {
                return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            }
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
            const tex = re.data.message;
        const name = re.data.teacher
const data = await usersData.get(name);
      const teacher = data.name;
          const teachs = re.data.teachs
     api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${teachs}`, event.threadID, event.messageID);
        }
//------------------------------------//
else if (args[0] === 'teach' && args[1] === 'amar'){
         command = dipto.split(' - ')[1];
          comd = dipto.split(' - ')[0];
  final = comd.replace("teach ", "");
            if (command.length < 2) {
                return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            }
            const re = await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`);
            const tex = re.data.message;
            api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }
//------------------------------------//
else if (args[0] === 'teach' && args[1] === 'react'){
          command = dipto.split(' - ')[1];
            comd = dipto.split(' - ')[0];
      final = comd.replace("teach react ", "");
              if (command.length < 2) {
                  return api.sendMessage('❌ | Invalid format! Use [teach] [YourMessage] - [Reply1], [Reply2], [Reply3]... OR [teach] [react] [YourMessage] - [react1], [react2], [react3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
              }
              const re = await axios.get(`${link}?teach=${final}&react=${command}`);
              const tex = re.data.message;
              api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
          }
//------------------------------------//
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
