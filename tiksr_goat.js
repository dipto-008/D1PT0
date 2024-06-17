const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
    );
    return base.data.api;
};

module.exports.config = {
    name: "tiksr",
    version: "1.0",
    author: "Mesbah Bb'e",
    countDown: 5,
    role: 0,
    description: {
        en: "Search for TikTok videos",
    },
    category: "MEDIA",
    guide: {
        en:
            "{pn} <search> - <optional: number of results | blank>" +
            "\nExample:" +
            "\n{pn} caredit - 50",
    },
};

module.exports.onStart = async function ({ api, args, event }) {
    let search = args.join(" ");
    let searchLimit = 10;

    const match = search.match(/^(.+)\s*-\s*(\d+)$/);
    if (match) {
        search = match[1].trim();
        searchLimit = parseInt(match[2], 10);
    }

    const apiUrl = `${await baseApiUrl()}/tiktoksearch?search=${encodeURIComponent(search)}&limit=${searchLimit}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data.data;

        if (!data || data.length === 0) {
            api.sendMessage(
                `No results found for '${search}'. Please try again with a different search term.`,
                event.threadID,
            );
            return;
        }

        let replyOption = "🔍 Search Results:\n\n";
        for (let i = 0; i < data.length; i++) {
            const video = data[i];
            replyOption += `${i + 1}. ${video.title}\n\n`;
        }
        replyOption +=
            "Reply with the number of the video you want to download.";

        const reply = await api.sendMessage(replyOption, event.threadID);
        const replyMessageID = reply.messageID;

        global.GoatBot.onReply.set(replyMessageID, {
            commandName: this.config.name,
            author: event.senderID,
            messageID: replyMessageID,
            results: data,
        });
    } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, event.threadID); // Corrected error message formatting
    }
};

module.exports.onReply = async function ({ event, api, Reply }) {
    const { author, results } = Reply;

    if (event.senderID !== author) return;

    const selectedNumber = parseInt(event.body);

    if (
        isNaN(selectedNumber) ||
        selectedNumber <= 0 ||
        selectedNumber > results.length
    ) {
        api.sendMessage(
            "Invalid option selected. Please reply with a valid number.",
            event.threadID,
        );
        return;
    }

    await api.unsendMessage(Reply.messageID);
    const selectedVideo = results[selectedNumber - 1];

    try {
        const response = await axios.get(selectedVideo.video, {
            responseType: "arraybuffer",
        });
        const videoBuffer = response.data;

        const filename = `${selectedVideo.title.replace(/[^\w\s]/gi, "")}.mp4`;
        const filepath = path.join(__dirname, filename);

        await fs.writeFile(filepath, videoBuffer);

        let infoMessage = `🎥 Video Title: ${selectedVideo.title}\n`;
        infoMessage += `🔗 Video URL: ${selectedVideo.video}\n`;

        api.sendMessage(
            { body: infoMessage, attachment: fs.createReadStream(filepath) },
            event.threadID,
        );
        await fs.unlink(filepath);
    } catch (error) {
        console.error(error);
        api.sendMessage(
            "An error occurred while downloading the TikTok video.",
            event.threadID,
        );
    }
};
