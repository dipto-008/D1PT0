const axios = require("axios");

const baseApiUrl = async () => {
    const base = await axios.get(
        "https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json",
    );
    return base.data.api;
};

module.exports.config = {
    name: "flag",
    version: "3.0",
    credits: "Dipto",
    cooldowns: 1,
    hasPermssion: 0,
    description: "Guess the flag name",
    commandCategory: "game",
    category: "game",
    usages: "-flagGame",
    usePrefix: true,
    prefix: true,
};

module.exports.handleReply = async function ({
    api,
    event,
    handleReply,
    Users,
}) {
    const { country, attempts } = handleReply;
    const maxAttempts = 5;

    if (event.type === "message_reply") {
        const reply = event.body.toLowerCase();
        const getCoin = 2 * 120.5;
        const getExp = 1 * 121;
        const userData = await Users.get(event.senderID);

        if (attempts >= maxAttempts) {
            await api.sendMessage(
                "🚫 | You have reached the maximum number of attempts (5).",
                event.threadID,
                event.messageID,
            );
            return;
        }

        if (isNaN(reply)) {
            if (reply === country.toLowerCase()) {
                try {
                    await api.unsendMessage(handleReply.messageID);
                    await Users.set(event.senderID, {
                        money: userData.money + getCoin,
                        exp: userData.exp + getExp,
                        data: userData.data,
                    });
                } catch (err) {
                    console.log("Error: ", err.message);
                } finally {
                    const message = `✅ | Correct answer!\nYou have earned ${getCoin} coins and ${getExp} exp.`;
                    await api.sendMessage(
                        message,
                        event.threadID,
                        event.messageID,
                    );
                }
            } else {
                handleReply.attempts += 1;
                global.client.handleReply.push(
                    handleReply.messageID,
                    handleReply,
                );
                api.sendMessage(
                    `❌ | Wrong Answer. You have ${maxAttempts - handleReply.attempts} attempts left.\n✅ | Try Again baby!`,
                    event.threadID,
                    event.messageID,
                );
            }
        }
    }
};

module.exports.run = async function ({ api, args, event }) {
    try {
        if (!args[0]) {
            const response = await axios.get(
                `${await baseApiUrl()}/flagGame?randomFlag=random`,
            );
            const { link, country } = response.data;

            const img = (await axios.get(link, { responseType: "stream" }))
                .data;

            const attachment = img;

            await api.sendMessage(
                {
                    body: "Guess this flag name.",
                    attachment,
                },
                event.threadID,
                (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID,
                        link,
                        country,
                        attempts: 0,
                    });
                },
                event.messageID,
            );
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        api.sendMessage(
            `Error: ${error.message}`,
            event.threadID,
            event.messageID,
        );
    }
};
