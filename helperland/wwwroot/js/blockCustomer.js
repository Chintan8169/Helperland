const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");
const toast = bootstrap.Toast.getOrCreateInstance(toastHtml);

const dt = new DataTable("#blockCustomerTable", {
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
		emptyTable: "No service History Found",
	},
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

const blockOrUnblock = async (userId) => {
	try {
		const checkbox = document.querySelector("#" + userId);
		loading(true);
		const res = await fetch("/ServiceProvider/BlockCustomer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ UserId: userId, IsBlocked: checkbox.checked }),
		});
		if (res.redirected) window.location.href = res.url;
		const data = await res.json();
		loading(false);
		if (data.success) {
			const label = document.querySelector(`label[for='${userId}']`);
			if (data.isBlocked) {
				label.innerHTML = "Unblock";
				label.classList.add("blocked");
				label.classList.remove("unblocked");
			} else {
				label.innerHTML = "Block";
				label.classList.remove("blocked");
				label.classList.add("unblocked");
			}
			showToast("success", data.success);
		} else {
			showToast("danger", data.err);
		}
	} catch (error) {
		loading(false);
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
};
