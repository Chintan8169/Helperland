const nav = document.querySelector("nav");
const scrollDownBtn = document.querySelector(".scrollDown");
const topScroll = document.querySelector("#topScroll");
const scrollToTop = document.querySelector("#scrollToTop");
const cookieAgree = document.querySelector(".cookieAgree");
const cookieConsent = document.querySelector(".cookieConsent");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".navMenu");

window.addEventListener("scroll", () => {
	if (window.scrollY > 130) {
		nav.classList.add("bg-black");
		scrollToTop.classList.remove("hidden");
	} else {
		nav.classList.remove("bg-black");
		scrollToTop.classList.add("hidden");
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
