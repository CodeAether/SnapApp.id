const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
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

//connect ejs
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//build-in middleware
app.use(express.static("public"));
app.use(async (req, res, next) => {
	res.locals.titleweb = "Snap App";
	res.locals.req = req;
	next();
});

app.get("/", async (req, res) => {
	res.render("index");
});

app.get("/:dlmenu", async (req, res) => {
	menu = req.params.dlmenu;
	if (["youtube", "tiktok", "facebook", "instagram"].includes(menu)) {
		firstLetter = menu.charAt(0).toUpperCase();
		menuUpper = firstLetter + menu.slice(1);
		data = {
			tittle: menu,
			menudl: menuUpper,
		};
		console.log(data);
		res.render(`page/${menu}`, data);
	}
});

app.post("/api/:dlmenu", async (req, res) => {
	dlmenu = req.params.dlmenu;
	url = req.body.snapUri || "";
	key = req.body.privateKey || "";
	query = req.query.url;
	if (key != "snapsnapsnap") return res.status(400).json(["Not Permission"]);
	if (!url) return res.status(400).json(["Url Missing"]);
	if (["youtube", "tiktok", "facebook", "instagram"].includes(dlmenu)) {
		try {
			result = await lib(dlmenu, url);
			return res.json(result);
		} catch (e) {
			console.log(e);
		}
	}
});

app.listen(port, () => {
	console.log(`App Running!!!\nin port${port}\nhttp://localhost:3000/`);
});
