const linkUrl = document.getElementById("link_url");
const resultWrapper = document.getElementById("resultWrapper");
const privateKey = "codeaether";
let typeUrl;
let process = false;
let regex =
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const Toast = Swal.mixin({
	toast: true,
	position: "top-right",
	iconColor: "white",
	customClass: {
		popup: "colored-toast",
	},
	showConfirmButton: false,
	timer: 5000,
	timerProgressBar: true,
});

function sleksiUrl(url) {
	url = url.replace(/^(https?:\/\/)?(www\.)?/i, "");
	if (url.includes("youtube.com") || url.includes("youtu.be")) {
		return "youtube";
	} else if (url.includes("facebook.com")) {
		return "fb";
	} else if (url.includes("tiktok.com")) {
		return "tiktok";
	} else if (url.includes("instagram.com")) {
		return "ig";
	} else {
		return undefined;
	}
}

// Fungsi paste
document.getElementById("pasteBtn").addEventListener("click", function () {
	pasteBtn = document.getElementById("pasteBtn");
	if (!linkUrl.value) {
		navigator.clipboard.readText().then(async function (text) {
			if (text === "") {
				await Toast.fire({
					icon: "warning",
					title: "Tidak ada tautan yang akan ditempelkan!",
				});
				return;
			}
			linkUrl.value = text;
			pasteBtn.innerHTML = `<i class="bi bi-x-circle"></i>`;
		});
	} else {
		linkUrl.value = "";
		pasteBtn.innerHTML = `<i class="bi bi-clipboard"></i>`;
	}
});

linkUrl.addEventListener("input", function () {
	if (linkUrl.value === "") {
		pasteBtn.innerHTML = `<i class="bi bi-clipboard"></i>`;
	} else {
		pasteBtn.innerHTML = `<i class="bi bi-x-circle"></i>`;
	}
});

// Fungsi unduh
document
	.getElementById("downloadButton")
	.addEventListener("click", async function () {
		// Kembalikan jika tidak ada URL yang dimasukkan
		if (!linkUrl.value) {
			return await Toast.fire({
				icon: "error",
				title: "Silakan masukkan URL terlebih dahulu!",
			});
		}
		if (process) {
			return await Toast.fire({
				icon: "error",
				title: "Oops, Anda sedang dalam proses!",
			});
		}
		if (!regex.test(linkUrl.value)) {
			return await Toast.fire({
				icon: "error",
				title: "Oops, ini bukan URL yang valid!",
			});
		}

		// Periksa tipe URL
		let typeUrl = sleksiUrl(linkUrl.value);
		if (!typeUrl) {
			let options = ["Youtube", "Facebook", "Instagram", "Tiktok"];
			await Swal.fire({
				title: `Oops, kami tidak dapat mendeteksi jenis URL yang Anda masukkan.
						Silakan pilih jenis URL Anda`,
				input: "select",
				inputOptions: options,
				inputPlaceholder: "Pilih jenis",
				showCancelButton: true,
				inputValidator: (value) => {
					pilihan = options[value].toLowerCase();
					typeUrl =
						pilihan === "facebook"
							? "fb"
							: pilihan === "instagram"
							? "ig"
							: pilihan;
				},
			});
		}

		// Berhasil
		// Tampilkan loading
		process = true;
		Toast.fire({
			icon: "info",
			title: "Harap tunggu, media sedang disiapkan.",
		});
		resultWrapper.innerHTML = `
        <div
            id="result"
            style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 50vh;
                max-height: 100wh;
            ">
            <img
                src="/img/loading.gif"
                alt="" />
        </div>
        `;
		const timestamp = Math.floor(Date.now() / 1000);
		const token = CryptoJS.AES.encrypt(
			`${linkUrl.value}||+||${timestamp}`,
			privateKey
		).toString();
		const resAPI = await axios
			.post(`/api`, {
				url: linkUrl.value,
				type: typeUrl,
				token,
			})
			.catch(async function (e) {
				return await Toast.fire({
					icon: "error",
					title: "Oops, terjadi kesalahan!",
				});
			});

		const response = resAPI.data;
		if (response == "Request failed with status code 429") {
			resultWrapper.innerHTML = "";
			process = false;
			return await Toast.fire({
				icon: "error",
				title: "Oops, Anda mencapai batas, coba lagi dalam 30 detik!",
			});
		}
		if (!response.status) {
			resultWrapper.innerHTML = "";
			process = false;
			return await Toast.fire({
				icon: "error",
				title: "Oops, terjadi kesalahan!",
			});
		}
		resultWrapper.innerHTML = response.data;
		process = false;
		return Toast.fire({
			icon: "success",
			title: "Berhasil, media Anda siap untuk diunduh",
		});
	});
