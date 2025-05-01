
const axios = require('axios');
const baseApiUrl = async () => {
    return "https://rubish-apihub.onrender.com/rubish";
};

module.exports.config = {
    name: "simma",
    aliases: ["sam","jan","baby", "bbe", "babe"],
    version: "6.9.0",
    author: "RUBISH x DIPTO",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NewMessage]"
    }
};

module.exports.onStart = async ({api,event,args,usersData}) => {
    const baseUrl = await baseApiUrl();
    const link = `${baseUrl}/simma`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}&apikey=rubish69`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}&apikey=rubish69`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

if (args[0] === 'list') {
    const res = (await axios.get(`${link}?list=all&apikey=rubish69`)).data;

    if (args[1] === 'all') {
        const teacherList = res.teacher?.teacherList || [];
        if (!teacherList.length) return api.sendMessage("❌ No teacher data found!", event.threadID, event.messageID);
        const limit = args[2] ? parseInt(args[2], 10) : 50;

        const teacherCount = teacherList.length;
        const resultLimit = Math.min(limit, teacherCount); 
        const teachers = await Promise.all(
            teacherList.map(async (entry, index) => {
                const userID = Object.keys(entry)[0]; 
                const count = entry[userID];  

                const userIDNumber = Number(userID);  
                if (isNaN(userIDNumber)) {
                    return { name: `Invalid UserID: ${userID}`, count };
                }

                const user = await usersData.get(userIDNumber);  
                const name = user?.name || `UID: ${userID}`;
                return { name, count, index };
            })
        );

        teachers.sort((a, b) => b.count - a.count);

        const topTeachers = teachers.slice(0, resultLimit);

        const top = topTeachers.map((t, i) => {
            const serial = i + 1; 
            return `${serial}. ${t.name}: ${t.count}`;
        }).join('\n');

        return api.sendMessage(
            `👥 Total Teaches: ${res.length || 0}\n📦 Total Responses: ${res.responseLength || 0}\n\n🏆 Top ${resultLimit} Teachers:\n${top}`,
            event.threadID,
            event.messageID
        );
    } else {
        return api.sendMessage(
            `📌 Total Teaches: ${res.length || 0}\n📦 Total Responses: ${res.responseLength || 0}`,
            event.threadID,
            event.messageID
        );
    }
}


        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}&apikey=rubish69`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}&apikey=rubish69`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

       if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
    [comd, command] = dipto.split(/\s*-\s*/);
    final = comd.replace("teach ", "");
    if (command.length < 2) return api.sendMessage('❌ | Invalid format! Please use correct Formet ⇒ .simma teach hi - hello', event.threadID, event.messageID);
    
    const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}&apikey=rubish69`);

    if (re.data.message.startsWith('❌')) {
        return api.sendMessage(re.data.message, event.threadID, event.messageID);
    }

    const teacher = (await usersData.get(re.data.teacher)).name;
    
    return api.sendMessage(
        `✅ Teaching successful

Question: "${re.data.teachText}"
Response: "${re.data.reply}"

Teacher: ${teacher}
Teachs: ${re.data.teachs}`,
        event.threadID,
        event.messageID
    );
}



        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro&threadID=${event.threadID}&apikey=rubish69`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}&threadID=${event.threadID}&apikey=rubish69`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro&apikey=rubish69`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=0&apikey=rubish69`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/simma?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=0&apikey=rubish69`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : "";
        if (body.startsWith("nanno") || body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu") || body.startsWith("simma") || body.startsWith("sam")) {
            const arr = body.replace(/^\S+\s*/, "");
            const randomReplies = ["😚", "Yes 😀, I am here", "What's up?", "Bolo jaan ki korte panmr jonno"];
            if (!arr) {
                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found");
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID);
            }
            const a = (await axios.get(`${await baseApiUrl()}/simma?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=0&apikey=rubish69`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
