const hamburger = document.querySelector(".hamburger");
const halfPage = document.querySelector(".halfPage");
const verticleMenu = document.querySelector(".verticleMenu");
const sortingButton = document.querySelector(".sortingButton");
const tbody = document.querySelector("tbody");
const formuserName = document.querySelector("#userName");
const formuserRole = document.querySelector("#userRole");
const formmobile = document.querySelector("#mobile");
const formfromDate = document.querySelector("#fromDate");
const formtoDate = document.querySelector("#toDate");
const filterForm = document.querySelector(".filterForm");
const filterTable = document.querySelector("#filterTable");
const $filterTable = filterTable;
const clearFilter = document.querySelector("#clearFilter");

hamburger.addEventListener("click", () => {
	[verticleMenu, hamburger].forEach((ele) => ele.classList.toggle("open"));
});
halfPage.addEventListener("click", () => {
	[verticleMenu, hamburger].forEach((ele) => ele.classList.remove("open"));
});

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl, { sanitize: false }));

const activateOrDeactivate = async (userId, isApproved) => {
	try {
		if (userId && isApproved) {
			loading(true);
			const res = await fetch("/Admin/ActivateOrDeactivateUser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ UserId: userId, isApproved: isApproved === "True" ? true : false }),
			});
			const data = await res.json();
			loading(false);
			if (res.redirected) window.location.href = res.url;
			if (data.success) {
				showToast("success", data.success);
				setTimeout(() => {
					window.location.reload();
				}, 2000);
			} else {
				showToast("danger", data.err);
			}
		}
	} catch (error) {
		showToast("danger", "Internal Server Error !");
		loading(false);
	}
};

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"serviceDate-pre": function (a) {
		console.log(a);
		a = a
			.match(/<b>.*<\/b>/)[0]
			.replace("<b>", "")
			.replace("</b>", "");
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
			previous: "<img src='/images/adminNextPreviousButton.svg' alt='previous' />",
			next: '<img src="/images/adminNextPreviousButton.svg" alt="next" style="transform: rotate(180deg)" />',
		},
		info: "Total Record: _MAX_",
		lengthMenu: "Show_MENU_Entries",
		emptyTable: "No Users Found",
	},
	columnDefs: [
		{ type: "serviceDate", targets: 1 },
		{ orderable: false, targets: 3 },
		{ orderable: false, targets: 5 },
		{ orderable: false, targets: 7 },
	],
});

$($filterTable).on("click", (e) => {
	e.preventDefault();
	$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
		let userName = data[0].trim();
		let regiDate = data[1].trim();
		let userType = data[2];
		let phoneNumber = data[3];
		const isUserName = formuserName.value !== "userName" ? userName === formuserName.value : true;
		const isUserType = formuserRole.value === "userRole" ? true : userType === formuserRole.value;
		const isPhoneNumber = formmobile.value ? phoneNumber.includes(formmobile.value) : true;
		const dateSplited = regiDate.split("/");
		const srdate = new Date(parseInt(dateSplited[2]), parseInt(dateSplited[1]) - 1, parseInt(dateSplited[0]));
		const isDateGreater = formfromDate.value ? srdate >= new Date(formfromDate.value) : true;
		const isDateSmaller = formtoDate.value ? srdate <= new Date(formtoDate.value) : true;
		return isUserName && isUserType && isPhoneNumber && isDateGreater && isDateSmaller;
	});
	dt.draw();
});
clearFilter.addEventListener("click", (e) => {
	$.fn.dataTableExt.afnFiltering.length = 0;
	dt.draw();
});

$("#fromDate").datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true,
	showAnim: "slideDown",
	dateFormat: "mm/dd/yy",
});

$("#toDate").datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true,
	showAnim: "slideDown",
	dateFormat: "mm/dd/yy",
});
sortingButton.addEventListener("click", () =>
	document
		.querySelectorAll("input[name='sortingRadio']")
		.forEach((radioBtn) =>
			radioBtn.addEventListener("click", () => dt.order([radioBtn.getAttribute("data-st-col"), radioBtn.getAttribute("data-st-type")]).draw())
		)
);
