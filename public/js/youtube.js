const linkUrl = document.getElementById("link_url");
const resultWrapper = document.getElementById("resultWrapper");
const privateKey = CryptoJS.AES.encrypt("SnapApp", "codeaether").toString();
var regex =
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
		const resAPI = await axios.post("/api/youtube", {
			url: linkUrl.value,
		});
		const response = resAPI.data;

		// result
		resultVideo = [];
		resultAudio = [];
		// lopping add result to array
		for (let i = 0; i < response.result.video.length; i++) {
			data = response.result.video[i];
			resultVideo += `
			<tr>
			<td>${data.resolution}</td>
			<td>${data.size}</td>
			<td>
				<a
					href="${data.url}"
					class="btn btn-primary"
					target="_blank"
					download>Download</a
				>
			</td>
			</tr>
			`;
		}
		for (let i = 0; i < response.result.audio.length; i++) {
			data = response.result.audio[i];
			resultAudio += `
			<tr>
			<td>${data.resolution}</td>
			<td>${data.size}</td>
			<td>
				<a
					href="${data.url}"
					class="btn btn-primary"
					target="_blank"
					download>Download</a
				>
			</td>
			</tr>
			`;
		}
		resultWrapper.innerHTML = `
			<div id="result">
			<div class="row">
				<div class="details col-md-6">
					<img
						src="${response.thumbnail}"
						alt="ThumbnailImage" />
					<h5 class="mt-2">
						${response.title}
					</h5>
					<div class="row mt-2">
						<div class="col">
							<p><b>Views: </b>${response.views}</p>
							<p><b>Duration: </b>${response.duration}</p>
						</div>
						<div class="col">
							<p><b>Like: </b>${response.likes}</p>
							<p><b>Dislike: </b>${response.dislikes}</p>
						</div>
					</div>
				</div>
				<div class="download-tabs col-md-6">
					<ul
						class="nav nav-tabs"
						id="myTab"
						role="tablist">
						<li
							class="nav-item"
							role="presentation">
							<button
								class="nav-link active"
								id="home-tab"
								data-bs-toggle="tab"
								data-bs-target="#home-tab-pane"
								type="button"
								role="tab"
								aria-controls="home-tab-pane"
								aria-selected="true">
								Video
							</button>
						</li>
						<li
							class="nav-item"
							role="presentation">
							<button
								class="nav-link"
								id="profile-tab"
								data-bs-toggle="tab"
								data-bs-target="#profile-tab-pane"
								type="button"
								role="tab"
								aria-controls="profile-tab-pane"
								aria-selected="false">
								Audio
							</button>
						</li>
					</ul>
					<div
						class="tab-content"
						id="myTabContent">
						<div
							class="tab-pane fade show active"
							id="home-tab-pane"
							role="tabpanel"
							aria-labelledby="home-tab"
							tabindex="0">
							<table class="table table-bordered">
								<thead>
									<tr>
										<th scope="col">Resolution</th>
										<th scope="col">Size</th>
										<th scope="col">Download</th>
									</tr>
								</thead>
								<tbody>
									${resultVideo}
								</tbody>
							</table>
						</div>
						<div
							class="tab-pane fade"
							id="profile-tab-pane"
							role="tabpanel"
							aria-labelledby="profile-tab"
							tabindex="0">
							<table class="table table-bordered">
								<thead>
									<tr>
										<th scope="col">Resolution</th>
										<th scope="col">Size</th>
										<th scope="col">Download</th>
									</tr>
								</thead>
								<tbody>
									${resultAudio}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>

			`;
		return Toast.fire({
			icon: "success",
			title: "Success, your media is ready to be downloaded",
		});
	});
