const axios = require("axios");
const fs = require("fs");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "tiktokid",
  version: "6.9.0",
  hasPermssion: 0,
  credits: "dipto",
  description: "Displays TikTok video for selection.",
  usePrefix: true,
  prfix: true,
  category: "Media",
  commandCategory: "Media",
  usages: "[username] [limit]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const user = args[0];
  const limit = args[1] || 1;
  const ok = this.config.credits;
  if (!user)
    return api.sendMessage(
      "Please provide a username.",
      event.threadID,
      event.messageID,
    );
  try {
    const response = await axios.get(
      `${await baseApiUrl()}/tiktokid?url=${user}&num=${limit}`,
    );
    const videos = response.data.data.videos;
    if (!videos.length)
      return api.sendMessage(
        "No videos found for the provided username.🐤",
        event.threadID,
        event.messageID,
      );
    const options = videos.map(
      (video, index) => `${index + 1}. ${video.title}`,
    );
    const message =
      `❤️‍🩹 Choose an option Baby <💝\n` +
      `✿━━━━━━━━━━━━━━━━━✿\n${options.join("\n")}✿━━━━━━━━━━━━━━━━━━✿`;
    const photoUrls = [];
    const filenames = [];
    for (let i = 0; i < limit; i++) {
      const photoUrl = videos[i].origin_cover;
      const filename = __dirname + `/cache/photo${i + 1}.jpeg`;
      photoUrls.push(photoUrl);
      filenames.push(filename);
      const photoResponse = await axios.get(photoUrl, {
        responseType: "arraybuffer",
      });
      fs.writeFileSync(filename, Buffer.from(photoResponse.data, "binary"));
    }
    const attachments = filenames.map((filename) =>
      fs.createReadStream(filename),
    );
    await api.sendMessage(
      {
        body: message,
        attachment: attachments,
      },
      event.threadID,
      (error, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          options,
          videoUrls: videos.map((video) => video.play),
          filenames,
        });
      },
      event.messageID,
    );
  } catch (error) {
    api.sendMessage(
      "An error occurred while fetching the media.",
      event.threadID,
      event.messageID,
    );
  }
};
module.exports.handleReply = async function ({ api, event, handleReply }) {
  api.unsendMessage(handleReply.messageID);
  if (event.type == "message_reply") {
    const reply = parseInt(event.body);
    if (isNaN(reply) || reply < 1 || reply > handleReply.options.length) {
      return api.sendMessage(
        `Please reply with a number between 1 and ${handleReply.options.length}.`,
        event.threadID,
        event.messageID,
      );
    }
    try {
      const videoUrl = handleReply.videoUrls[reply - 1];
      const videoResponse = await axios.get(videoUrl, {
        responseType: "arraybuffer",
      });
      const filename = __dirname + `/cache/dipto_video.mp4`;
      fs.writeFileSync(filename, Buffer.from(videoResponse.data, "binary"));
      api.sendMessage(
        {
          body: `Naw Baby Tiktok video <🐥`,
          attachment: fs.createReadStream(filename),
        },
        event.threadID,
        () => {
          fs.unlinkSync(filename);
          handleReply.filenames.forEach((filename) => {
            fs.unlinkSync(filename);
          });
        },
        event.messageID,
      );
    } catch (error) {
      api.sendMessage(`An error \n ${error}`, event.threadID, event.messageID);
    }
  }
};
