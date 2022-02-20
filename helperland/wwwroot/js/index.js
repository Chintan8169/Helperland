const nav = document.querySelectorAll("nav");
const scrollDownBtn = document.querySelector(".scrollDown");
const topScroll = document.querySelector("#topScroll");
const scrollToTop = document.querySelector("#scrollToTop");
const cookieAgree = document.querySelector(".cookieAgree");
const cookieConsent = document.querySelector(".cookieConsent");
const backgroundImage = document.querySelector(".backgroundImage");
const topCrousel = document.querySelector(".topCrousel");
const successModal = new bootstrap.Modal(document.querySelector("#successModal"));
const errorModal = new bootstrap.Modal(document.querySelector("#errorModal"));
const loginModalForm = document.querySelector("form.loginModalForm");
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
let cookiesString = document.cookie;
let cookiesArr = cookiesString.split(";");
let cookies = [];
if (cookiesArr.length > 0) {
	cookiesArr.forEach((coo) => {
		cookies.push({ key: decodeURI(coo.split("=")[0].trim()), value: decodeURI(coo.split("=")[1].trim()) });
	});
	const loginIndex = cookies.findIndex((c) => c.key === "isLoginModalOpen");
	if (loginIndex >= 0 && cookies[loginIndex].value === "true") {
		if (loginModal) loginModal.show();
		document.cookie = "isLoginModalOpen=false; path=/";
	}
	const successIndex = cookies.findIndex((c) => c.key === "isSuccessModalOpen");
	if (successIndex >= 0 && cookies[successIndex].value === "true") {
		successModal.show();
		document.querySelector("#successModalLabel").innerHTML = cookies[cookies.findIndex((c) => c.key === "isSuccessModalContent")].value;
		document.cookie = "isSuccessModalOpen=false; path=/";
	}
	const errorIndex = cookies.findIndex((c) => c.key === "isErrorModalOpen");
	if (errorIndex >= 0 && cookies[errorIndex].value === "true") {
		errorModal.show();
		document.querySelector("#errorModalLabel").innerHTML = cookies[cookies.findIndex((c) => c.key === "errorModalContent")].value;
		document.cookie = "isErrorModalOpen=false; path=/";
	}
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

if (loginModalForm) {
	const submitBtn = loginModalForm.querySelector("button");
	const errorAlertEle = document.querySelector(".errorAlert");
	const errorAlertMessage = errorAlertEle.querySelector(".errorMessage");
	const errorAlert = new bootstrap.Alert(errorAlertEle);
	submitBtn.addEventListener("click", async (e) => {
		e.preventDefault();
		setTimeout(async () => {
			const validatedForm = $("form.loginModalForm").validate();
			const errorListLength = validatedForm.errorList.length;
			if (errorListLength <= 0) {
				document.querySelector("body").classList.add("loading");
				const data = new FormData(loginModalForm);
				const obj = {};
				obj.Email = data.get("Email");
				obj.Password = data.get("Password");
				obj.RememberMe = data.get("RememberMe") == "true" ? true : false;
				const response = await fetch("/Account/Login", {
					method: "POST",
					body: JSON.stringify(obj),
					headers: {
						"Content-Type": "application/json",
					},
				});
				const jsonRes = await response.json();
				document.querySelector("body").classList.remove("loading");
				if (jsonRes.error) {
					errorAlertMessage.innerHTML = jsonRes.error;
					errorAlertEle.classList.remove("d-none");
					errorAlertEle.classList.add("show");
					setTimeout(() => {
						errorAlertEle.classList.remove("show");
						errorAlertEle.classList.add("d-none");
					}, 5000);
				} else if (jsonRes.success) {
					const paramsSplit = document.location.search.replace("?", "").split("&");
					if (paramsSplit.length > 0) {
						const params = [];
						paramsSplit.forEach((p) => {
							params.push({ key: p.split("=")[0], value: p.split("=")[1] });
						});
						const ReturnUrl = params.find((par) => (par.key = "ReturnUrl"));
						if (ReturnUrl && ReturnUrl.value) return (window.location.href = decodeURIComponent(ReturnUrl.value));
					}
					if (jsonRes.userType == "Customer") return (window.location.href = "/Customer/Index");
					else if (jsonRes.userType == "ServiceProvider") return (window.location.href = "/ServiceProvider/Index");
					else return (window.location.href = "/Admin/Index");
				}
			}
		}, 250);
	});
	loginModalForm.addEventListener("submit", (e) => {
		e.preventDefault();
		submitBtn.click();
	});
}
