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

for (let i = 0; i < 55; i++) {
	tbody.innerHTML += `<tr>

					<td class="serviceId">${Math.floor(Math.random() * 3000 * i)}</td>
					<td>
								<div class="tdHead d-flex align-items-center justify-content-start">
									<img src="assets/images/calender.png" />
									<h5>${new Date(i * 86400000).getDate()}/${new Date(i * 86400000).getMonth() + 1}/${new Date(i * 86400000).getFullYear()}</h5>
								</div>
								<div class="timing d-flex align-items-center justify-content-start">
									<img src="assets/images/clock.png" />
									<div class="time">12:00 - 18:00</div>
								</div>
							</td>
							<td>
								<div class="custName text-md-nowrap text-sm-wrap">David Bough</div>
								<div class="custAddress d-flex text-md-nowrap text-sm-wrap align-items-center justify-content-start">
									<img src="assets/images/addressIcon.png" />
									Musterstrabe 5,12345 Bonn
								</div>
							</td>
							<td class="text-start distance">${Math.floor(Math.random() * i * 10)} km</td>
							<td><button class="rounded-pill text-nowrap cancel">Cancel</button></td>
						</tr>`;
}

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"kmNum-pre": function (a) {
		console.log(a);
		a = a.replace(" km", "");
		return parseInt(a);
	},
	"kmNum-asc": function (a, b) {
		return a - b;
	},
	"kmNum-desc": function (a, b) {
		return b - a;
	},
});
// jQuery.extend(jQuery.fn.dataTableExt.oSort, {
// 	"serviceDate-pre": function (a) {
// 		a = a
// 			.match(/<h5>.*<\/h5>/)[0]
// 			.replace("<h5>", "")
// 			.replace("</h5>", "");
//
// const time = a
// 	.match(/<div class="time">.*<\/div>/)[0]
// 	.replace(`<div class="time">`, "")
// 		console.log(new Date(a.split("/")[2], a.split("/")[1] - 1, a.split("/")[0]).getTime());
// 	.replace("</div>", "");
// 		return a.toString();
// 	},
// 	"serviceDate-asc": function (a, b) {
// 		const dateA = new Date(a.split("/")[2], a.split("/")[1] - 1, a.split("/")[0]).getTime();
// 		const dateB = new Date(b.split("/")[2], b.split("/")[1] - 1, b.split("/")[0]).getTime();
// 		return dateA > dateB;
// 	},
// 	"serviceDate-desc": function (a, b) {
// 		const dateA = new Date(a.split("/")[2], a.split("/")[1] - 1, a.split("/")[0]).getTime();
// 		const dateB = new Date(b.split("/")[2], b.split("/")[1] - 1, b.split("/")[0]).getTime();
// 		return dateA < dateB;
// 	},
// });

const dt = new DataTable("#upcomingHistoryTable", {
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
	columnDefs: [
		{ orderable: false, targets: 4 },
		{ type: "kmNum", targets: 3 },
		{ type: "serviceDate", targets: 1 },
	],
});

let dataTables_length = document.querySelector(".dataTables_length");
$(".dataTables_length").insertAfter(".dataTable");
$(".tableHeader").insertAfter(".dt-buttons");
