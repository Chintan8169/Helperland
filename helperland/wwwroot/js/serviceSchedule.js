const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");
const toast = bootstrap.Toast.getOrCreateInstance(toastHtml);
const serviceDetailsModalHtml = document.querySelector("#serviceDetails");
const serviceDetailsModalBody = serviceDetailsModalHtml.querySelector(".modal-body");
const serviceDetailsModal = bootstrap.Modal.getOrCreateInstance(serviceDetailsModalHtml);

window.addEventListener("load", () => {
	fetch("/ServiceProvider/GetEvents", { method: "GET" })
		.then((res) => res.json())
		.then((data) => {
			const calendarElement = document.getElementById("serviceSchedule");
			const calendar = new FullCalendar.Calendar(calendarElement, {
				eventDisplay: "block",
				displayEventTime: false,
				displayEventEnd: false,
				customButtons: {
					completedBtn: {
						text: "Completed",
					},
					upcomingBtn: {
						text: "Upcoming",
					},
				},
				headerToolbar: {
					start: "prev,next title",
					center: "",
					end: "completedBtn upcomingBtn",
				},
				initialView: "dayGridMonth",
				events: data,
				eventClick: (info) => {
					openDetailsModal(parseInt(info.event._def.publicId));
				},
			});
			calendar.render();
		})
		.catch((err) => console.log(err.message));
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

const openDetailsModal = async (serviceId) => {
	try {
		if (serviceId) {
			loading(true);
			const res = await fetch(`/ServiceProvider/GetEventDetails?ServiceId=${parseInt(serviceId)}`, { method: "GET" });
			const data = await res.json();
			const mapboxres = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${data.postalCode}.json?country=de&limit=1&types=postcode&access_token=pk.eyJ1IjoiY2hpbnRhbjgxNjkiLCJhIjoiY2tvZWNiaTdhMDljeDJwbGoxdTV6eW9ocyJ9.ZTVOwDvOJqnfEKpBWgUvbg`
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
						<div class="fw-bold fs-5">${data.serviceStartDate} ${data.serviceStartTime} - ${data.serviceEndTime}</div>
						<div><strong>Duration:</strong> ${data.serviceDuration} Hrs.</div>
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
						<div><strong>Customer Name:</strong> ${data.custName}</div>
						<div><strong>Service Address: </strong> ${data.street} ${data.houseNum}, ${data.postalCode} ${data.city}</div>
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
				</div>`;
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
