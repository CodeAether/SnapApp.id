const { TiktokDL } = require("@tobyg74/tiktok-api-dl");
const { YoutubeDL } = require("@tobyg74/youtube-api-dl");

const lib = async (dlmenu, url) => {
	if (dlmenu == "youtube") {
		return await youtube(url);
	}
	if (dlmenu == "tiktok") {
		return await tiktok(url);
	}
	if (dlmenu == "facebook") {
		return await facebook(url);
	}
	if (dlmenu == "instagram") {
		return await instagram(url);
	}
};
async function youtube(url) {
	result = await YoutubeDL(url);
	console.log(result);
	return result;
}

async function tiktok(url) {
	result = await TiktokDL(url);
	return result;
}

async function facebook(url) {
	return "Not Available";
}

async function instagram(url) {
	return "Not Available";
}

module.export = lib;
