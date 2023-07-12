const express = require("express");
const app = express.Router();
const axios = require("axios");

app.get("/", async (req, res) => {
	if (req.language === "id") {
		res.redirect("/id");
	} else {
		res.redirect("/en");
	}
});
app.get("/id", async (req, res) => {
	res.render("id/index", { req });
});
app.get("/en", async (req, res) => {
	res.render("en/index", { req });
});

app.get("/tos", (req, res) => {
	res.render("en/page/tos");
});

app.get("/privacypolicy", (req, res) => {
	res.render("en/page/privacypolicy");
});

app.get("/download/", async (req, res) => {
	if (req.language === "id") {
		res.redirect("/download/id");
	} else {
		res.redirect("/download/en");
	}
});
app.get("/download/id", async (req, res) => {
	try {
		res.render("id/page/download-page");
	} catch (e) {
		res.status(200).json([e.message]);
	}
});
app.get("/download/en", async (req, res) => {
	try {
		res.render("en/page/download-page");
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

module.exports = app;
