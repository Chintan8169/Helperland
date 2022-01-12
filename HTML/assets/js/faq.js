const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".navMenu");
const forCustomer = document.querySelector(".forCustomer");
const loginBtn = document.querySelector(".loginBtn");
const forServiceProvider = document.querySelector(".forServiceProvider");
const accordion = document.querySelector(".accordion");
const faqToggleBtn = document.querySelectorAll(".faqToggleBtn");

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

loginBtn.addEventListener("click", () => {
	document.cookie = "isLoginModalOpen=true";
	document.location.href = "index.html";
});

const faqForCustomer = [
	{ question: "What's included in a cleaning?", answer: "Bedroom, Living Room & Common Areas, Bathrooms, Kitchen, Extras" },

	{
		question: "Which Helperland professional will come to my place?",
		answer: "Helperland has a vast network of experienced, top-rated cleaners. Based on the time and date of your request, we work to assign the best professional available. Like working with a specific pro? Add them to your Pro Team from the mobile app and they'll be requested first for all future bookings. You will receive an email with details about your professional prior to your appointment.",
	},

	{
		question: "Can I skip or reschedule bookings?",
		answer: "You can reschedule any booking for free at least 24 hours in advance of the scheduled start time. If you need to skip a booking within the minimum commitment, we’ll credit the value of the booking to your account. You can use this credit on future cleanings and other Helperland services.",
	},

	{
		question: "Do I need to be home for the booking?",
		answer: "We strongly recommend that you are home for the first clean of your booking to show your cleaner around. Some customers choose to give a spare key to their cleaner, but this decision is based on individual preferences.",
	},
];

const faqForSP = [
	{
		question: "How much do service providers earn?",
		answer: "The self-employed service providers working with Helperland set their own payouts, this means that they decide how much they earn per hour.",
	},
	{
		question: "What support do you provide to the service providers?",
		answer: "Our call-centre is available to assist the service providers with all queries or issues in regards to their bookings during office hours. Before a service provider starts receiving jobs, every individual partner receives an orientation session to familiarise with the online platform and their profile.",
	},
];

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("open");
	navMenu.classList.toggle("open");
});

const fetchFaqs = (forWhose) => {
	const tempFaq = forWhose === "customer" ? faqForCustomer : faqForSP;
	accordion.innerHTML = "";
	tempFaq.forEach((faq, i) => {
		accordion.innerHTML += `
		<div class="accordion-item">
			<div class="accordion-header" id="faq${i}">
				<div
					class="accordion-btn collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#collapse${i}"
					aria-expanded="false"
					aria-controls="collapse${i}"
				>
					<img src="assets/images/vector-smart-object-copy.png" alt="expandImage" />
					<span class="question">${faq.question}</span>
				</div>
			</div>
			<div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="faq${i}" data-bs-parent="#faqAccordion">
				<div class="accordion-body">${faq.answer}</div>
			</div>
		</div>`;
	});
};

window.addEventListener("load", () => {
	fetchFaqs(faqToggleBtn[0].getAttribute("data-faq-for"));
});

faqToggleBtn.forEach((btn) => {
	btn.addEventListener("click", () => {
		document.querySelector(".whoseFor .active").classList.remove("active");
		btn.classList.add("active");
		fetchFaqs(btn.getAttribute("data-faq-for"));
	});
});
