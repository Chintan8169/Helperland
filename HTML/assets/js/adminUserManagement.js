const toDateOutput = document.querySelector("#toDateOutput");
const fromDateOutput = document.querySelector("#fromDateOutput");
const fromDate = document.querySelector("#fromDate");
const hamburger = document.querySelector(".hamburger");
const halfPage = document.querySelector(".halfPage");
const verticleMenu = document.querySelector(".verticleMenu");
const toDate = document.querySelector("#toDate");
const tbody = document.querySelector("tbody");

hamburger.addEventListener("click", () => {
	[verticleMenu, hamburger].forEach((ele) => ele.classList.toggle("open"));
});
halfPage.addEventListener("click", () => {
	[verticleMenu, hamburger].forEach((ele) => ele.classList.remove("open"));
});

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
	let x = Math.floor(Math.random() * 40);
	let status;
	if (x <= 10 && x >= 0) {
		status = "cancelled";
	} else if (x <= 20 && x > 10) {
		status = "completed";
	} else if (x <= 30 && x > 20) {
		status = "new";
	} else if (x <= 40 && x > 30) {
		status = "pending";
	}
	let popoverContent = "";
	if (status === "pending") {
		popoverContent = `<a href='#' class='custPopoverAnch'>Edit & Reschedule</a><a href='#' class='custPopoverAnch'>Refund</a><a href='#' class='custPopoverAnch'>Cancel</a><a href='#' class='custPopoverAnch'>Change SP</a><a href='#' class='custPopoverAnch'>Escalate</a><a href='#' class='custPopoverAnch'>History Log</a><a href='#' class='custPopoverAnch'>Download Invoice</a>`;
	} else if (status === "completed") {
		popoverContent = `<a href='#' class='custPopoverAnch'>Refund</a><a href='#' class='custPopoverAnch'>Escalate</a><a href='#' class='custPopoverAnch'>History Log</a><a href='#' class='custPopoverAnch'>Download Invoice</a>`;
	}
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
						<div class="custName text-md-nowrap text-sm-wrap">${names[54 - i]}</div>
						<div class="custAddress d-flex text-md-nowrap text-sm-wrap align-items-center justify-content-start">
							<img src="assets/images/addressIcon.png" />
							Musterstrabe 5,12345 Bonn
						</div>
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
					<td class="text-center"><span class='status ${status}'>${status}</span></td>
					<td class="actionTd">
						<div 
						class="action rounded-circle d-flex flex-column align-items-center justify-content-center position-relative" 
						${
							popoverContent !== ""
								? 'data-bs-toggle="popover" data-bs-offset="-30,10" data-bs-placement="bottom" data-bs-content="' +
								  popoverContent +
								  '" data-bs-html="true"'
								: ""
						}
						>
							<div class="dot rounded-circle"></div>
							<div class="dot rounded-circle"></div>
							<div class="dot rounded-circle"></div>
						</div>
					</td>
				</tr>`;
}

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));

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

const dt = new DataTable("#adminUserManagementTable", {
	dom: "Rtlp",
	responsive: false,
	pagingType: "simple_numbers",
	language: {
		paginate: {
			previous: "<img src='assets/images/adminNextPreviousButton.svg' alt='previous' />",
			next: '<img src="assets/images/adminNextPreviousButton.svg" alt="next" style="transform: rotate(180deg)" />',
		},
		info: "Total Record: _MAX_",
		lengthMenu: "Show_MENU_Entries",
	},
	columnDefs: [
		{ orderable: false, targets: 5 },
		// { type: "kmNum", targets: 3 },
		{ type: "serviceDate", targets: 1 },
	],
});

$("#fromDate").datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true,
});
$("#toDate").datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true,
});
fromDate.addEventListener("focusout", () => {
	setTimeout(() => {
		if (fromDate.value) fromDateOutput.innerHTML = fromDate.value;
	}, 500);
});
toDate.addEventListener("focusout", () => {
	setTimeout(() => {
		if (toDate.value) toDateOutput.innerHTML = toDate.value;
	}, 500);
});
