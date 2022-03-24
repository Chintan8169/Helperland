const hamburger = document.querySelector(".hamburger");
const halfPage = document.querySelector(".halfPage");
const sortingButton = document.querySelector(".sortingButton");
const verticleMenu = document.querySelector(".verticleMenu");
const filterTable = document.querySelector("#filterTable");
const $filterTable = filterTable;
const clearFilter = document.querySelector("#clearFilter");
const $clearFilter = clearFilter;
const tbody = document.querySelector("tbody");
const formServiceId = document.querySelector("#serviceId");
const formCustomer = document.querySelector("#customer");
const formtoDate = document.querySelector("#toDate");
const formfromDate = document.querySelector("#fromDate");
const PostalCode = document.querySelector("#AdminRescheduleViewModel_PostalCode");
const city = document.querySelector("#AdminRescheduleViewModel_City");
const formstatus = document.querySelector("#status");
const formserviceProvider = document.querySelector("#serviceProvider");
const filterForm = document.querySelector("#filForm");
const EditOrRescheduleModalHtml = document.querySelector("#EditOrRescheduleModal");
const EditOrRescheduleModalBody = EditOrRescheduleModalHtml.querySelector(".modal-body");
const RDate = EditOrRescheduleModalBody.querySelector("#AdminRescheduleViewModel_RescheduleDate");
const RTime = EditOrRescheduleModalBody.querySelector("#AdminRescheduleViewModel_RescheduleTime");
const RStreetName = EditOrRescheduleModalBody.querySelector("#AdminRescheduleViewModel_StreetName");
const RHouseNumber = EditOrRescheduleModalBody.querySelector("#AdminRescheduleViewModel_HouseNumber");
const RReason = EditOrRescheduleModalBody.querySelector("#AdminRescheduleViewModel_RescheduleReason");
const RSubmit = EditOrRescheduleModalBody.querySelector("button[type='submit']");
const EditOrRescheduleModal = bootstrap.Modal.getOrCreateInstance(EditOrRescheduleModalHtml);
const serviceDetailsModalHtml = document.querySelector("#serviceDetails");
const serviceDetailsModalBody = serviceDetailsModalHtml.querySelector(".modal-body");
const serviceDetailsModal = bootstrap.Modal.getOrCreateInstance(serviceDetailsModalHtml);
const RefundModalModalHtml = document.querySelector("#RefundModal");
const RefundModalModalBody = RefundModalModalHtml.querySelector(".modal-body");
const RefundModalModal = bootstrap.Modal.getOrCreateInstance(RefundModalModalHtml);

// RefundModalModal.show();

hamburger.addEventListener("click", () => {
	[verticleMenu, hamburger].forEach((ele) => ele.classList.toggle("open"));
});
halfPage.addEventListener("click", () => {
	[verticleMenu, hamburger].forEach((ele) => ele.classList.remove("open"));
});

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl, { sanitize: false }));

PostalCode.addEventListener("focusout", async () => {
	try {
		const res = await fetch(`/Static/GetCityByPostalCode?PostalCode=${PostalCode.value}`, { method: "GET" });
		if (res.redirected) {
			window.location.href = res.url;
		}
		const data = await res.json();
		if (data.cityName) {
			city.value = data.cityName;
		} else {
			city.value = "";
		}
		const RescheduleFormValidator = $("#RescheduleForm").validate();
		RescheduleFormValidator.element("#" + city.id);
	} catch (error) {
		console.log(error.message);
	}
});

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"serviceDate-pre": function (a) {
		const time = a
			.match(/<div class="time text-md-nowrap">.*<\/div>/)[0]
			.replace(`<div class="time text-md-nowrap">`, "")
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

const dt = new DataTable("#adminServiceRequestTable", {
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
		emptyTable: "No service History Found",
	},
	columnDefs: [
		{ orderable: false, targets: 5 },
		{ type: "serviceDate", targets: 1 },
	],
});

