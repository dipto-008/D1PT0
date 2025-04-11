const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.romim;
};
const config = {
  name: "alya",
  version: "2.0.0",
  author: "nYx",
  credits: "nYx",
  description: "AI-powered Voice chat",
  category: "ai",
  commandCategory: "alya AI",
  usePrefix: false,
  prefix: false,
  dependencies: {
    "axios": "",
  },
};
let responseType = 'text';
const onStart = async ({ message, event, args, commandName }) => {
  const input = args.join(' ');
  const { query, type } = parseInput(input);
  responseType = type;
  await handleResponse({ message, event, input: query, commandName });
};

const onReply = async ({ message, event, Reply, args, commandName }) => {
  if (event.senderID !== Reply.author) return;

  const input = args.join(' ');
  await handleResponse({ message, event, input, commandName });
};

function parseInput(input) {
  let type = responseType;
  let query = input;

  if (input.endsWith('-v')) {
    type = 'voice';
    query = input.slice(0, -2).trim();
  } else if (input.endsWith('-t')) {
    type = 'text';
    query = input.slice(0, -2).trim();
  }

  return { query, type };
}

async function handleResponse({ message, event, input, commandName }) {
  try {
    const { data } = await axios.get(
      `${await baseApiUrl()}alya_ai?query=${input}&type=${responseType}`
    );

    if (responseType === 'voice') {
      const dat = await global.utils.getStreamFromUrl(data.data);
      message.reply({ attachment: dat }, (err, info) => {
        if (!err) {
          // GoatBot reply
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });

          // Mirai Bot
          global.client.handleReply.push({
            name: config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });
    } else {
      message.reply(data.data, (err, info) => {
        if (!err) {
          // GoatBot reply
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });

          // Mirai Bot
          global.client.handleReply.push({
            name: config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });
    }
  } catch (e) {
    message.reply(`Error: ${e.message}`);
  }
}

module.exports = {
  config,
  onStart,
  onReply,
  run: onStart,
  handleReply: onReply,
};
