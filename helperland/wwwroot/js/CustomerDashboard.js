const tbody = document.querySelector("tbody");
const sortingButton = document.querySelector(".sortingButton");
const rescheduleServiceModalHtml = document.querySelector("#rescheduleService");
const rescheduleBtn = rescheduleServiceModalHtml.querySelector("#rescheduleBtn");
const NewServiceStartTime = rescheduleServiceModalHtml.querySelector("#NewServiceStartTime");
const NewServiceDate = rescheduleServiceModalHtml.querySelector("#NewServiceDate");
const rescheduleError = rescheduleServiceModalHtml.querySelector("#rescheduleError");
const cancelModalHtml = document.querySelector("#cancelService");
const cancelReason = cancelModalHtml.querySelector("#cancelReason");
const cancelBtn = cancelModalHtml.querySelector("#cancelBtn");
const cancelReasonError = cancelModalHtml.querySelector("#cancelReasonError");
const serviceDetailsModalHtml = document.querySelector("#serviceDetails");
const serviceDetailsModalBody = serviceDetailsModalHtml.querySelector(".modal-body");
const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");

const cancelModal = bootstrap.Modal.getOrCreateInstance(cancelModalHtml);
const rescheduleServiceModal = bootstrap.Modal.getOrCreateInstance(rescheduleServiceModalHtml);
const serviceDetailsModal = bootstrap.Modal.getOrCreateInstance(serviceDetailsModalHtml);
const toast = bootstrap.Toast.getOrCreateInstance(toastHtml);

const nowDate = new Date();
if (nowDate.getHours() >= 18 && nowDate.getMinutes() > 0) {
	nowDate.setDate(nowDate.getDate() + 1);
}

$("#NewServiceDate").datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true,
	minDate: nowDate,
	showAnim: "slideDown",
	dateFormat: "dd/mm/yy",
});

$("#NewServiceDate").datepicker("setDate", nowDate);

const showToast = (toastType, message) => {
	const cl = toastHtml.classList.toString().match(/bg-[a-z]*/);
	if (cl) toastHtml.classList.remove(cl[0]);
	toastHtml.classList.add(`bg-${toastType}`);

	toastBody.innerHTML = message;
	toast.show();
	setTimeout(() => {
		toastHtml.classList.remove(`bg-${toastType}`);
		toast.hide();
	}, 5000);
};

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"serviceDate-pre": function (a) {
		let time = a
			.match(/<div class="time text-nowrap">.*<\/div>/)[0]
			.replace(`<div class="time text-nowrap">`, "")
			.replace("</div>", "");
		time = time.split(" - ")[0] + ":00";
		a = a
			.match(/<h5>.*<\/h5>/)[0]
			.replace("<h5>", "")
			.replace("</h5>", "");
		let d = a.split("/");
		let day = d[0].length === 1 ? `0${d[0]}` : d[0];
		let month = d[1].length === 1 ? `0${d[1]}` : d[1];
		let year = d[2].length === 1 ? `0${d[2]}` : d[2];
		a = `${month}/${day}/${year} ${time}`;
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
const dt = new DataTable("#dashboardTable", {
	dom: "Brtlip",
	responsive: false,
	pagingType: "full_numbers",
	language: {
		paginate: {
			first: "<img src='/images/firstPage.png' alt='first' />",
			previous: "<img src='/images/previous.png' alt='previous' />",
			next: '<img src="/images/previous.png" alt="next" style="transform: rotate(180deg)" />',
			last: "<img src='/images/firstPage.png' alt='first' style='transform: rotate(180deg)' />",
		},
		info: "Total Record: _MAX_",
		lengthMenu: "Show_MENU_Entries",
		emptyTable: "No Service Requests Found",
	},
	columnDefs: [
		{ orderable: false, targets: 4 },
		{ type: "serviceDate", targets: 1 },
	],
});

const validateReason = () => {
	if (!cancelReason.value.trim()) {
		cancelReasonError.innerHTML = "Enter Cancel Reason !";
		cancelReason.classList.add("input-validation-error");
		return false;
	} else {
		cancelReasonError.innerHTML = "";
		cancelReason.classList.remove("input-validation-error");
		return true;
	}
};

cancelReason.addEventListener("focusout", () => {
	validateReason();
});
cancelReason.addEventListener("keyup", () => {
	validateReason();
});

const openCancelModal = (serviceId) => {
	serviceDetailsModal.hide();
	rescheduleServiceModal.hide();
	cancelModal.show();
	cancelBtn.setAttribute("data-serviceid", serviceId);
};

const openRescheduleModal = (serviceId, startDate, serviceHours) => {
	serviceDetailsModal.hide();
	cancelModal.hide();
	rescheduleBtn.setAttribute("data-serviceId", serviceId);
	$("#NewServiceDate").datepicker("setDate", new Date(startDate));
	NewServiceStartTime.value = parseInt(serviceHours.split(":")[0]) + parseInt(serviceHours.split(":")[1]) / 60;
	rescheduleServiceModal.show();
};

const extras = ["Inside Cabinate", "Inside Fridge", "Inside Oven", "Laundry Wash & Dry", "Interior Windows"];

const openDetailsModal = async (
	serviceId,
	serviceProviderName,
	profilePic,
	avgRating,
	serviceStartDate,
	rawServiceStartDate,
	serviceStartTime,
	serviceEndTime,
	payment
) => {
	try {
		if (serviceId) {
			cancelModal.hide();
			rescheduleServiceModal.hide();
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
							<span class="lh-sm ms-1 avgRating">${avgRating}</span>
						</div>
					</div>
					<div>${parseInt(data.totalCleaning)} cleaning</div>
				</div>`
						: ""
				}
				<div class="buttons mt-3">
					<button
					onclick='openRescheduleModal("${serviceId}","${rawServiceStartDate}","${serviceStartTime}")'
						class="rate border-0 rounded-pill d-inline-flex align-items-center justify-content-center text-white"><img
							src="/images/reschedule-icon-small.png" class="me-1">
						Reschedule</button>
					<button
					onclick='openCancelModal("${serviceId}")'
						class="cancel border-0 rounded-pill d-inline-flex align-items-center justify-content-center text-white"><img
							src="/images/close-icon-small.png" class="me-1">
						Cancel</button>
				</div>
				`;
				serviceDetailsModal.show();
			}
		}
	} catch (error) {
		loading(false);
		serviceDetailsModal.hide();
		showToast("danger", "Internal Server Error !");
	}
};

