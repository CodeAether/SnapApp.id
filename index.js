const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

//connect ejs
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//build-in middleware
app.use(express.static("public"));

app.get("/", async (req, res) => {
	res.render("index");
});

app.get("/tos", (req, res) => {
	res.render("tos");
});

app.get("/privacypolicy", (req, res) => {
	res.render("privacypolicy");
});

app.get("/:dlmenu", async (req, res) => {
	menu = req.params.dlmenu;
	try {
		if (["youtube", "tiktok", "facebook", "instagram"].includes(menu)) {
			res.render(`page/${menu}`);
		}
	} catch (e) {
		res.status(200).json([e.message]);
	}
});

app.post("/api/:dlmenu", async (req, res) => {
	if (!req.body.url) return res.status(400).json(["Url Missing"]);
	try {
		dlmenu = req.params.dlmenu;
		url = req.body.url || "";
		const result = await fetch(`http://localhost:3000/${dlmenu}?url=${url}`);
		const data = await result.json();
		res.json(data);
	} catch (e) {
		res.status(200).json([e.message]);
	}
});

app.listen(port, () => {
	console.log(`http://localhost:${port}/`);
});
