const axios = require("axios");
const cheerio = require("cheerio");

const fancyText = {
  " ": " ",
  a: "𝚊",
  b: "𝚋",
  c: "𝚌",
  d: "𝚍",
  e: "𝚎",
  f: "𝚏",
  g: "𝚐",
  h: "𝚑",
  i: "𝚒",
  j: "𝚓",
  k: "𝚔",
  l: "𝚕",
  m: "𝚖",
  n: "𝚗",
  o: "𝚘",
  p: "𝚙",
  q: "𝚚",
  r: "𝚛",
  s: "𝚜",
  t: "𝚝",
  u: "𝚞",
  v: "𝚟",
  w: "𝚠",
  x: "𝚡",
  y: "𝚢",
  z: "𝚣",
  A: "𝙰",
  B: "𝙱",
  C: "𝙲",
  D: "𝙳",
  E: "𝙴",
  F: "𝙵",
  G: "𝙶",
  H: "𝙷",
  I: "𝙸",
  J: "𝙹",
  K: "𝙺",
  L: "𝙻",
  M: "𝙼",
  N: "𝙽",
  O: "𝙾",
  P: "𝙿",
  Q: "𝚀",
  R: "𝚁",
  S: "𝚂",
  T: "𝚃",
  U: "𝚄",
  V: "𝚅",
  W: "𝚆",
  X: "𝚇",
  Y: "𝚈",
  Z: "𝚉",
};

function transformText(text) {
  let transformed = "";
  for (let char of text) {
    transformed += fancyText[char] || char;
  }
  return transformed;
}

module.exports.config = {
  name: "cricket",
  version: "1.0",
  credits: "Samir Œ",
  aliases: ["livecricket", "cricketscore"],
  cooldowns: 5,
  hasPermssion: 0,
  description: "Fetch live cricket scores",
  commandCategory: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
  category: " Utility",
  usePrefix: true,
  prefix: true,
};

module.exports.run = async function ({ message, api, event }) {
  const url = "https://www.espncricinfo.com/live-cricket-score";

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const match = $(".ds-flex.ds-flex-col.ds-mt-2.ds-mb-2").first();

    const team1 = match.find(".ci-team-score").first();
    const team2 = match.find(".ci-team-score").last();

    const name1 = team1.find("p").text();
    const score1 = team1.find("strong").text().split("/");
    const runs1 = parseInt(score1[0]);
    const wickets1 = score1[1];

    const name2 = team2.find("p").text();
    const score2 = team2.find("strong").text().split("/");
    const runs2 = parseInt(score2[0]);
    const wickets2 = score2[1];
    const matchDetails = team2
      .find("span")
      .text()
      .trim()
      .match(/\((\d+) ov, T:(\d+)\)/);

    const overs = matchDetails ? matchDetails[1] : "N/A";
    const timeMinutes = matchDetails ? matchDetails[2] : "N/A";

    const runDifference = Math.abs(runs1 - runs2);
    const winningTeam = runs1 > runs2 ? name1 : name2;
    const losingTeam = runs1 > runs2 ? name2 : name1;
    const resultMessage = `${winningTeam} won by ${runDifference} runs`;

    const messageBody = `
      🏏 Live Cricket Score: 🏏

      Team 1: ${name1}:
      Score: ${runs1}
      Wickets: ${wickets1}

      Team 2: ${name2}:
      Score: ${runs2}
      Wickets: ${wickets2}

      ⏰ Time: ${timeMinutes} minutes
      🔄 Overs: ${overs}

      🏆 Result: ${resultMessage}
    `;

    let update = transformText(messageBody);
    await api.sendMessage(update, event.threadID, event.messageID);
  } catch (error) {
    console.error(`Error fetching the URL: ${error}`);
    await api.sendMessage(
      `❌ Error fetching the live cricket score: ${error.message}`,
      event.threadID,
      event.messageID,
    );
  }
};
