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
    credits: "Mesbah Bb'e",
    cooldowns: 5,
    hasPermission: 0,
    description: "quiz",
    commandCategory: "MEDIA",
    usePrefix: true,
    usages: "/quiz",
};

module.exports.run = async function ({ api, event }) {
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
            global.client.handleReply.push(info.messageID, {
                commandName: this.config.name,
                author: event.senderID,
                messageID: info.messageID,
                correctAnswer: response.data.quiz,
                rewardAmount: 200
            });
            setTimeout(async () => {
                await api.unsendMessage(info.messageID);
            }, 30000);
        },m);

    } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, t);
    }
};

module.exports.handleReply = async function ({ api, Users, handleReply, args, event }) {
    const { threadID: t, senderID: s, messageID: m } = event;
    const { author, correctAnswer, messageID, rewardAmount } = handleReply;
    if (s !== author) return;

    try {
        const userAnswer = args.join(" ").trim();
        const isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
        const userData = await Users.get(s);
        const name = userData.name;

        if (isCorrect) {
     	   await api.unsendMessage(messageID);
            userData.money += rewardAmount;
            await usersData.set(s, userData);
            await api.sendMessage({
                body: `Correct answer, ${name}! You earned ${rewardAmount}$.`,
                mentions: [{ tag: name, id: s }]
            }, t, m);
        } else {
        	await api.unsendMessage(messageID);
     	   global.client.handleReply.pop(messageID);
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
