const axios = require("axios");
const cheerio = require("cheerio");

const fontMap = {
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

function transformText(input) {
  let output = "";
  for (let char of input) {
    output += fontMap[char] || char;
  }
  return output;
}

module.exports = {
  config: {
    name: "cricket",
    version: "1.0",
    author: "Samir Œ",
    aliases: ["livecricket", "cricketscore"],
    countDown: 5,
    role: 0,
    shortDescription: "Fetch live cricket scores",
    longDescription:
      "Fetches live cricket scores from ESPN Cricinfo and sends the score in the chat.",
    category: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
    guide: "{pn}",
  },
  onStart: async function ({ message, api, event }) {
    const url = "https://www.espncricinfo.com/live-cricket-score";

    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const matchElement = $(".ds-flex.ds-flex-col.ds-mt-2.ds-mb-2").first();
      const team1 = matchElement.find(".ci-team-score").first();
      const team2 = matchElement.find(".ci-team-score").last();

      const team1Name = team1.find("p").text();
      const team1Score = team1.find("strong").text().split("/");
      const team1Runs = parseInt(team1Score[0]);
      const team1Wickets = team1Score[1];

      const team2Name = team2.find("p").text();
      const team2Score = team2.find("strong").text().split("/");
      const team2Runs = parseInt(team2Score[0]);
      const team2Wickets = team2Score[1];

      const matchDetails = team2
        .find("span")
        .text()
        .trim()
        .match(/\((\d+) ov, T:(\d+)\)/);
      const overs = matchDetails ? matchDetails[1] : "N/A";
      const targetMinutes = matchDetails ? matchDetails[2] : "N/A";

      const runDifference = Math.abs(team1Runs - team2Runs);
      const winningTeam = team1Runs > team2Runs ? team1Name : team2Name;
      const losingTeam = team1Runs > team2Runs ? team2Name : team1Name;
      const resultMessage = `${winningTeam} won by ${runDifference} runs`;

      const messageBody = `
        🏏 Live Cricket Score: 🏏

        Team 1: ${team1Name}:
        Score: ${team1Runs}
        Wickets: ${team1Wickets}

        Team 2: ${team2Name}:
        Score: ${team2Runs}
        Wickets: ${team2Wickets}

        ⏰ Time: ${targetMinutes} minutes
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
  },
};
