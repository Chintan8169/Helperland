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

document.addEventListener("wheel", () => navMenu.classList.remove("open"));

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl, { sanitize: false }));

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

window.addEventListener("resize", () => {
	verticalNavbar.style.minHeight = `${window.innerHeight - document.querySelector("nav").clientHeight - document.querySelector("heading") - 60}px`;
});

for (let i = 0; i < 55; i++) {
	tbody.innerHTML += `<tr>

					<td class="serviceId" data-us-title="Service ID :">${Math.floor(Math.random() * 3000 * i)}</td>
					<td data-us-title="Service Date :">
								<div class="tdHead d-flex align-items-center justify-content-start">
									<img src="~/images/calender.png" />
									<h5>${new Date(i * 86400000).getDate()}/${new Date(i * 86400000).getMonth() + 1}/${new Date(i * 86400000).getFullYear()}</h5>
								</div>
								<div class="timing d-flex align-items-center justify-content-start">
									<img src="~/images/clock.png" />
									<div class="time">12:00 - 18:00</div>
								</div>
							</td>
							<td data-us-title="Customer Details :">
								<div class="custName text-md-nowrap text-sm-wrap">David Bough</div>
								<div class="custAddress d-flex text-md-nowrap text-sm-wrap align-items-center justify-content-start">
									<img src="~/images/addressIcon.png" />
									Musterstrabe 5,12345 Bonn
								</div>
							</td>
							<td class="text-start distance" data-us-title="Distance :">${Math.floor(Math.random() * i * 10)} km</td>
							<td data-us-title="Action :"><button class="rounded-pill position-relative d-flex align-items-center justify-content-center text-nowrap cancel" >Cancel</button></td>
						</tr>`;
}

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"kmNum-pre": function (a) {
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
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"serviceDate-pre": function (a) {
		const time = a
			.match(/<div class="time">.*<\/div>/)[0]
			.replace(`<div class="time">`, "")
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

const dt = new DataTable("#upcomingHistoryTable", {
	dom: "Blfrtip",
	responsive: false,
	pagingType: "full_numbers",
	language: {
		paginate: {
			first: "<img src='~/images/firstPage.png' alt='first' />",
			previous: "<img src='~/images/previous.png' alt='previous' />",
			next: '<img src="~/images/previous.png" alt="next" style="transform: rotate(180deg)" />',
			last: "<img src='~/images/firstPage.png' alt='first' style='transform: rotate(180deg)' />",
		},
		info: "Total Record: _MAX_",
		lengthMenu: "Show_MENU_Entries",
		emptyTable: "No Service Requests Found",
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
$(".tableHeader").insertBefore(".dt-buttons");

sortingButton.addEventListener("click", () =>
	document
		.querySelectorAll("input[name='sortingRadio']")
		.forEach((radioBtn) =>
			radioBtn.addEventListener("click", () => dt.order([radioBtn.getAttribute("data-st-col"), radioBtn.getAttribute("data-st-type")]).draw())
		)
);
