const axios = require("axios");

const baseApiUrl = async () => {
    const base = await axios.get(
        "https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json"
    );
    return base.data.api;
};

module.exports.config = {
    name: "quiz",
    version: "1.0",
    author: "Mesbah Bb'e",
    countDown: 5,
    role: 0,
    description: {
        en: "quiz game",
    },
    category: "GAME",
    guide: {
        en: "{pn}"
    },
};

module.exports.onStart = async function ({ api, event }) {
    const { threadID: t, messageID: m } = event;
    try {
        const response = await axios.get(`${await baseApiUrl()}/quiz3?randomQuiz=random`);
        const imageStream = await axios({
            method: "GET",
            url: response.data.link,
            responseType: 'stream'
        });
        api.sendMessage({
            body: "Please reply to this photo with your answer:",
            attachment: imageStream.data
        }, t, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                author: event.senderID,
                messageID: info.messageID,
                correctAnswer: response.data.quiz,
                rewardAmount: 200
            });
            setTimeout(async () => {
                await api.unsendMessage(info.messageID);
                global.GoatBot.onReply.delete(info.messageID);
            }, 30000);
        },m);

    } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, t);
    }
};

module.exports.onReply = async function ({ api, usersData, args, event, Reply }) {
    const { threadID: t, senderID: s, messageID: m } = event;
    const { author, correctAnswer, messageID, rewardAmount } = Reply;
    if (s !== author) 
        return api.sendMessage("who are you 🐸",t,m);

    try {
        const userAnswer = args.join(" ").trim();
        const isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
        const userData = await usersData.get(s);
        const name = userData.name;

        if (isCorrect) {
     	   await api.unsendMessage(messageID);
     	   global.GoatBot.onReply.delete(messageID);
            userData.money += rewardAmount;
            await usersData.set(s, userData);
            await api.sendMessage({
                body: `Correct answer, ${name}! You earned ${rewardAmount}$.`,
                mentions: [{ tag: name, id: s }]
            }, t, m);
        } else {
        	await api.unsendMessage(messageID);
     	   global.GoatBot.onReply.delete(messageID);
            userData.money -= 5;
            await usersData.set(s, userData);
            await api.sendMessage({
                body: "Incorrect answer, try again.",
            }, t, m);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, t);
    }
};
