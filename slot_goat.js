module.exports = {
  config: {
    name: "slot",
    version: "1.5",
    author: "Mostakim",
    description: {
      role: 2,
      en: "Playing slot game",
    },
    category: "Game",
  },
  langs: {
    en: {
      invalid_amount: "Enter a valid amount of money to play",
      not_enough_money: "Check your balance if you have that amount",
      win_message: "You won $%1!",
      lose_message: "You lost $%1!",
      jackpot_message: "JACKPOT!! You won $%1 for five %2 symbols!",
    },
  },
  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["💚", "🧡", "❤️", "💜", "💙", "💛"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];
    const slot4 = slots[Math.floor(Math.random() * slots.length)];
    const slot5 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = win(slot1, slot2, slot3, slot4, slot5, amount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const messageText = result(slot1, slot2, slot3, slot4, slot5, winnings, getLang);
    return message.reply(messageText);
  },
};

function win(slot1, slot2, slot3, slot4, slot5, betAmount) {
  const isWin = Math.random() < 0.5; 
  const slots = [slot1, slot2, slot3, slot4, slot5];
  const uniqueSlots = new Set(slots);
  const matchedCount = (slots.length - uniqueSlots.size) * 2;

  if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4 && slot4 === slot5) {
    if (slot1 === "💚") return betAmount * 20;
    if (slot1 === "💛") return betAmount * 15;
    if (slot1 === "💙") return betAmount * 10;
    return betAmount * 7;
  }

  if (isWin) {
    return betAmount * (matchedCount > 0 ? matchedCount : 2);
  } else {
    return -betAmount;
  }
}

function result(slot1, slot2, slot3, slot4, slot5, winnings, getLang) {
  const bold = (text) =>
    text
      .replace(/[A-Z]/gi, (c) =>
        String.fromCodePoint(
          c.charCodeAt(0) + (c >= 'a' ? 119737 - 97 : 119743 - 65)
        )
      )
      .replace(/\d/g, (d) =>
        String.fromCodePoint(0x1d7ce + parseInt(d))
      );

  const slotLine = `🎰 [ ${slot1} | ${slot2} | ${slot3} | ${slot4} | ${slot5} ] 🎰`;

  if (winnings > 0) {
    if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4 && slot4 === slot5) {
      return `${bold(slotLine)}\n${bold(getLang("jackpot_message", winnings, slot1))}`;
    } else {
      return `${bold(slotLine)}\n${bold(getLang("win_message", winnings))}`;
    }
  } else {
    return `${bold(slotLine)}\n${bold(getLang("lose_message", -winnings))}`;
  }
}
