const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");
const toast = bootstrap.Toast.getOrCreateInstance(toastHtml);
const day = document.querySelector("#SPDetails_Day");
const month = document.querySelector("#SPDetails_Month");
const year = document.querySelector("#SPDetails_Year");
const ChangePasswordForm = document.querySelector("#ChangePasswordForm");
const ChangePasswordFormBtn = ChangePasswordForm.querySelector("#ChangePasswordFormBtn");
const UpdateDetailsForm = document.querySelector("#UpdateDetailsForm");
const UpdateDetailsFormBtn = UpdateDetailsForm.querySelector("#UpdateDetailsFormBtn");
const city = UpdateDetailsForm.querySelector("#SPDetails_City");
const PostalCode = UpdateDetailsForm.querySelector("#SPDetails_PostalCode");
const doberror = document.querySelector("#doberror");

const tab1Btn = document.querySelector("#detailsTabBtn");
const tab2Btn = document.querySelector("#changePasswordTabBtn");

const tab1 = bootstrap.Tab.getOrCreateInstance(tab1Btn);
const tab2 = bootstrap.Tab.getOrCreateInstance(tab2Btn);

tab2Btn.addEventListener("hide.bs.tab", (e) => {
	const ChangePasswordFormValidator = $("#ChangePasswordForm").validate();
	ChangePasswordFormValidator.resetForm();
	ChangePasswordForm.reset();
});

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
		const UpdateDetailsFormValidator = $("#UpdateDetailsForm").validate();
		UpdateDetailsFormValidator.element("#" + city.id);
	} catch (error) {
		console.log(error.message);
	}
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

UpdateDetailsFormBtn.addEventListener("click", async (e) => {
	const UpdateDetailsFormValidator = $("#UpdateDetailsForm").validate();
	if (UpdateDetailsFormValidator.form()) {
		e.preventDefault();
		if (day.value && month.value && year.value ? true : false) {
			const d = parseInt(day.value);
			const m = parseInt(month.value) - 1;
			const y = parseInt(year.value);
			const date = new Date(y, m, d);
			if (m !== date.getMonth()) {
				doberror.innerHTML = "Enter Valid Date !";
			} else if (new Date().getTime() - date.getTime() < 18 * 365 * 24 * 60 * 60 * 1000) {
				doberror.innerHTML = "Age Must Be greater than 18 !";
			} else {
				doberror.innerHTML = "";
				try {
					loading(true);
					const formData = new FormData(UpdateDetailsForm);
					const bodyData = {};
					bodyData.FirstName = formData.get("SPDetails.FirstName");
					bodyData.LastName = formData.get("SPDetails.LastName");
					bodyData.Day = parseInt(formData.get("SPDetails.Day"));
					bodyData.Month = parseInt(formData.get("SPDetails.Month"));
					bodyData.Year = parseInt(formData.get("SPDetails.Year"));
					bodyData.Email = document.querySelector("#SPDetails_Email").value;
					bodyData.Nationality = document.querySelector("#SPDetails_Nationality").value;
					bodyData.PhoneNumber = formData.get("SPDetails.PhoneNumber");
					bodyData.Gender = parseInt(formData.get("SPDetails.Gender"));
					bodyData.StreetName = formData.get("SPDetails.StreetName");
					bodyData.HouseNumber = formData.get("SPDetails.HouseNumber");
					bodyData.PostalCode = formData.get("SPDetails.PostalCode");
					bodyData.City = document.querySelector("#SPDetails_City").value;
					bodyData.Profile = formData.get("SPDetails.Profile");
					const res = await fetch("/ServiceProvider/UpdateDetails", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(bodyData),
					});
					if (res.redirected) {
						window.location.href = res.url;
					}
					const data = await res.json();
					loading(false);
					if (data.success) {
						showToast("success", data.success);
					} else {
						showToast("danger", data.err);
					}
				} catch (error) {
					loading(false);
					console.log(error.message);
					showToast("danger", "Internal Server Error !");
				}
			}
		} else {
			doberror.innerHTML = "Enter Valid Date !";
		}
	}
});

ChangePasswordFormBtn.addEventListener("click", async (e) => {
	try {
		const ChangePasswordFormValidator = $("#ChangePasswordForm").validate();
		if (ChangePasswordFormValidator.form()) {
			e.preventDefault();
			const formData = new FormData(ChangePasswordForm);
			const bodyData = {};
			bodyData.CurrentPassword = formData.get("PasswordChange.CurrentPassword");
			bodyData.NewPassword = formData.get("PasswordChange.NewPassword");
			if (bodyData.CurrentPassword === bodyData.NewPassword) {
				showToast("danger", "Old Password and New Password can't be same !!");
			} else {
				loading(true);
				const res = await fetch("/Account/ChangePassword", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(bodyData),
				});
				if (res.redirected) {
					window.location.href = res.url;
				}
				const data = await res.json();
				loading(false);
				if (data.success) {
					showToast("success", data.success);
					ChangePasswordFormValidator.resetForm();
					ChangePasswordForm.reset();
				} else {
					showToast("danger", data.err);
				}
			}
		}
	} catch (error) {
		loading(false);
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
});
