const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".navMenu");
const forCustomer = document.querySelector(".forCustomer");
const loginBtn = document.querySelector(".loginBtn");
const forServiceProvider = document.querySelector(".forServiceProvider");
const accordion = document.querySelector(".accordion");

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

loginBtn.addEventListener("click", () => {
	document.cookie = "isLoginModalOpen=true";
	document.location.href = "index.html";
});

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("open");
	navMenu.classList.toggle("open");
});
window.addEventListener("load", () => {
	fetchFaqs("forCustomer");
});
const fetchFaqs = (forWhose) => {
	accordion.innerHTML = "";
	for (let i = 0; i < 9; i++) {
		// Fetch API call [TODO]
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
							<span class="question">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nisl nunc, iaculis mattis tellus ac ut non
								imperdiet velit?
							</span>
						</div>
					</div>
					<div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="faq${i}" data-bs-parent="#faqAccordion">
						<div class="accordion-body">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id diam tincidunt, fringilla ante vitae, dapibus velit.
							Vivamus id tortor rhoncus, efficitur quam at, suscipit tortor. Integer fermentum convallis eros vel semper. Ut non
							imperdiet velit. Praesent eu dui vel lacus porta eleifend eget quis dui. Integer tempus massa in gravida tincidunt. Fusce
							in libero tristique, euismod nisi vel, luctus urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec et
							placerat arcu. Suspendisse lacinia tristique massa. Etiam risus justo, scelerisque id arcu eu, sodales tempor eros.
							Aliquam efficitur pretium urna, sit amet congue risus malesuada rutrum. Donec id massa vel velit ullamcorper accumsan ut
							eget nisl. Fusce viverra commodo lacus, sit amet facilisis leo luctus dictum.
						</div>
					</div>
				</div>`;
	}
};

forCustomer.addEventListener("click", () => {
	forServiceProvider.classList.remove("active");
	forCustomer.classList.add("active");
	fetchFaqs("forCustomer");
});
forServiceProvider.addEventListener("click", () => {
	forServiceProvider.classList.add("active");
	forCustomer.classList.remove("active");
	fetchFaqs("forServiceProvider");
});
