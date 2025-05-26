module.exports = {
  config: {
    name: "bank",
    version: "1.0.0",
    author: "Mostakim",
    description: "Manage your virtual bank account",
    usage: "{p}bank [deposit|withdraw|show|interest|transfer]",
    category: "economy",
  },

  onStart: async function ({ message, args, usersData, event }) {
    const uid = event.senderID;
    const command = args[0];

    if (!command) {
      return message.reply(
        `========[𝐁𝐀𝐍𝐊 𝐒𝐘𝐒𝐓𝐄𝐌]========\n` +
        `𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬:\n` +
        `❏ deposit     – 𝐏𝐮𝐭 𝐦𝐨𝐧𝐞𝐲 𝐢𝐧𝐭𝐨 𝐛𝐚𝐧𝐤\n` +
        `❏ withdraw    – 𝐓𝐚𝐤𝐞 𝐦𝐨𝐧𝐞𝐲 𝐟𝐫𝐨𝐦 𝐛𝐚𝐧𝐤\n` +
        `❏ show        – 𝐒𝐡𝐨𝐰 𝐛𝐚𝐧𝐤 𝐛𝐚𝐥𝐚𝐧𝐜𝐞\n` +
        `❏ interest    – 𝐆𝐞𝐭 𝐝𝐚𝐢𝐥𝐲 𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭\n` +
        `❏ transfer    – 𝐒𝐞𝐧𝐝 𝐛𝐚𝐧𝐤 𝐦𝐨𝐧𝐞𝐲 𝐭𝐨 𝐚𝐧𝐨𝐭𝐡𝐞𝐫\n` +
        `Use command: 𝐛𝐚𝐧𝐤 [𝐜𝐨𝐦𝐦𝐚𝐧𝐝] to interact.\n` +
        `=================================`
      );
    }

    const data = await usersData.get(uid);
    data.bank = data.bank || 0;
    data.money = data.money || 0;

    if (command === "deposit") {
      const amount = parseInt(args[1]);
      if (isNaN(amount)) return message.reply("✅ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐚𝐦𝐨𝐮𝐧𝐭 𝐲𝐨𝐮 𝐰𝐢𝐬𝐡 𝐭𝐨 𝐝𝐞𝐩𝐨𝐬𝐢𝐭 𝐢𝐧 𝐭𝐡𝐞 𝐛𝐚𝐧𝐤.");
      if (data.money < amount) return message.reply("❌ 𝐘𝐨𝐮 𝐝𝐨𝐧'𝐭 𝐡𝐚𝐯𝐞 𝐞𝐧𝐨𝐮𝐠𝐡 𝐦𝐨𝐧𝐞𝐲.");

      data.money -= amount;
      data.bank += amount;
      await usersData.set(uid, data);
      return message.reply(`✅ ${amount}$ 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐝𝐞𝐩𝐨𝐬𝐢𝐭𝐞𝐝 𝐢𝐧𝐭𝐨 𝐲𝐨𝐮𝐫 𝐛𝐚𝐧𝐤 𝐚𝐜𝐜𝐨𝐮𝐧𝐭.`);
    }

    if (command === "withdraw") {
      const amount = parseInt(args[1]);
      if (isNaN(amount)) return message.reply("✅ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐚𝐦𝐨𝐮𝐧𝐭 𝐲𝐨𝐮 𝐰𝐢𝐬𝐡 𝐭𝐨 𝐰𝐢𝐭𝐡𝐝𝐫𝐚𝐰 𝐟𝐫𝐨𝐦 𝐲𝐨𝐮𝐫 𝐛𝐚𝐧𝐤 𝐚𝐜𝐜𝐨𝐮𝐧𝐭.");
      if (data.bank < amount) return message.reply("❌ 𝐓𝐡𝐞 𝐚𝐦𝐨𝐮𝐧𝐭 𝐲𝐨𝐮 𝐰𝐚𝐧𝐭 𝐭𝐨 𝐰𝐢𝐭𝐡𝐝𝐫𝐚𝐰 𝐢𝐬 𝐧𝐨𝐭 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞.");

      data.bank -= amount;
      data.money += amount;
      await usersData.set(uid, data);
      return message.reply(`✅ ${amount}$ 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐰𝐢𝐭𝐡𝐝𝐫𝐚𝐰𝐧 𝐟𝐫𝐨𝐦 𝐲𝐨𝐮𝐫 𝐛𝐚𝐧𝐤 𝐚𝐜𝐜𝐨𝐮𝐧𝐭.`);
    }

    if (command === "show") {
      return message.reply(`🏦 𝐘𝐨𝐮𝐫 𝐛𝐚𝐧𝐤 𝐚𝐜𝐜𝐨𝐮𝐧𝐭 𝐛𝐚𝐥𝐚𝐧𝐜𝐞 𝐢𝐬 ${data.bank}$.`);
    }

    if (command === "interest") {
      const interest = Math.floor(data.bank * 0.05);
      data.bank += interest;
      await usersData.set(uid, data);
      return message.reply(`✅ 𝐈𝐧𝐭𝐞𝐫𝐞𝐬𝐭 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐚𝐝𝐝𝐞𝐝 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐛𝐚𝐧𝐤 𝐚𝐜𝐜𝐨𝐮𝐧𝐭.\n➕ 𝐓𝐡𝐞 𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭 𝐞𝐚𝐫𝐧𝐞𝐝 𝐢𝐬 ${interest}$.`);
    }

    if (command === "transfer") {
      const amount = parseInt(args[1]);
      const targetUID = args[2];
      if (isNaN(amount)) return message.reply("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐚𝐦𝐨𝐮𝐧𝐭 𝐲𝐨𝐮 𝐰𝐢𝐬𝐡 𝐭𝐨 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫.");
      if (data.bank < amount) return message.reply("❌ 𝐘𝐨𝐮𝐫 𝐛𝐚𝐥𝐚𝐧𝐜𝐞 𝐢𝐬 𝐧𝐨𝐭 𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭.");
      if (!targetUID) return message.reply("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐫𝐞𝐜𝐢𝐩𝐢𝐞𝐧𝐭 𝐔𝐈𝐃.");

      const targetData = await usersData.get(targetUID);
      targetData.bank = targetData.bank || 0;

      data.bank -= amount;
      targetData.bank += amount;

      await usersData.set(uid, data);
      await usersData.set(targetUID, targetData);

      return message.reply(`✅ ${amount}$ 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫𝐫𝐞𝐝 𝐭𝐨 𝐔𝐈𝐃: ${targetUID}`);
    }

    return message.reply("❌ 𝐔𝐧𝐤𝐧𝐨𝐰𝐧 𝐜𝐨𝐦𝐦𝐚𝐧𝐝. 𝐓𝐫𝐲: 𝐝𝐞𝐩𝐨𝐬𝐢𝐭, 𝐰𝐢𝐭𝐡𝐝𝐫𝐚𝐰, 𝐬𝐡𝐨𝐰, 𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭, 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫.");
  }
};
