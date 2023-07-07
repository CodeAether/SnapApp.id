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

// section 3
var $cont = document.querySelector('.cont');
var $elsArr = [].slice.call(document.querySelectorAll('.el'));
var $closeBtnArr = [].slice.call(document.querySelectorAll('.el__close-btn'));

setTimeout(function() {
	$cont.classList.remove('s--inactive');
}, 200);

$elsArr.forEach( function($el) {
	$el.addEventListener('click', function() {
		if (this.classList.contains('s--active')) 
		return;
		$cont.classList.add('s--el-active');
		this.classList.add('s--active');
	});
});

$closeBtnArr.forEach(function($btn) {
	$btn.addEventListener('click', function(e) {
		e.stopPropagation();
		$cont.classList.remove('s--el-active');
		document.querySelector('.el.s-active').classList.remove('s--active');
	});
});