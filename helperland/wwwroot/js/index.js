const nav = document.querySelectorAll("nav");
const scrollDownBtn = document.querySelector(".scrollDown");
const topScroll = document.querySelector("#topScroll");
const scrollToTop = document.querySelector("#scrollToTop");
const cookieAgree = document.querySelector(".cookieAgree");
const cookieConsent = document.querySelector(".cookieConsent");
const backgroundImage = document.querySelector(".backgroundImage");
const topCrousel = document.querySelector(".topCrousel");
let loginModal;
const rellax = new Rellax(".rellax");

if (document.querySelector("#loginModal")) {
	loginModal = new bootstrap.Modal(document.querySelector("#loginModal"));
}

const vanila = VanillaTilt.init(document.querySelector(".threeImages"), {
	max: 25,
	speed: 400,
	glare: false,
	reverse: true,
	gyroscope: true,
});
AOS.init();
let cookies = document.cookie;
if (cookies.includes("isLoginModalOpen=true")) {
	if (loginModal) loginModal.show();
	document.cookie = "isLoginModalOpen=false";
}

if (window.scrollY > 130) {
	nav.forEach((n) => {
		n.classList.add("bg-grey");
	});
	scrollToTop.classList.remove("hidden");
}

$(".cookieConsent").insertAfter($("footer"));

window.addEventListener("scroll", () => {
	if (window.scrollY > 130) {
		nav.forEach((n) => {
			n.classList.add("bg-grey");
		});
		scrollToTop.classList.remove("hidden");
	} else {
		nav.forEach((n) => {
			n.classList.remove("bg-grey");
		});
		scrollToTop.classList.add("hidden");
	}
	if (window.scrollY + window.innerHeight >= document.body.clientHeight - 200 || window.scrollY < 100) {
		cookieConsent.classList.add("atBottom");
	} else {
		cookieConsent.classList.remove("atBottom");
	}
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
