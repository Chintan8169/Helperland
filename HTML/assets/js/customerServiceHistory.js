const tbody = document.querySelector("tbody");
const verticalNavbar = document.querySelector(".verticalNavbar");
const serviceHistoryTableContainer = document.querySelector(".serviceHistoryTableContainer");
const verticalNavbarHamburger = document.querySelector(".verticalNavbar .hamburger");
const navMenu = document.querySelector(".navMenu");
const navbarHamburger = document.querySelector(".loggedInMenu .hamburger");

verticalNavbar.style.height = `${window.innerHeight - document.querySelector("nav").clientHeight - document.querySelector("heading") - 60}px`;

verticalNavbarHamburger.addEventListener("click", () => verticalNavbar.classList.toggle("open"));
navbarHamburger.addEventListener("click", () => navMenu.classList.toggle("open"));

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));

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

for (let i = 0; i < 55; i++) {
	tbody.innerHTML += `<tr>
					<td>
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
							<td>
								<div class="serviceProvider d-flex align-items-center justify-content-start">
									<img class="rounded-circle" src="assets/images/serviceProviderProfileImage.svg" />
									<div class="serviceProviderInfo">
										<div class="serviceProviderName">${names[i]}</div>
										<div class="feedback d-flex align-items-center justify-content-center">
											<img src="assets/images/starFilled.svg" /><img src="assets/images/starFilled.svg" /><img
												src="assets/images/starFilled.svg"
											/><img src="assets/images/starFilled.svg" /><img src="assets/images/starUnfilled.svg" />4
										</div>
									</div>
								</div>
							</td>
							<td><span class="paymentAmount d-xs-inline-block d-sm-block text-center"><span class="paymentSign">€</span>${Math.floor(
								(i + 1) * Math.random() * 20
							)}</span></td>
							<td class="text-center"><span class='status ${Math.random() > 0.5 ? "cancelled'>Cancelled" : "completed'>Completed"}</span></td>
							<td><button class="rate rounded-pill text-nowrap">Rate SP</button></td>
						</tr>`;
}

const dt = new DataTable("#serviceHistoryTable", {
	dom: "Blfrtip",
	responsive: true,
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
	columnDefs: [{ orderable: false, targets: 4 }],
});
let dataTables_length = document.querySelector(".dataTables_length");
$(".dataTables_length").insertAfter(".dataTable");
$(".tableHeader").insertAfter(".dt-buttons");
