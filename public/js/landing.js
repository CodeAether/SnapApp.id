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

// count effect
// Function to handle the counting effect
function startCountingAnimation(data, endValue) {
	let startValue = 0;
	data.textContent = 0;
	let interval = 16;
	let increment = Math.ceil(endValue / (2000 / interval));
	let counter = setInterval(function () {
		startValue += increment;
		if (startValue >= endValue) {
			startValue = endValue;
			clearInterval(counter);
		}
		data.textContent = startValue;
	}, interval);
}

// Intersection Observer options
const observerOptions = {
	root: null,
	rootMargin: "0px",
	threshold: 0.5,
};

// Create an Intersection Observer instance
const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const numberDataElements = entry.target.querySelectorAll(".number-data");
			numberDataElements.forEach((numberData) => {
				const endValue = parseInt(numberData.getAttribute("number"));
				if (endValue === 0) return (numberData.textContent = 0);
				startCountingAnimation(numberData, endValue);
			});
			observer.unobserve(entry.target);
		}
	});
}, observerOptions);

// Observe the section-two element
const sectionTwo = document.querySelector(".section-two");
observer.observe(sectionTwo);
