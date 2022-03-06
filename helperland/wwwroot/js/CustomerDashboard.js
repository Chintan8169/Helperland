const tbody = document.querySelector("tbody");
const sortingButton = document.querySelector(".sortingButton");
const body = document.querySelector("body");
const cancelModalHtml = document.querySelector("#cancelService");
const cancelReason = cancelModalHtml.querySelector("#cancelReason");
const cancelBtn = cancelModalHtml.querySelector("#cancelBtn");
const cancelReasonError = cancelModalHtml.querySelector("#cancelReasonError");
const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");

const cancelModal = bootstrap.Modal.getOrCreateInstance(cancelModalHtml);
const toast = bootstrap.Toast.getOrCreateInstance(toastHtml);

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
	cancelModal.show();
	cancelBtn.setAttribute("data-serviceid", serviceId);
};

cancelBtn.addEventListener("click", async () => {
	try {
		const serviceId = cancelBtn.getAttribute("data-serviceid");
		if (serviceId && validateReason()) {
			body.classList.add("loading");
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
			body.classList.remove("loading");
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
		body.classList.remove("loading");
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
