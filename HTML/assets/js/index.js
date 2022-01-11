const nav = document.querySelector("nav");
const scrollDownBtn = document.querySelector(".scrollDown");
const topScroll = document.querySelector("#topScroll");
const scrollToTop = document.querySelector("#scrollToTop");
const cookieAgree = document.querySelector(".cookieAgree");
const cookieConsent = document.querySelector(".cookieConsent");
const hamburger = document.querySelector(".hamburger");
const backgroundImage = document.querySelector(".backgroundImage");
const topCrousel = document.querySelector(".topCrousel");
const navMenu = document.querySelector(".navMenu");
const loginModal = new bootstrap.Modal(document.querySelector("#loginModal"));
const rellax = new Rellax(".rellax");

const vanila = VanillaTilt.init(document.querySelector(".threeImages"), {
	max: 25,
	speed: 400,
	glare: false,
	reverse: true,
	gyroscope: true,
});
let cookies = document.cookie;
if (cookies.includes("isLoginModalOpen=true")) {
	loginModal.show();
	document.cookie = "isLoginModalOpen=false";
}

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

window.addEventListener("scroll", () => {
	if (window.scrollY > 130) {
		nav.classList.add("bg-grey");
		scrollToTop.classList.remove("hidden");
		navMenu.style.marginTop = "27.5px";
	} else {
		nav.classList.remove("bg-grey");
		scrollToTop.classList.add("hidden");
		navMenu.style.marginTop = "55px";
	}
	if (window.scrollY + window.innerHeight >= document.body.clientHeight - 100 || window.scrollY === 0) {
		cookieConsent.classList.add("atBottom");
	} else {
		cookieConsent.classList.remove("atBottom");
	}
});

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("open");
	navMenu.classList.toggle("open");
});

cookieAgree.addEventListener("click", () => {
	cookieConsent.classList.add("hidden");
	setTimeout(() => {
		cookieConsent.style.height = "0";
	}, 500);
});

scrollDownBtn.addEventListener("click", () => {
	scrollDownBtn.scrollIntoView();
});

scrollToTop.addEventListener("click", () => window.scroll(0, 0));
