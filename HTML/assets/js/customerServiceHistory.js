const tbody = document.querySelector("tbody");
const verticalNavbar = document.querySelector(".verticalNavbar");
const serviceHistoryTableContainer = document.querySelector(".serviceHistoryTableContainer");
const navMenu = document.querySelector(".fullPage");
const fullPageHidden = document.querySelector(".fullPageHidden");
const sortingButton = document.querySelector(".sortingButton");
const navbarHamburger = document.querySelector(".navSm .hamburger");

verticalNavbar.style.minHeight = `${window.innerHeight - document.querySelector("nav").clientHeight - document.querySelector("heading") - 60}px`;

navbarHamburger.addEventListener("click", () => navMenu.classList.add("open"));
fullPageHidden.addEventListener("click", () => navMenu.classList.remove("open"));

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl, { sanitize: false }));

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

const names = [
	"iam Olivia",
	"oah Emma",
	"liver Ava",
	"lijah Charlotte",
	"illiam Sophia",
	"ames Amelia",
	"enjamin Isabella",
	"ucas Mia",
	"enry Evelyn",
	"Alexander Harper",
	"Mason Camila",
	"Michael Gianna",
	"Ethan Abigail",
	"Daniel Luna",
	"Jacob Ella",
	"Logan Elizabeth",
	"Jackson Sofia",
	"Levi Emily",
	"Sebastian Avery",
	"Mateo Mila",
	"Jack Scarlett",
	"Owen Eleanor",
	"Theodore Madison",
	"Aiden Layla",
	"Samuel Penelope",
	"Joseph Aria",
	"John Chloe",
	"David Grace",
	"Wyatt Ellie",
	"Matthew Nora",
	"Luke Hazel",
	"Asher Zoey",
	"Carter Riley",
	"Julian Victoria",
	"Grayson Lily",
	"Leo Aurora",
	"Jayden Violet",
	"Gabriel Nova",
	"Isaac Hannah",
	"Lincoln Emilia",
	"Anthony Zoe",
	"Hudson Stella",
	"Dylan Everly",
	"Ezra Isla",
	"Thomas Leah",
	"Charles Lillian",
	"Christopher Addison",
	"Jaxon Willow",
	"Maverick Lucy",
	"Josiah Paisley",
	"Isaiah Natalie",
	"Andrew Naomi",
	"Elias Eliana",
	"Joshua Brooklyn",
	"Nathan Elena",
];

window.addEventListener("resize", () => {
	verticalNavbar.style.minHeight = `${window.innerHeight - document.querySelector("nav").clientHeight - document.querySelector("heading") - 60}px`;
});

for (let i = 0; i < 55; i++) {
	tbody.innerHTML += `<tr>
					<td data-us-title="Service Details :">
								<div class="tdHead d-flex align-items-center justify-content-start">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
										<path
											fill-rule="evenodd"
											fill="#646464"
											d="M.365 16.9V1.715H3.32V.9h1.478v.815h2.463V.9h1.477v.815h2.463V.9h1.477v.815h2.955V16.9H.365zM14.156 5.165H1.843v9.365h12.313V5.165zM5.783 9.108H4.305V7.63h1.478v1.478zm0 3.542H4.305v-2.063h1.478v2.063zm2.955-3.542H7.261V7.63h1.477v1.478zm0 3.542H7.261v-2.063h1.477v2.063zm2.955-3.542h-1.477V7.63h1.477v1.478zm0 3.542h-1.477v-2.063h1.477v2.063z"
										/>
									</svg>
									<h5>${new Date(i * 86400000).getDate()}/${new Date(i * 86400000).getMonth() + 1}/${new Date(i * 86400000).getFullYear()}</h5>
								</div>
								<div class="timing">12:00 - 18:00</div>
							</td>
							<td data-us-title="Service Provider :">
								<div class="serviceProvider d-flex align-items-center justify-content-start">
									<img class="rounded-circle" src="assets/images/serviceProviderProfileImage.svg" />
									<div class="serviceProviderInfo">
										<div class="serviceProviderName">${names[i]}</div>
										<div class="feedback d-flex align-items-center justify-content-start">
											<img src="assets/images/starFilled.svg" /><img src="assets/images/starFilled.svg" /><img
												src="assets/images/starFilled.svg"
											/><img src="assets/images/starFilled.svg" /><img src="assets/images/starUnfilled.svg" />4
										</div>
									</div>
								</div>
							</td>
							<td data-us-title="Payment :"><span class="paymentAmount "><span class="paymentSign">€</span>${Math.floor((i + 1) * Math.random() * 20)}</span></td>
							<td data-us-title="Status :"><span class='status ${Math.random() > 0.5 ? "cancelled'>Cancelled" : "completed'>Completed"}</span></td>
							<td data-us-title="Rate Service Provider :"><button class="rate position-relative d-flex align-items-center justify-content-center rounded-pill text-nowrap">Rate SP</button></td>
						</tr>`;
}

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"serviceDate-pre": function (a) {
		const time = a
			.match(/<div class="timing">.*<\/div>/)[0]
			.replace(`<div class="timing">`, "")
			.replace("</div>", "");
		a = a
			.match(/<h5>.*<\/h5>/)[0]
			.replace("<h5>", "")
			.replace("</h5>", "");
		let d = a.split("/");
		let day = d[0].length === 1 ? `0${d[0]}` : d[0];
		let month = d[1].length === 1 ? `0${d[1]}` : d[1];
		let year = d[2].length === 1 ? `0${d[2]}` : d[2];
		a = `${month}/${day}/${year}`;
		return a.toString();
	},
	"serviceDate-asc": function (a, b) {
		const dateA = new Date(a);
		const dateB = new Date(b);
		return dateA < dateB;
	},
	"serviceDate-desc": function (a, b) {
		const dateA = new Date(a);
		const dateB = new Date(b);
		return dateB > dateA;
	},
});

const dt = new DataTable("#serviceHistoryTable", {
	dom: "Blfrtip",
	responsive: false,
	pagingType: "full_numbers",
	language: {
		paginate: {
			first: "<img src='assets/images/firstPage.png' alt='first' />",
			previous: "<img src='assets/images/previous.png' alt='previous' />",
			next: '<img src="assets/images/previous.png" alt="next" style="transform: rotate(180deg)" />',
			last: "<img src='assets/images/firstPage.png' alt='first' style='transform: rotate(180deg)' />",
		},
		info: "Total Record: _MAX_",
		lengthMenu: "Show_MENU_Entries",
	},
	buttons: ["excel"],
	columnDefs: [
		{ orderable: false, targets: 4 },
		{ type: "serviceDate", targets: 0 },
	],
});
let dataTables_length = document.querySelector(".dataTables_length");
$(".dataTables_length").insertAfter(".dataTable");
$(".tableHeader").insertAfter(".dt-buttons");

sortingButton.addEventListener("click", () =>
	document
		.querySelectorAll("input[name='sortingRadio']")
		.forEach((radioBtn) =>
			radioBtn.addEventListener("click", () => dt.order([radioBtn.getAttribute("data-st-col"), radioBtn.getAttribute("data-st-type")]).draw())
		)
);