rescheduleBtn.addEventListener("click", async () => {
	try {
		if (NewServiceDate.value && NewServiceStartTime.value) {
			loading(true);
			const res = await fetch("/Customer/RescheduleService", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ServiceId: parseInt(rescheduleBtn.getAttribute("data-serviceId")),
					NewServiceDate: NewServiceDate.value,
					NewServiceStartTime: NewServiceStartTime.value,
				}),
			});
			const data = await res.json();
			loading(false);
			if (data.success) {
				rescheduleServiceModal.hide();
				showToast("success", data.success);
				setTimeout(() => {
					window.location.reload();
				}, 2500);
			} else {
				rescheduleServiceModal.hide();
				showToast("danger", data.err);
			}
		}
	} catch (error) {
		loading(false);
		rescheduleServiceModal.hide();
		showToast("danger", "Internal Server Error !");
		console.log(error.message);
	}
});

cancelBtn.addEventListener("click", async () => {
	try {
		const serviceId = cancelBtn.getAttribute("data-serviceid");
		if (serviceId && validateReason()) {
			loading(true);
			const res = await fetch("/Customer/CancelService", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ServiceId: parseInt(serviceId), CancelReason: cancelReason.value }),
			});
			if (res.redirected) {
				window.location.href = res.url;
			}
			const data = await res.json();
			loading(false);
			cancelModal.hide();
			if (data.success) {
				document.querySelector("#service_" + serviceId).remove();
				showToast("success", data.success);
				cancelReason.value = "";
				cancelReasonError.innerHTML = "";
			} else {
				showToast("danger", data.err);
			}
		}
	} catch (error) {
		cancelModal.hide();
		console.log(error.message);
		loading(false);
		showToast("danger", "Internal Server Error !");
	}
});

sortingButton.addEventListener("click", () =>
	document
		.querySelectorAll("input[name='sortingRadio']")
		.forEach((radioBtn) =>
			radioBtn.addEventListener("click", () => dt.order([radioBtn.getAttribute("data-st-col"), radioBtn.getAttribute("data-st-type")]).draw())
		)
);