$($filterTable).on("click", (e) => {
	e.preventDefault();
	$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
		let serviceId = data[0];
		let serviceDate = data[1]
			.match(/<h5>.*<\/h5>/)[0]
			.replace("<h5>", "")
			.replace("</h5>", "");
		let custDetails = data[2];
		let spDetails = data[3];
		let status = data[4];
		const isServiceId = formServiceId.value ? serviceId === formServiceId.value : true;
		const isCustomer = formCustomer.value === "customer" ? true : custDetails.includes(formCustomer.value);
		const isSp = formserviceProvider.value === "serviceProvider" ? true : spDetails.includes(formserviceProvider.value);
		const isStatus = formstatus.value === "status" ? true : status === formstatus.value;
		const dateSplited = serviceDate.split("/");
		const srdate = new Date(parseInt(dateSplited[2]), parseInt(dateSplited[1]) - 1, parseInt(dateSplited[0]));
		const isDateGreater = formfromDate.value ? srdate >= new Date(formfromDate.value) : true;
		const isDateSmaller = formtoDate.value ? srdate <= new Date(formtoDate.value) : true;
		return isServiceId && isCustomer && isSp && isStatus && isDateGreater && isDateSmaller;
	});
	dt.draw();
});
$($clearFilter).on("click", (e) => {
	$.fn.dataTableExt.afnFiltering.length = 0;
	dt.draw();
});

filterForm.addEventListener("submit", (e) => e.preventDefault());

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

$("#AdminRescheduleViewModel_RescheduleDate").datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true,
	minDate: new Date(),
	showAnim: "slideDown",
	dateFormat: "dd/mm/yy",
});

sortingButton.addEventListener("click", () =>
	document
		.querySelectorAll("input[name='sortingRadio']")
		.forEach((radioBtn) =>
			radioBtn.addEventListener("click", () => dt.order([radioBtn.getAttribute("data-st-col"), radioBtn.getAttribute("data-st-type")]).draw())
		)
);

const openEditOrRescheduleModal = (serviceId, serviceDate, serviceTime, houseNumber, postalCode, cityName, streetName) => {
	streetName = decodeURIComponent(streetName);
	RDate.value = serviceDate;
	RTime.value = parseFloat(serviceTime.split(":")[0]) + parseFloat(serviceTime.split(":")[1]) / 60;
	RStreetName.value = streetName;
	RHouseNumber.value = houseNumber;
	city.value = cityName;
	PostalCode.value = postalCode;
	RSubmit.setAttribute("data-service-id", serviceId);
	setTimeout(() => {
		const RescheduleFormValidator = $("#RescheduleForm").validate();
		RescheduleFormValidator.element("#" + RDate.id);
		RescheduleFormValidator.element("#" + RTime.id);
		RescheduleFormValidator.element("#" + RStreetName.id);
		RescheduleFormValidator.element("#" + RHouseNumber.id);
		RescheduleFormValidator.element("#" + PostalCode.id);
		RescheduleFormValidator.element("#" + city.id);
	}, 200);
	EditOrRescheduleModal.show();
};

const openRefundModal = (serviceId, totalCost, refundedAmount) => {
	totalCost = parseFloat(totalCost);
	refundedAmount = parseFloat(refundedAmount);
	let balance = totalCost - refundedAmount;
};

RSubmit.addEventListener("click", async (e) => {
	try {
		const RescheduleFormValidator = $("#RescheduleForm").validate();
		if (RescheduleFormValidator.form()) {
			e.preventDefault();
			const serviceId = RSubmit.getAttribute("data-service-id");
			if (serviceId) {
				loading(true);
				const res = await fetch("/Admin/EditOrRescheduleService", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						ServiceId: parseInt(serviceId),
						RescheduleDate: RDate.value,
						RescheduleTime: parseFloat(RTime.value),
						StreetName: RStreetName.value,
						HouseNumber: RHouseNumber.value,
						PostalCode: PostalCode.value,
						City: city.value,
						RescheduleReason: document.querySelector("#AdminRescheduleViewModel_RescheduleReason").value,
					}),
				});
				if (res.redirected) window.location.href = res.url;
				const data = await res.json();
				EditOrRescheduleModal.hide();
				loading(false);
				if (data.success) {
					showToast("success", "Operation Successful !");
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				} else {
					showToast("danger", data.err);
				}
			}
		}
	} catch (error) {
		console.log(error.message);
		EditOrRescheduleModal.hide();
		loading(false);
		showToast("danger", "Internal Server Error !");
	}
});

