const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "whitelistonly",
		aliases: ["wlonly", "onlywlst", "onlywhitelist"],
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			en: "turn on/off only whitelistIds can use bot"
		},
		category: "owner",
		guide: {
			en: "   {pn} [on | off]: turn on/off the mode only whitelistIds can use bot"
				+ "\n   {pn} noti [on | off]: turn on/off the notification when user is not whitelistIds use bot"
		}
	},

	langs: {
		en: {
			turnedOn: "Turned on the mode only whitelistIds can use bot",
			turnedOff: "Turned off the mode only whitelistIds can use bot",
			turnedOnNoti: "Turned on the notification when user is not whitelistIds use bot",
			turnedOffNoti: "Turned off the notification when user is not whitelistIds use bot"
		}
	},

	onStart: function ({ args, message, getLang }) {
		let isSetNoti = false;
		let value;
		let indexGetVal = 0;

		if (args[0] == "noti") {
			isSetNoti = true;
			indexGetVal = 1;
		}

		if (args[indexGetVal] == "on")
			value = true;
		else if (args[indexGetVal] == "off")
			value = false;
		else
			return message.SyntaxError();

		if (isSetNoti) {
			config.hideNotiMessage.whiteListMode = !value;
			message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
		}
		else {
			config.whiteListMode.enable = value;
			message.reply(getLang(value ? "turnedOn" : "turnedOff"));
		}

		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
	}
};
