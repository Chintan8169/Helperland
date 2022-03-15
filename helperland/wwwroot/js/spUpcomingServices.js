const tbody = document.querySelector("tbody");
const sortingButton = document.querySelector(".sortingButton");
const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");
const serviceDetailsModalHtml = document.querySelector("#serviceDetails");
const serviceDetailsModalBody = serviceDetailsModalHtml.querySelector(".modal-body");

const toast = bootstrap.Toast.getOrCreateInstance(toastHtml);
const serviceDetailsModal = bootstrap.Modal.getOrCreateInstance(serviceDetailsModalHtml);

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

const dt = new DataTable("#serviceHistoryTable", {
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
		emptyTable: "No Upcoming Service Found",
	},
	buttons: [
		{
			extend: "excel",
			text: "Export",
		},
	],
	columnDefs: [
		{ orderable: false, targets: 2 },
		{ orderable: false, targets: 4 },
		{ type: "serviceDate", targets: 1 },
	],
});

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

const extras = ["Inside Cabinate", "Inside Fridge", "Inside Oven", "Laundry Wash & Dry", "Interior Windows"];

const openDetailsModal = async (
	serviceId,
	custName,
	street,
	houseNum,
	postalCode,
	city,
	serviceStartDate,
	serviceStartTime,
	serviceEndTime,
	serviceDuration,
	isCompletable,
	isCancalable
) => {
	try {
		if (serviceId) {
			loading(true);
			const res = await fetch(`/ServiceProvider/GetServiceDetails?ServiceId=${serviceId}`, { method: "GET" });
			const data = await res.json();
			const mapboxres = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${postalCode}.json?country=de&limit=1&types=postcode&access_token=pk.eyJ1IjoiY2hpbnRhbjgxNjkiLCJhIjoiY2tvZWNiaTdhMDljeDJwbGoxdTV6eW9ocyJ9.ZTVOwDvOJqnfEKpBWgUvbg`
			);
			const mapboxdata = await mapboxres.json();
			loading(false);
			if (data.err) {
				serviceDetailsModal.hide();
				showToast("danger", data.err);
			} else if (mapboxdata.features && mapboxdata.features.length > 0) {
				let extraStr = "";
				if (data.extras.length > 0) {
					data.extras.forEach((e, i) => {
						extraStr += i == data.extras.length - 1 ? extras[e - 1] : extras[e - 1] + ", ";
					});
				} else extraStr = "No Extra Service !";
				serviceDetailsModalBody.innerHTML = `
				<div class="col-12 col-md-6">
					<div class="serviceDateRelatedDetails">
						<div class="fw-bold fs-5">${serviceStartDate} ${serviceStartTime} - ${serviceEndTime}</div>
						<div><strong>Duration:</strong> ${serviceDuration} Hrs.</div>
					</div>
					<hr />
					<div class="serviceRelatedDetails">
						<div><strong>Service Id:</strong> ${serviceId}</div>
						<div><strong>Extras:</strong> ${extraStr}</div>
						<div class="d-flex align-items-start justify-content-start"><strong>Net Amount:</strong><span
								class="paymentAmount ms-3">${data.payment}€</span></div>
					</div>
					<hr />
					<div class="serviceAddressRelatedDetails">
						<div><strong>Customer Name:</strong> ${custName}</div>
						<div><strong>Service Address: </strong> ${street} ${houseNum}, ${postalCode} ${city}</div>
					</div>
					<hr />
					<div class="otherStuff">
						<div><strong>Comments: </strong> ${data.comments ? data.comments : ""}</div>
						<div><img src="/images/${data.hasPets ? "included.png" : "not-included.png"}"> I Have ${data.hasPets ? "" : "not"} Pets at Home</div>
					</div>
				</div>
				<div class="serviceMap col-12 mt-3 mt-md-0 col-md-6">
					<iframe class="w-100 h-100" src="https://maps.google.com/maps?q=${mapboxdata.features[0].geometry.coordinates[1]},${
					mapboxdata.features[0].geometry.coordinates[0]
				}&z=16&output=embed" style="border:0px;"></iframe>
				</div>${
					isCompletable === "True" || isCancalable === "True"
						? `<div class="buttons mt-3">
							${
								isCompletable === "True"
									? `<button onclick='changeService("${serviceId}","CompleteService")' class="rate border-0 rounded-pill d-inline-flex align-items-center justify-content-center text-white">
										<img src="/images/tickBig.png" class="me-1" asp-append-version="true">
										Complete
									</button>`
									: ""
							}
							${
								isCancalable === "True"
									? `<button onclick='changeService("${serviceId}","CancelService")' class="cancel border-0 rounded-pill d-inline-flex align-items-center justify-content-center text-white">
										<img src="/images/close-icon-small.png" class="me-1" asp-append-version="true">
										Cancel
									</button>`
									: ""
							}
						</div>`
						: ""
				}`;
				serviceDetailsModal.show();
			}
		}
	} catch (error) {
		serviceDetailsModal.hide();
		loading(false);
		console.log(error);
		showToast("danger", "Internal Server Error !");
	}
};

const changeService = async (serviceId, apiRoot) => {
	try {
		loading(true);
		const res = await fetch(`/ServiceProvider/${apiRoot}?ServiceId=${serviceId}`, { method: "GET" });
		const data = await res.json();
		loading(false);
		serviceDetailsModal.hide();
		if (data.success) {
			const tr = document.querySelector("#service-" + serviceId);
			tr.remove();
			showToast("success", data.success);
		} else {
			showToast("danger", data.err);
		}
	} catch (error) {
		serviceDetailsModal.hide();
		loading(false);
		showToast("danger", "Internal Server Error !");
		console.log(error.message);
	}
};

sortingButton.addEventListener("click", () =>
	document
		.querySelectorAll("input[name='sortingRadio']")
		.forEach((radioBtn) =>
			radioBtn.addEventListener("click", () => dt.order([radioBtn.getAttribute("data-st-col"), radioBtn.getAttribute("data-st-type")]).draw())
		)
);