const extras = ["Inside Cabinate", "Inside Fridge", "Inside Oven", "Laundry Wash & Dry", "Interior Windows"];
const openDetailsModal = async (
	serviceId,
	serviceProviderName,
	profilePic,
	avgRating,
	serviceStartDate,
	serviceStartTime,
	serviceEndTime,
	payment
) => {
	try {
		if (serviceId) {
			loading(true);
			const res = await fetch(`/Customer/GetServiceDetails?serviceId=${serviceId}`, { method: "GET" });
			const data = await res.json();
			loading(false);
			if (data.err) {
				serviceDetailsModal.hide();
				showToast("danger", data.err);
			} else {
				let extraStr = "";
				if (data.extras.length > 0) {
					data.extras.forEach((e, i) => {
						extraStr += i == data.extras.length - 1 ? extras[e - 1] : extras[e - 1] + ", ";
					});
				} else extraStr = "No Extra Service !";
				serviceDetailsModalBody.innerHTML = `
				<div class="${serviceProviderName.trim() == "" ? "col-12" : "col-12 col-md-7"}">
					<div class="serviceDateRelatedDetails">
						<div class="fw-bold fs-5">${serviceStartDate} ${serviceStartTime} - ${serviceEndTime}</div>
						<div><strong>Duration:</strong> ${data.duration} Hrs.</div>
					</div>
					<hr />
					<div class="serviceRelatedDetails">
						<div><strong>Service Id:</strong> ${serviceId}</div>
						<div><strong>Extras:</strong> ${extraStr}</div>
						<div class="d-flex align-items-start justify-content-start"><strong>Net Amount:</strong><span
								class="paymentAmount ms-3">${payment} €</span></div>
					</div>
					<hr />
					<div class="serviceAddressRelatedDetails">
						<div><strong>Service Address: </strong> ${data.serviceStreetName} ${data.serviceHouseNumber}, ${data.postalCode} ${data.city}</div>
						<div><strong>Phone Number: </strong> ${data.phoneNumber}</div>
						<div><strong>Email: </strong>${data.email}</div>
					</div>
					<hr />
					<div class="otherStuff">
						<div><strong>Comments: </strong> ${data.comments ? data.comments : ""}</div>
						<div><img src="/images/${data.hasPets ? "included.png" : "not-included.png"}"> I Have ${data.hasPets ? "" : "not"} Pets at Home</div>
					</div>
				</div>
				${
					serviceProviderName.trim() != ""
						? `<div class="vr mx-3 p-0 col-1 d-none d-md-block"></div>
				<div class="serviceProviderRelatedDetails col-12 col-md-4">
					<strong class="d-block fs-4 lh-sm">Service Provider Details</strong>
					<div class="serviceProvider d-flex align-items-center justify-content-start">
						<img class="rounded-circle" src="/images/${profilePic}">
						<div>
							<div class="fw-bold fs-5">${serviceProviderName}</div>
							<div
								class="stars position-relative d-inline-flex align-items-center justify-content-center">
								<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
									<path fill-rule="evenodd" fill="#ECB91C" d="m8.176 12.865 5.045 3.735-1.334-5.78 4.453-3.84-5.871-1.402L8.176.6 5.882
										5.578.11 6.98l4.355 3.84L3.13 16.6l5.046-3.735z" />
								</svg>
								<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
									<path fill-rule="evenodd" fill="#ECB91C" d="m8.176 12.865 5.045 3.735-1.334-5.78 4.453-3.84-5.871-1.402L8.176.6 5.882
										5.578.11 6.98l4.355 3.84L3.13 16.6l5.046-3.735z" />
								</svg>
								<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
									<path fill-rule="evenodd" fill="#ECB91C" d="m8.176 12.865 5.045 3.735-1.334-5.78 4.453-3.84-5.871-1.402L8.176.6 5.882
										5.578.11 6.98l4.355 3.84L3.13 16.6l5.046-3.735z" />
								</svg>
								<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
									<path fill-rule="evenodd" fill="#ECB91C" d="m8.176 12.865 5.045 3.735-1.334-5.78 4.453-3.84-5.871-1.402L8.176.6 5.882
										5.578.11 6.98l4.355 3.84L3.13 16.6l5.046-3.735z" />
								</svg>
								<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
									<path fill-rule="evenodd" fill="#ECB91C" d="m8.176 12.865 5.045 3.735-1.334-5.78 4.453-3.84-5.871-1.402L8.176.6 5.882
										5.578.11 6.98l4.355 3.84L3.13 16.6l5.046-3.735z" />
								</svg>
								<div class="cover position-absolute top-0 end-0 h-100" style="width:${(5 - parseFloat(avgRating)) * 20}%"></div>
							</div>
							<span class="lh-sm ms-1 avgRating">${parseFloat(avgRating).toFixed(2)}</span>
						</div>
					</div>
					<div>${parseInt(data.totalCleaning)} cleaning</div>
				</div>`
						: ""
				}
				`;
				serviceDetailsModal.show();
			}
		}
	} catch (error) {
		loading(false);
		serviceDetailsModal.hide();
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
};
