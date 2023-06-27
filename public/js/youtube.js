const urlInput = document.getElementById("link_url");
const base = document.getElementById("base");

async function start() {
	const url = urlInput.value;
	if (url.length == 0) return;
	base.innerHTML = `
    <img src="/img/loading.gif" style="max-width: 80px;">
  `;
	console.log(url);
	axios
		.post("/api/youtube", {
			body: {
				snapUri: url,
				privateKey: "snapsnapsnap",
			},
		})
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});
}

// result = res.data[0];
// console.log(result);
// let video = "";
// let sound = "";
// 			for (let i = 0; i < result.qualitymp4.length; i++) {
// 				console.log("dilakukan");
// 				video += `<tr>
//       <td>${result.qualitymp4[i]}</td>
//       <td>${result.sizemp4[i]}</td>
//       <td><a href="${result.linkmp4[i]}"><button type="button" class="btn btn-success">Download</button></a>
//       </td>
//   </tr>`;
// 			}
// 			for (let i = 0; i < result.qualitymp3.length; i++) {
// 				console.log("dilakukan");
// 				sound += `<tr>
//     <td>${result.qualitymp3[i]}</td>
//     <td>${result.sizemp3[i]}</td>
//     <td><a href="${result.linkmp3[i]}"><button type="button" class="btn btn-success">Download</button></a>
//     </td>
// </tr>`;
// 			}
// 			isi = `
//   <div class="row gap-3" style="min-width: 900px">
//   <div class="col">
//     <div>
//       <div class="card" style="width: 18rem;">
//     <img src="${result.thumb}" class="card-img-top" alt="...">
//     <div class="card-body">
//       <div class="flex flex-row m-1" bis_skin_checked="1">
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" stroke="currentColor">
//         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
//         </svg>
//         <span class="mx-2 text-sm font-semibold">${result.views} Views</span>
//       </div>
//       <h5 class="card-title">${result.title}</h5>
//     </div>
//     </div>
//     </div>
//   </div>
//   <div class="col">
//   <h5>Video</h5>
//   <table class="table">
//   <thead>
//     <tr>
//       <th scope="col">Resolution</th>
//       <th scope="col">Size</th>
//       <th scope="col">Download</th>
//     </tr>
//   </thead>
//   <tbody>
//     ${video}
//   </tbody>
// </table><br>
// <h5>Sound</h5>
// <table class="table">
// <thead>
//   <tr>
//     <th scope="col">Resolution</th>
//     <th scope="col">Size</th>
//     <th scope="col">Download</th>
//   </tr>
// </thead>
// <tbody>
//   ${sound}
// </tbody>
// </table>
//   </div>
// </div>
//   `;
// return (document.getElementById("base").innerHTML = result);
