const toDateOutput = document.querySelector("#toDateOutput");
const fromDateOutput = document.querySelector("#fromDateOutput");
const fromDate = document.querySelector("#fromDate");
const hamburger = document.querySelector(".hamburger");
const halfPage = document.querySelector(".halfPage");
const verticleMenu = document.querySelector(".verticleMenu");
const toDate = document.querySelector("#toDate");
const sortingButton = document.querySelector(".sortingButton");
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

const poc = [
	"3040051",
	"3041563",
	"290594",
	"291074",
	"291696",
	"292223",
	"292231",
	"292239",
	"292672",
	"292688",
	"292878",
	"292913",
	"292932",
	"292953",
	"292968",
	"1120985",
	"1123004",
	"1125155",
	"1125444",
	"1125896",
	"1127110",
	"1127628",
	"1127768",
	"1128265",
	"1129516",
	"1129648",
	"1130490",
	"1131316",
	"1132495",
	"1133453",
	"1133574",
	"1133616",
	"1134720",
	"1135158",
	"1135689",
	"1136469",
	"1136575",
	"1136863",
	"1137168",
	"1137807",
	"1138336",
	"1138958",
	"1139715",
	"1139807",
	"1140026",
	"1141089",
	"1141269",
	"1141540",
	"1141857",
	"1142170",
];

const cities = [
	"les Escaldes",
	"Andorra la Vella",
	"Umm al Qaywayn",
	"Ras alKhaimah",
	"Khawr FakkÄn",
	"Dubai",
	"Dibba AlFujairah",
	"Dibba AlHisn",
	"Sharjah",
	"Ar Ruways",
	"Al Fujayrah",
	"Al Ain",
	"Ajman",
	"Adh Dhayd",
	"Abu Dhabi",
	"Zaranj",
	"Taloqan",
	"ShÄ«ná¸aná¸",
	"ShibirghÄn",
	"Shahrak",
	"Sare Pul",
	"Sange ChÄrak",
	"AÄ«bak",
	"RustÄq",
	"QarqÄ«n",
	"QarÄwul",
	"Pule KhumrÄ«",
	"PaghmÄn",
	"NahrÄ«n",
	"Maymana",
	"Mehtar LÄm",
	"MazÄre SharÄ«f",
	"Lashkar GÄh",
	"Kushk",
	"Kunduz",
	"KhÅst",
	"Khulm",
	"KhÄsh",
	"Khanabad",
	"Karukh",
	"KandahÄr",
	"Kabul",
	"JalÄlÄbÄd",
	"Jabal os Saraj",
	"HerÄt",
	"Ghormach",
	"Ghazni",
	"Gereshk",
	"GardÄ“z",
	"Fayzabad",
];

const userType = ["Call Center", "Customer", "Service Provider"];
const role = ["Inquiry Manager", "Content Manager", "Finance Manager"];

for (let i = 0; i < 50; i++) {
	const ut = userType[Math.floor(Math.random() * userType.length)];
	const r = ut === "Call Center" ? role[Math.floor(Math.random() * role.length)] : "No Role";
	const status = Math.random() < 0.5 ? "active" : "inactive";
	const radius = ut === "Service Provider" ? `${Math.floor(Math.random() * 100)} km` : "No Data";
	let popoverContent = "";
	if ((ut === "Service Provider" || ut === "Customer") && status === "active") {
		popoverContent = `<a href='#' class='custPopoverAnch'>Edit</a><a href='#' class='custPopoverAnch'>Deactivate</a><a href='#' class='custPopoverAnch'>Service History</a>`;
	} else if (ut === "Call Center" && status === "active") {
		popoverContent = `<a href='#' class='custPopoverAnch'>Edit</a><a href='#' class='custPopoverAnch'>Deactivate</a>`;
	}
	tbody.innerHTML += `
	<tr class="adminServiceRequestTR">
		<td data-dt-colName="User Name :">${names[i]}</td>
		<td data-dt-colName="User Type :">${ut}</td>
		<td data-dt-colName="Role :">${r}</td>
		<td data-dt-colName="Postal Code :">${poc[i]}</td>
		<td data-dt-colName="City :">${cities[i]}</td>
		<td data-dt-colName="Radius :">${radius}</td>
		<td data-dt-colName="User Status :">${
			status === "active" ? '<span class="status completed">Active</span>' : '<span class="status cancelled">Inactive</span>'
		}</td>
		<td class="actionTd" data-dt-colName="Action :">
			<div 
			class="action rounded-circle d-flex flex-column align-items-center justify-content-center position-relative" 
			${
				popoverContent !== ""
					? 'data-bs-toggle="popover" data-bs-custom-class="actionPopover" data-bs-offset="-45,10" data-bs-placement="bottom" data-bs-content="' +
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
	</tr>
	`;
}

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl, { sanitize: false }));

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"kmNum-pre": function (a) {
		a = a.replace(" km", "");
		console.log(a === "");
		if (a === "No Data") {
			a = "999999999";
		}
		return parseInt(a);
	},
	"kmNum-asc": function (a, b) {
		return a - b;
	},
	"kmNum-desc": function (a, b) {
		return b - a;
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
		{ orderable: false, targets: 1 },
		{ orderable: false, targets: 2 },
		{ orderable: false, targets: 4 },
		{ orderable: false, targets: 7 },
		{ type: "num", targets: 3 },
		{ type: "kmNum", targets: 5 },
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

sortingButton.addEventListener("click", () =>
	document
		.querySelectorAll("input[name='sortingRadio']")
		.forEach((radioBtn) =>
			radioBtn.addEventListener("click", () => dt.order([radioBtn.getAttribute("data-st-col"), radioBtn.getAttribute("data-st-type")]).draw())
		)
);
