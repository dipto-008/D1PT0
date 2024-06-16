const a = require('axios');

const c = require('cheerio');



const f = {

  ' ': ' ',

  'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑',

  'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚',

  'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',

  'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷',

  'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀',

  'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',

};



function t(x) {

  let y = '';

  for (let z of x) {

    y += f[z] || z;

  }

  return y;

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

    longDescription: "Fetches live cricket scores from ESPN Cricinfo and sends the score in the chat.",

    category: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",

    guide: "{pn}"

  },

  onStart: async function ({ message, api, event }) {

    const u = 'https://www.espncricinfo.com/live-cricket-score';



    try {

      const r = await a.get(u);

      const h = r.data;

      const $ = c.load(h);



      const m = $('.ds-flex.ds-flex-col.ds-mt-2.ds-mb-2').first();



      const t1 = m.find('.ci-team-score').first();

      const t2 = m.find('.ci-team-score').last();



      const n1 = t1.find('p').text();

      const s1 = t1.find('strong').text().split('/');

      const sc1 = parseInt(s1[0]);

      const w1 = s1[1];



      const n2 = t2.find('p').text();

      const s2 = t2.find('strong').text().split('/');

      const sc2 = parseInt(s2[0]);

      const w2 = s2[1];

      const md = t2.find('span').text().trim().match(/\((\d+) ov, T:(\d+)\)/);



      const o = md ? md[1] : 'N/A';

      const tm = md ? md[2] : 'N/A';



      const rd = Math.abs(sc1 - sc2);

      const wt = sc1 > sc2 ? n1 : n2;

      const lt = sc1 > sc2 ? n2 : n1;

      const rm = `${wt} won by ${rd} runs`;



      const mb = `

        🏏 Live Cricket Score: 🏏



          Team 1: ${n1}:

          Score: ${sc1}

          Wickets: ${w1}



          Team 2: ${n2}:

          Score: ${sc2}

          Wickets: ${w2}



        ⏰ Time: ${tm} minutes

        🔄 Overs: ${o}



        🏆 Result: ${rm}

      `;



      let update = t(mb);

      await api.sendMessage(update, event.threadID, event.messageID);



    } catch (e) {

      console.error(`Error fetching the URL: ${e}`);

      await api.sendMessage(`❌ Error fetching the live cricket score: ${e.message}`, event.threadID, event.messageID);

    }

  }

};
