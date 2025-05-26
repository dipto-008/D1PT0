const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.5",
    author: "Mostakim",
    usePrefix: false,
    role: 0,
    category: "info",
    priority: 1
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const prefix = getPrefix(event.threadID);
    const arg = args[0]?.toLowerCase();

    const header = "╔═━「 𝐇𝐄𝐋𝐏 𝐌𝐄𝐍𝐔 」━═╗";
    const footer = "╚═━──────────────━═╝";

    if (!arg) {
      const list = Array.from(commands.entries())
        .filter(([_, cmd]) => cmd.config?.role <= role)
        .map(([name]) => `┃ ✦ ${name}`)
        .join("\n");

      return message.reply(
        `${header}\n` +
        `┃ 🔑 Prefix: ${prefix}\n` +
        `┃ 📂 Total Commands: ${commands.size}\n` +
        `┃ ⚙️ Available Commands:\n` +
        `${list}\n` +
        `${footer}\n` +
        `\n📌 Use \`${prefix}help -<category>\` to filter by category\n` +
        `📌 Use \`${prefix}help <command>\` to see command info`
      );
    }

    if (arg === "-c" && args[1]) {
      const cmdName = args[1].toLowerCase();
      const cmd = commands.get(cmdName) || commands.get(global.GoatBot.aliases.get(cmdName));

      if (!cmd || cmd.config.role > role)
        return message.reply(`✘ Command "${cmdName}" not found or access denied.`);

      return message.reply(
        `${header}\n` +
        `┃ ✦ Command: ${cmdName}\n` +
        `┃ ✦ Category: ${cmd.config.category || "Uncategorized"}\n` +
        `${footer}`
      );
    }

    if (arg.startsWith("-")) {
      const category = arg.slice(1).toLowerCase();
      const matched = Array.from(commands.entries())
        .filter(([_, cmd]) => cmd.config?.category?.toLowerCase() === category && cmd.config.role <= role)
        .map(([name]) => `┃ ✦ ${name}`);

      if (matched.length === 0)
        return message.reply(`✘ No commands found under "${category}".`);

      return message.reply(
        `╔═━「 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘: ${category.toUpperCase()} 」━═╗\n` +
        `${matched.join("\n")}\n` +
        `${footer}\n` +
        `\n📌 Try: \`${prefix}help <command>\` to view details`
      );
    }

    const cmd = commands.get(arg) || commands.get(global.GoatBot.aliases.get(arg));

    if (!cmd || cmd.config.role > role)
      return message.reply(`✘ Command "${arg}" not found.`);

    const info = cmd.config;
    const guide = info.guide?.en || "No usage info.";
    const desc = info.longDescription?.en || "No description.";

    return message.reply(
      `╔═━「 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 」━═╗\n` +
      `┃ ✦ Name: ${info.name}\n` +
      `┃ ✦ Description: ${desc}\n` +
      `┃ ✦ Usage: ${guide.replace(/{p}/g, prefix).replace(/{n}/g, info.name)}\n` +
      `┃ ✦ Role: ${info.role}\n` +
      `┃ ✦ Category: ${info.category || "Uncategorized"}\n` +
      `${footer}`
    );
  }
};
