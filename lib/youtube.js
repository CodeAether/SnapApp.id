var fetchVideoInfo = require("youtube-infofix");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

async function yt(yutub) {
	function post(url, formdata) {
		return fetch(url, {
			method: "POST",
			headers: {
				accept: "*/*",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			body: new URLSearchParams(Object.entries(formdata)),
		});
	}
	const ytIdRegex =
		/(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/|shorts\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/;
	let ytId = ytIdRegex.exec(yutub);
	url = "https://youtu.be/" + ytId[1];
	let res = await post(`https://www.y2mate.com/mates/analyzeV2/ajax`, {
		url,
		q_auto: 0,
		ajax: 1,
	});
	const resFetch = await res.json();
	const $ = cheerio.load(resFetch.result);
	let id = /var k__id = "(.*?)"/.exec(resFetch.result)[1];
	let anu = await fetchVideoInfo(ytId[1]);
	const result = [];
	let title = anu.title;
	let thumb = anu.thumbnailUrl;
	let views = anu.views;
	let mp4length = $("#mp4 tbody tr td")
		.toArray()
		.map((v) => $(v).find("a").attr("data-fquality"))
		.filter((v) => !!v).length;
	let mp3length = $("#mp3 tbody tr td")
		.toArray()
		.map((v) => $(v).find("a").attr("data-fquality"))
		.filter((v) => !!v).length;
	let sizemp3 = [];
	let qualitymp3 = [];
	let linkmp3 = [];
	let sizemp4 = [];
	let qualitymp4 = [];
	let linkmp4 = [];
	if (mp4length === 1) {
		let rezsize = $("div")
			.find(`#mp4 > table > tbody > tr:nth-child(1) > td:nth-child(2)`)
			.text();
		let rezquality = $("div")
			.find(`#mp4 > table > tbody > tr:nth-child(1) > td:nth-child(3) > a`)
			.attr("data-fquality");
		sizemp4.push(rezsize);
		qualitymp4.push(rezquality + "p");
	}
	for (let i = 1; i < mp4length; i++) {
		let rezsize = $("div")
			.find(`#mp4 > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`)
			.text();
		let rezquality = $("div")
			.find(`#mp4 > table > tbody > tr:nth-child(${i}) > td:nth-child(3) > a`)
			.attr("data-fquality");
		sizemp4.push(rezsize);
		qualitymp4.push(rezquality + "p");
	}
	for (let e of qualitymp4) {
		i = e.split("p")[0];
		let res2 = await post(`https://www.y2mate.com/mates/en68/convert`, {
			type: "youtube",
			_id: id,
			v_id: ytId[1],
			ajax: "1",
			token: "",
			ftype: "mp4",
			fquality: i,
		});
		const meme = await res2.json();
		const supp = cheerio.load(meme.result);
		let linky = supp("div").find("a").attr("href");
		linkmp4.push(linky);
	}
	if (mp3length === 1) {
		let rezsize = $("div")
			.find(`#mp3 > table > tbody > tr:nth-child(1) > td:nth-child(2)`)
			.text();
		let rezquality = $("div")
			.find(`#mp3 > table > tbody > tr:nth-child(1) > td:nth-child(3) > a`)
			.attr("data-fquality");
		sizemp3.push(rezsize);
		qualitymp3.push(rezquality + "kbps");
	}
	for (let i = 1; i < mp3length; i++) {
		console.log(i);
		let rezsize = $("div")
			.find(`#mp3 > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`)
			.text();
		let rezquality = $("div")
			.find(`#mp3 > table > tbody > tr:nth-child(${i}) > td:nth-child(3) > a`)
			.attr("data-fquality");
		sizemp3.push(rezsize);
		qualitymp3.push(rezquality + "kbps");
	}
	for (let e of qualitymp3) {
		i = e.split("kbps")[0];
		let res2 = await post(`https://www.y2mate.com/mates/en68/convert`, {
			type: "youtube",
			_id: id,
			v_id: ytId[1],
			ajax: "1",
			token: "",
			ftype: "mp3",
			fquality: i,
		});
		const meme = await res2.json();
		const supp = cheerio.load(meme.result);
		let linky = supp("div").find("a").attr("href");
		linkmp3.push(linky);
	}
	result.push({
		title,
		thumb,
		views,
		sizemp4,
		qualitymp4,
		linkmp4,
		sizemp3,
		qualitymp3,
		linkmp3,
	});
	return result;
}
module.exports = yt;
