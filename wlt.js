const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "whitelistthread",
		aliases: ["wlt"],
		version: "1.5",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			en: "Add, remove, edit whiteListThreadIds role"
		},
		category: "owner",
		guide: {
			en: '   {pn} [add | -a | +] <tid>: Add whiteListThreadIds role for thread'
				+ '\n   {pn} [remove | -r | -] <tid>: Remove whiteListThreadIds role of thread'
				+ '\n   {pn} [list | -l]: List all whiteListThreadIds'
				+ '\n   {pn} [mode | -m] <on|off>: Toggle whitelist mode'
		}
	},

	langs: {
		en: {
			added: "✅ | Added whiteListThreadIds role for %1 thread:\n%2",
			alreadyAdmin: "\n⚠️ | %1 thread already have whiteListThreadIds role:\n%2",
			missingIdAdd: "⚠️ | Please enter TID to add whiteListThreadIds role",
			removed: "✅ | Removed whiteListThreadIds role of %1 thread:\n%2",
			notAdmin: "⚠️ | %1 thread doesn't have whiteListThreadIds role:\n%2",
			missingIdRemove: "⚠️ | Please enter TID to remove whiteListThreadIds role",
			turnedOn: "Whitelist mode successfully turned on ✅",
			turnedOff: "Whitelist mode successfully turned off ❎",
			listAdmin: "👑 | List of whiteListThreadIds:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang, api }) {
		switch (args[0]) {
			case "add":
			case "-a":
			case "+": {
				const uids = args.slice(1).filter(arg => !isNaN(arg));
				if (!uids.length) {
					return message.reply(getLang("missingIdAdd"));
				}

				const notAdminIds = [];
				const authorIds = [];
				for (const uid of uids) {
					if (config.whiteListModeThread.whiteListThreadIds.includes(uid)) {
						authorIds.push(uid);
					} else {
						notAdminIds.push(uid);
					}
				}

				config.whiteListModeThread.whiteListThreadIds.push(...notAdminIds);
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const getNames = await Promise.all(
					uids.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				return message.reply(
					(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.filter(({ uid }) => notAdminIds.includes(uid)).map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
					+ (authorIds.length > 0 ? getLang("alreadyAdmin", authorIds.length, authorIds.map(uid => `• ${uid}`).join("\n")) : "")
				);
			}

			case "remove":
			case "-r":
			case "-": {
				const uids = args.slice(1).filter(arg => !isNaN(arg));
				if (!uids.length) {
					return message.reply(getLang("missingIdRemove"));
				}

				const notAdminIds = [];
				const authorIds = [];
				for (const uid of uids) {
					if (config.whiteListModeThread.whiteListThreadIds.includes(uid)) {
						authorIds.push(uid);
					} else {
						notAdminIds.push(uid);
					}
				}

				for (const uid of authorIds) {
					config.whiteListModeThread.whiteListThreadIds.splice(config.whiteListModeThread.whiteListThreadIds.indexOf(uid), 1);
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const getNames = await Promise.all(
					authorIds.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				return message.reply(
					(authorIds.length > 0 ? getLang("removed", authorIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
					+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
				);
			}

			case "list":
			case "-l": {
				const getNames = await Promise.all(
					config.whiteListModeThread.whiteListThreadIds.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}

			case "mode":
			case "-m": {
				const value = args[1] && args[1].toLowerCase() === "on";
				config.whiteListModeThread.enable = value;
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
				return message.reply(getLang(value ? "turnedOn" : "turnedOff"));
			}

			default:
				return message.SyntaxError();
		}
	}
};
