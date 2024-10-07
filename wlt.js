const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "whitelistthread",
		aliases: ["wlt", "wt"],
		version: "1.5",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			en: "Add, remove, edit whiteListThreadIds role"
		},
		category: "owner",
		guide: {
			en: '   {pn} [add | -a | +] [<tid>...]: Add whiteListThreadIds role for the current thread or specified thread IDs'
				+ '\n   {pn} [remove | -r | -] [<tid>...]: Remove whiteListThreadIds role from the current thread or specified thread IDs'
				+ '\n   {pn} [list | -l]: List all whiteListThreadIds'
				+ '\n   {pn} [mode | -m] <on|off>: Turn on/off whiteListThreadIds mode'
				+ '\n   {pn} [mode | -m] noti <on|off>: Turn on/off notification for non-whiteListThreadIds'
		}
	},

	langs: {
		en: {
			added: `\n╭─✦✅ | 𝙰𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2`,
			alreadyWLT: `╭✦⚠️ | 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝚊𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍𝚜\n%2\n`,
			missingTIDAdd: "⚠️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚃𝙸𝙳 𝚝𝚘 𝚊𝚍𝚍 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍 𝚛𝚘𝚕𝚎",
			removed: `\n╭✦✅ | 𝚁𝚎𝚖𝚘𝚟𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2`,
			notAdded: `╭✦❎ | 𝙳𝚒𝚍𝚗'𝚝 𝚊𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2\n`,
			missingTIDRemove: "⚠️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚃𝙸𝙳 𝚝𝚘 𝚛𝚎𝚖𝚘𝚟𝚎 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍 𝚛𝚘𝚕𝚎",
			listWLTs: `╭✦✨ | 𝙻𝚒𝚜𝚝 𝚘𝚏 𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜\n%1\n╰‣ `,
			turnedOn: "✅ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚗 𝚝𝚑𝚎 𝚖𝚘𝚍𝚎 𝚘𝚗𝚕𝚢 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚋𝚘𝚝",
			turnedOff: "❎ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚏𝚏 𝚝𝚑𝚎 𝚖𝚘𝚍𝚎 𝚘𝚗𝚕𝚢 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚋𝚘𝚝",
			turnedOnNoti: "✅ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚗 𝚝𝚑𝚎 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚠𝚑𝚎𝚗 𝚝𝚑𝚛𝚎𝚊𝚍 𝚒𝚜 𝚗𝚘𝚝 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜",
			turnedOffNoti: "❎ | 𝚃𝚞𝚛𝚗𝚎𝚍 𝚘𝚏𝚏 𝚝𝚑𝚎 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚠𝚑𝚎𝚗 𝚝𝚑𝚛𝚎𝚊𝚍 𝚒𝚜 𝚗𝚘𝚝 𝚠𝚑𝚒𝚝𝚎𝙻𝚒𝚜𝚝𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝚍𝚜"
		}
	},

	onStart: async function ({ message, args, event, getLang, api }) {
		switch (args[0]) {
			case "add":
			case "-a":
			case "+": {
				let tids = args.slice(1).filter(arg => !isNaN(arg));
				if (tids.length <= 0) {
					tids.push(event.threadID);
				}
				const notWLTIDs = [];
				const threadIDs = [];
				for (const tid of tids) {
					if (config.whiteListModeThread.whiteListThreadIds.includes(tid))
						threadIDs.push(tid);
					else
						notWLTIDs.push(tid);
				}
				config.whiteListModeThread.whiteListThreadIds.push(...notWLTIDs);
				const getNames = await Promise.all(tids.map(async tid => {
					const d = await api.getThreadInfo(tid) || {}
	const threadName = d.threadName || "Not found";
					return { tid, name: threadName };
				}));
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
				return message.reply(
					(notWLTIDs.length > 0 ? getLang("added", notWLTIDs.length, getNames.filter(({ tid }) => notWLTIDs.includes(tid)).map(({ tid, name }) => `├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙽𝙰𝙼𝙴: ${name}\n╰‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: ${tid}`).join("\n")) : "")
					+ (threadIDs.length > 0 ? getLang("alreadyWLT", threadIDs.length, threadIDs.map(tid => `╰‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: ${tid}`).join("\n")) : "")
				);
			}
			case "remove":
			case "rm":
			case "-r":
			case "-": {
				let tids = args.slice(1).filter(arg => !isNaN(arg));
				if (tids.length <= 0) {
					tids.push(event.threadID);
				}
				const notWLTIDs = [];
				const threadIDs = [];
				for (const tid of tids) {
					if (config.whiteListModeThread.whiteListThreadIds.includes(tid))
						threadIDs.push(tid);
					else
						notWLTIDs.push(tid);
				}
				for (const tid of threadIDs)
					config.whiteListModeThread.whiteListThreadIds.splice(config.whiteListModeThread.whiteListThreadIds.indexOf(tid), 1);
				const getNames = await Promise.all(threadIDs.map(async tid => {
					const d = await api.getThreadInfo(tid) || {}
const threadName = d.threadName || "Not found";
					return { tid, name: threadName };
				}));
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
				return message.reply(
					(threadIDs.length > 0 ? getLang("removed", threadIDs.length, getNames.map(({ tid, name }) => `├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙽𝙰𝙼𝙴: ${name}\n╰‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: ${tid}`).join("\n")) : "")
					+ (notWLTIDs.length > 0 ? getLang("notAdded", notWLTIDs.length, notWLTIDs.map(tid => `╰‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: ${tid}`).join("\n")) : "")
				);
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.whiteListModeThread.whiteListThreadIds.map(async tid => {
					const t = await api.getThreadInfo(tid) || {}
	const threadName = t.threadName || "Unfetched";
					return { tid, name: threadName };
				}));
				return message.reply(getLang("listWLTs", getNames.map(({ tid, name }) => `├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙽𝙰𝙼𝙴: ${name}\n├‣ 𝚃𝙷𝚁𝙴𝙰𝙳 𝙸𝙳: ${tid}`).join("\n")));
			}
			case "mode":
			case "m":
			case "-m": {
				let isSetNoti = false;
				let value;
				let indexGetVal = 1;

				if (args[1] == "noti") {
					isSetNoti = true;
					indexGetVal = 2;
				}

				if (args[indexGetVal] == "on")
					value = true;
				else if (args[indexGetVal] == "off")
					value = false;

				if (isSetNoti) {
					config.hideNotiMessage.whiteListModeThread = !value;
					message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
				}
				else {
					config.whiteListModeThread.enable = value;
					message.reply(getLang(value ? "turnedOn" : "turnedOff"));
				}

				writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
				break;
			}
			default:
				return message.reply(getLang("missingTIDAdd"));
		}
	}
};
