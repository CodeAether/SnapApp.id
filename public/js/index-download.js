document.getElementById("paste").addEventListener("click", function (a) {
	a = document.getElementById("paste");
	var c = document.getElementById("link_url");
	'<i class="material-icons prefix right">delete</i>' === a.innerHTML
		? ((c.value = ""),
		  (a.innerHTML =
				'<i class="material-icons prefix right">content_paste</i>'),
		  $("label[for='link_url']").removeClass("active"))
		: navigator.clipboard.readText().then(
				function (f) {
					return (c.value = f);
				},
				(a.innerHTML = '<i class="material-icons prefix right">delete</i>'),
				$("label[for='link_url']").addClass("active")
		  );
});
