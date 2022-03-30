const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");
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

const changeFlag = async (spid, isblocked, isfavourite) => {
	console.log(spid, isblocked, isfavourite);
	try {
		loading(true);
		const res = await fetch("/Customer/ChangeBlockOrFavourite", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				SPId: spid,
				IsBlocked: isblocked == "false" ? false : true,
				IsFavourite: isfavourite == "false" ? false : true,
			}),
		});
		if (res.redirected) window.location.href = res.url;
		const data = await res.json();
		loading(false);
		if (data.success) {
			showToast("success", data.success);
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} else {
			showToast("danger", data.err);
		}
	} catch (error) {
		console.log(error.message);
		loading(false);
		showToast("danger", "Internal Server Error !");
	}
};

const dt = new DataTable("#favouriteAndBlockedTable", {
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
		emptyTable: "No Service Provider Found",
	},
});
