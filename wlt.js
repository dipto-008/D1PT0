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
			en: '   {pn} [add | -a] <tid>: Add whiteListThreadIds role for thread'
				+ '\n	  {pn} [remove | -r] <tid>: Remove whiteListThreadIds role of thread'
				+ '\n	  {pn} [list | -l]: List all whiteListThreadIds'
		}
	},

	langs: {
		en: {
			added: "✅ | Added whiteListThreadIds role for %1 thread:\n%2",
			alreadyAdmin: "\n⚠️ | %1 thread already have whiteListThreadIds role:\n%2",
			missingIdAdd: "⚠️ | Please enter TID to add whiteListThreadIds role",
			removed: "✅ | Removed whiteListThreadIds role of %1 thread:\n%2",
			notAdmin: "⚠️ | %1 users don't have whiteListIds role:\n%2",
			missingIdRemove: "⚠️ | Please enter TID to remove whiteListThreadIds role",
			turnedOn: "Successfully turned on ✅",
			turnedOff: "Successfully turned off ❎",
			listAdmin: "👑 | List of whiteListThreadIds:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang, api }) {
		switch (args[0]) {
			case "add":
			case "-a":
            case "+": {
				if (args[1]) {
					let uids = [];
					if (uids.push(event.threadID));
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const authorIds = [];
					for (const uid of uids) {
						if (config.whiteListModeThread.whiteListThreadIds.includes(uid))
							authorIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.whiteListModeThread.whiteListThreadIds.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (authorIds.length > 0 ? getLang("alreadyAdmin", authorIds.length, authorIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r":
            case "-": {
              if (args[1]) {
                let uids = [];
                if (uids.push(event.threadID));
                else
                  uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const authorIds = [];
					for (const uid of uids) {
						if (config.whiteListModeThread.whiteListThreadIds.includes(uid))
							authorIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of authorIds)
						config.whiteListModeThread.whiteListThreadIds.splice(config.whiteListModeThread.whiteListThreadIds.indexOf(uid), 1);
					const getNames = await Promise.all(authorIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(authorIds.length > 0 ? getLang("removed", authorIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.whiteListModeThread.whiteListThreadIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			case "mode":
			case "-m":{
			config.whiteListModeThread.enable = value;
			message.reply(getLang(value ? "turnedOn" : "turnedOff"));
		        fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
		}
			default:
				return message.SyntaxError();
		}
	}
};
