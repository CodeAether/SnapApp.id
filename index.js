const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const axios = require("axios");

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

app.post("/api", async (req, res) => {
	if (!req.body.url) return res.status(400).json(["Url Missing"]);
	try {
		type = req.body.type;
		url = req.body.url || "";
		const data = await axios.post(`http://localhost:3000/api`, {
			url,
			type,
		});
		res.json(data.data);
	} catch (e) {
		res.status(200).json([e.message]);
	}
});

app.listen(port, () => {
	console.log(`http://localhost:${port}/`);
});
