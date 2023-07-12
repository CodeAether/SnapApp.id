const express = require("express");
const app = express.Router();
const axios = require("axios");

app.get("/", async (req, res) => {
	res.render("index", { req });
});

app.get("/tos", (req, res) => {
	res.render("page/tos");
});

app.get("/privacypolicy", (req, res) => {
	res.render("page/privacypolicy");
});

app.get("/download/:bahasa", async (req, res) => {
	bahasa = req.params.bahasa;
	try {
		res.render("page/download-page", { bahasa });
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
