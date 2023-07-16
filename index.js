const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Routes = require("./router/router.js");

require("dotenv").config();

async function connectDB() {
	await mongoose
		.connect(process.env.DATABASE_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("Terhubung ke MongoDB");
		})
		.catch((err) => {
			console.error("Koneksi ke MongoDB gagal:", err);
		});
}

const dataSchema = new mongoose.Schema({
	visitorCount: {
		type: Number,
		default: 0,
	},
	totalTodayVisitor: {
		type: Number,
		default: 0,
	},
	totalDownload: {
		type: Number,
		default: 0,
	},
	lastUpdated: {
		type: Date,
		default: Date.now,
	},
});

const Data = mongoose.model("Data", dataSchema);

app.use(async (req, res, next) => {
	if (
		!req.url.startsWith("/css") &&
		!req.url.startsWith("/js") &&
		!req.url.startsWith("/img")
	) {
		try {
			let data = await Data.findOne();
			if (!data) {
				data = new Data();
			}
			// total visitor
			data.visitorCount += 1;

			// total download
			if (req.url.startsWith("/api")) {
				data.totalDownload += 1;
			}

			// total visitor today
			const today = new Date().toISOString().split("T")[0];
			if (
				data.lastUpdated &&
				data.lastUpdated.toISOString().split("T")[0] !== today
			) {
				data.totalTodayVisitor = 1;
			} else {
				data.totalTodayVisitor += 1;
			}
			data.lastUpdated = today;

			// save data
			await data.save();

			// add to req
			req.visitor = data.visitorCount;
			req.totalDownload = data.totalDownload;
			req.totalTodayVisitor = data.totalTodayVisitor; // Menggunakan nilai yang telah diperbarui setelah penyimpanan
		} catch (err) {
			console.error("Gagal mengupdate data:", err);
		}
	}
	next();
});

//connect ejs
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware untuk mendeteksi bahasa
app.use((req, res, next) => {
	const acceptLanguage = req.headers["accept-language"];
	const languages = acceptLanguage ? acceptLanguage.split(",") : [];
	const language =
		languages.length > 0 ? languages[0].split(";")[0] : "unknown";
	req.language = language;
	next();
});

//build-in middleware
app.use(express.static("public"));

app.use("/", Routes);

app.listen(port, async () => {
	await connectDB();
	console.log(`http://localhost:${port}/`);
});
