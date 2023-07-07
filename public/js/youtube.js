const linkUrl = document.getElementById("link_url");
const resultWrapper = document.getElementById("resultWrapper");
const privateKey = CryptoJS.AES.encrypt("SnapApp", "codeaether").toString();
let linkType;
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
	timer: 2000,
	timerProgressBar: true,
});

function sleksiUrl(url) {
	url = url.replace(/^(https?:\/\/)?(www\.)?/i, "");
	if (url.includes("youtube.com") || url.includes("youtu.be")) {
		return "YouTube";
	} else if (url.includes("facebook.com")) {
		return "Facebook";
	} else if (url.includes("tiktok.com")) {
		return "TikTok";
	} else if (url.includes("instagram.com")) {
		return "Instagram";
	} else if (url.includes("twitter.com")) {
		return "Twitter";
	} else {
		return undefined;
	}
}

// paste funtion
document.getElementById("pasteBtn").addEventListener("click", function () {
	pasteBtn = document.getElementById("pasteBtn");
	if (!linkUrl.value) {
		navigator.clipboard.readText().then(async function (text) {
			if (text === "") {
				await Toast.fire({
					icon: "warning",
					title: "No link to paste!",
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

// download function
document
	.getElementById("downloadButton")
	.addEventListener("click", async function () {
		// return
		if (!linkUrl.value) {
			return await Toast.fire({
				icon: "error",
				title: "Please, Enter the url first!",
			});
		}
		if (!regex.test(linkUrl.value)) {
			return await Toast.fire({
				icon: "error",
				title: "Oops, its not a URL!",
			});
		}

		// cek type url
		let typeUrl = sleksiUrl(linkUrl.value);
		if (!typeUrl) {
			let options = ["Youtube", "Facebook", "Instagram", "Tiktok"];
			await Swal.fire({
				title: `Oops, we can't detect type URL you entered.
						please select your URL type`,
				input: "select",
				inputOptions: options,
				inputPlaceholder: "Select a type",
				showCancelButton: true,
				inputValidator: (value) => {
					typeUrl = options[value].toLowerCase();
				},
			});
		}

		// lolos
		// loading
		Toast.fire({
			icon: "info",
			title: "Please wait, the media is being prepared.",
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
		const resAPI = await axios
			.post(`/api/${typeUrl}`, {
				url: linkUrl.value,
			})
			.catch(async function () {
				return await Toast.fire({
					icon: "error",
					title: "Oops, something was wrong!",
				});
			});
		const response = resAPI.data;
		if (!response.status) {
			resultWrapper.innerHTML = "";
			return await Toast.fire({
				icon: "error",
				title: "Oops, something was wrong!",
			});
		}
		console.log(response);
		resultWrapper.innerHTML = response.data;
		return Toast.fire({
			icon: "success",
			title: "Success, your media is ready to be downloaded",
		});
	});
