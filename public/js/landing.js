// toggle
const navbar = document.querySelector(".navbar");
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");

document.querySelector("#hamburger-menu").onclick = () => {
	navbarNav.classList.toggle("active");
};

document.addEventListener("click", function (e) {
	if (
		!hamburger.contains(e.target) &&
		!navbar.contains(e.target) &&
		!navbarNav.contains(e.target)
	) {
		navbarNav.classList.remove("active");
	}
});

document.addEventListener("scroll", function (event) {
	if (window.scrollY == 0) {
		navbar.style.backgroundColor = `rgba(0, 0, 0, 0)`;
		navbar.style.borderBottom = `1px solid rgb(16, 245, 204, 0)`;
	} else if (window.scrollY < 900) {
		navbar.style.backgroundColor = `rgba(0, 0, 0, 0.${window.scrollY + 100})`;
		navbar.style.borderBottom = `1px solid rgb(16, 245, 204, 0.${
			window.scrollY + 100
		})`;
	} else {
		navbar.style.backgroundColor = `rgba(0, 0, 0)`;
	}
});
