const axios = require('axios');
const yts = require("yt-search");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
    );
    return base.data.api;
};

(async () => {
    global.apis = {
        diptoApi: await baseApiUrl()
    };
})();

async function getStreamFromURL(url, pathName) {
    try {
        const response = await axios.get(url, {
            responseType: "stream"
        });
        response.data.path = pathName;
        return response.data;
    } catch (err) {
        throw err;
    }
}

global.utils = {
    ...global.utils,
    getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
};

const config = {
    name: "sing2",
    author: "Mesbah Saxx",
    credits: "Mesbah Saxx",
    version: "1.0.1",
    role: 0,
    hasPermssion: 0,
    description: "",
    usePrefix: true,
    prfix: true,
    category: "media",
    commandCategory: "media",
    cooldowns: 5,
    countDown: 5,
}

async function onStart({
    api,
    args,
    event
}) {
    try {
        const songName = args.join(' ');
        const w = await api.sendMessage(`Searching song "${songName}"... `, event.threadID);
        const r = await yts(songName);
        const videos = r.videos.slice(0, 50);

        const videoData = videos[Math.floor(Math.random() * videos.length)];

        const {
            data: {
                title,
                quality,
                downloadLink
            }
        } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoData.videoId}&format=mp3`);

        api.unsendMessage(w.messageID)

        const o = ".php";
        const shortenedLink = (await axios.get(`https://tinyurl.com/api-create${o}?url=${encodeURIComponent(downloadLink)}`)).data;

        await api.sendMessage({
            body: `🔖 - 𝚃𝚒𝚝𝚕𝚎: ${title}
✨ - 𝚀𝚞𝚊𝚕𝚒𝚝𝚢: ${quality}

📥 - 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝙻𝚒𝚗𝚔: ${shortenedLink}`,
            attachment: await global.utils.getStreamFromURL(downloadLink)
        }, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(e, event.threadID, event.messageID);
    }
}
module.exports = {
    config,
    onStart,
    run: onStart
};
