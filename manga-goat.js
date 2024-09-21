const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};
module.exports.config = {
  name: "manga",
  aliases: [],
  version: "1.7",
  author: "Dipto",
  role: 0,
  category: "media",
  description: { 
    en: "Get manga info and read"
  },
  countDown: 2,
  guide: {
    en: "{pn} <manga name>"
  }
};

module.exports.onStart = async ({ api, event, args }) => {
  try {
    const name = args.join(" ");
    if (!name) return api.sendMessage("Please provide a manga name.", event.threadID, event.messageID);

    const response = await axios.get(`${await baseApiUrl()}/searchManga?search=${name}`);
    const results = response.data;

    if (results.length === 0) return api.sendMessage("No results found.", event.threadID, event.messageID);

    let mangas = "╭───✦ Available Manga ✦───\n";
    results.forEach((manga, index) => {
      mangas += `├‣ ${index + 1}. ${manga.attributes.title.en}\n`;
    });
    mangas += "╰──────────────⧕\nReply with the number of the manga info you want to see.";

    api.sendMessage(
      {
        body: mangas,
      },
      event.threadID,
      (error, info) => {
        if (error) return api.sendMessage(error.message, event.threadID, event.messageID);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "select_manga",
          messageID: info.messageID,
          author: event.senderID,
          mangas: results.map(manga => ({
            id: manga.id,
            title: manga.attributes.title.en
          }))
        });
      },
      event.messageID
    );
  } catch (error) {
    api.sendMessage(error.message, event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event, Reply, usersData }) => {
  const { type, author, mangas, chapterIDs, totalPages, chapterIndex = 0 } = Reply;
  if (event.senderID !== author) return;
  const authorName = await usersData.getName(author);

  if (type === "select_manga") {
    
    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > mangas.length) {
      return api.sendMessage("Invalid choice, please reply with a valid number.", event.threadID, event.messageID);
    }
    try {
      api.unsendMessage(Reply.messageID)
    const selectedManga = mangas[choice - 1];
      const response = await axios.get(`${await baseApiUrl()}/getChapter?mangaID=${selectedManga.id}`);
      let chapters = response.data.data;

      chapters.sort((a, b) => parseFloat(a.attributes.chapter) - parseFloat(b.attributes.chapter));
      
      let info = `╭• Manga Title: ${selectedManga.title}\n|`;
      chapters.forEach((chapter, index) => {
        info += `\n├‣ ${index + 1}. Chapter ${chapter.attributes.chapter} - Pages: ${chapter.attributes.pages}`;
      });

      api.sendMessage(
        {
          body: info.trim(),
        },
        event.threadID,
        (error, info) => {
          if (error) return api.sendMessage(error.message, event.threadID, event.messageID);
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "select_chapter",
            messageID: info.messageID,
            author: event.senderID,
      chapters: chapters.map((chap, idx) => ({
              id: chap.id,
              title: chap.attributes.chapter,
          totalPages: chap.attributes.pages
            }))
            
          });
        },
        event.messageID
      );
    } catch (error) {
      api.sendMessage(`Sorry, there was an error: ${error.message}`, event.threadID, event.messageID);
    }
  } else if (type === "select_chapter") {
    const choice = parseInt(event.body);
const selectedChapter = Reply.chapters.find(item => item.title === choice.toString());
    if (choice < 1 || !selectedChapter) {
      return api.sendMessage("Invalid chapter number, please reply with a valid number.", event.threadID, event.messageID);
    }
 try {
      const response = await axios.get(`${await baseApiUrl()}/getManga?chapterID=${selectedChapter.id}`);
      const imageUrls = response.data;

      let imagesToSend = [];
      for (let i = 0; i < Math.min(4, selectedChapter.totalPages); i++) {
        const imageStream = (await axios.get(imageUrls[i], { responseType: 'stream' })).data;
        imagesToSend.push(imageStream);
      }

      api.sendMessage(
        {
          body: `• Chapter ${selectedChapter.title}, Page 1-${imagesToSend.length} of ${selectedChapter.totalPages}\n• Reader Name: ${authorName}\n• Type next/prev to see more pages or a specific page number.`,
          attachment: imagesToSend
        },
        event.threadID,
        (error, info) => {
          if (error) return api.sendMessage(error.message, event.threadID, event.messageID);

          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "view_chapter",
            messageID: info.messageID,
            author: event.senderID,
            chapterIDs: [selectedChapter.id],
            chapterIndex: 0,
            pageIndex: 0,
            totalPages: [selectedChapter.totalPages]
          });
        }, event.messageID);
    } catch (error) {
      api.sendMessage(`Sorry, there was an error: ${error.message}`, event.threadID, event.messageID);
    }
  } else if (type === "view_chapter") {
    let { pageIndex } = Reply;
    const totalPagesInCurrentChapter = totalPages[chapterIndex];

    if (event.body.toLowerCase() === 'next') {
      pageIndex += 4;
    } else if (event.body.toLowerCase() === 'prev') {
      pageIndex -= 4;
    } else if (!isNaN(parseInt(event.body))) {
      pageIndex = parseInt(event.body) - 1;
    } else {
      return api.sendMessage("Please type a page number or 'next'/'prev'.", event.threadID, event.messageID);
    }

    if (pageIndex < 0 || pageIndex >= totalPagesInCurrentChapter) {
      return api.sendMessage("No more pages available in this chapter.", event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`${await baseApiUrl()}/getManga?chapterID=${chapterIDs[chapterIndex]}`);
      const imageUrls = response.data;

      let imagesToSend = [];
      for (let i = 0; i < Math.min(4, totalPagesInCurrentChapter - pageIndex); i++) {
        const imageStream = (await axios.get(imageUrls[pageIndex + i], { responseType: 'stream' })).data;
        imagesToSend.push(imageStream);
      }

      api.sendMessage(
        {
          body: `• Chapter ${chapterIndex + 1}, Pages ${pageIndex + 1}-${pageIndex + imagesToSend.length} of ${totalPagesInCurrentChapter}\n• Reader Name: ${authorName}\n• Type next/prev to see more pages or a specific page number.`,
          attachment: imagesToSend
        },
        event.threadID,
        (error, info) => {
          if (error) return api.sendMessage(error.message, event.threadID, event.messageID);
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "view_chapter",
            messageID: info.messageID,
            author: event.senderID,
            chapterIDs,
            chapterIndex,
            pageIndex,
            totalPages
          });
        }, event.messageID);
    } catch (error) {
      api.sendMessage(`Sorry, there was an error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
