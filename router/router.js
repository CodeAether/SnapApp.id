const express = require("express");
const app = express.Router();
const axios = require("axios");
const privateKey = "codeaether";
const CryptoJS = require("crypto-js");

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
	const timestamp = Math.floor(Date.now() / 1000);
	if (!req.body.url) return res.status(400).json(["Url Missing"]);
	if (!req.body.type) return res.status(400).json(["Invalid Type"]);
	if (!req.body.token) return res.status(400).json(["Invalid Token"]);
	try {
		token = req.body.token;
		type = req.body.type;
		url = req.body.url;
		const bytes = CryptoJS.AES.decrypt(token, privateKey);
		const unencryptToken = bytes.toString(CryptoJS.enc.Utf8);
		const urlFromToken = unencryptToken.split("||+||")[0] || "";
		const timestampFromToken = unencryptToken.split("||+||")[1] || "";
		const differentTime = timestamp - timestampFromToken;
		if (urlFromToken != url)
			return res.status(400).json(["something is wrong with the token"]);
		if (differentTime > 30) return res.status(400).json(["token are expired"]);
		const data = await axios.post(`http://localhost:3000/api`, {
			url,
			type,
			token,
		});
		res.json(data.data);
	} catch (e) {
		res.status(200).json([e.message]);
	}
});

module.exports = app;
