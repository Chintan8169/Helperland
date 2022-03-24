const day = document.querySelector("#Details_Day");
const month = document.querySelector("#Details_Month");
const year = document.querySelector("#Details_Year");
const UpdateDetailsFormBtn = document.querySelector("#UpdateDetailsFormBtn");
const addressesContainer = document.querySelector(".addressesContainer");
const tableBody = document.querySelector(".addressesContainer tbody");
const ChangePasswordFormBtn = document.querySelector("#ChangePasswordFormBtn");
const ChangePasswordForm = document.querySelector("#ChangePasswordForm");
const UpdateDetailsForm = document.querySelector("#UpdateDetailsForm");
const doberror = document.querySelector("#doberror");
const formSubmitError = document.querySelector("#formSubmitError");
const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");
const addAddressModalHtml = document.querySelector("#addAddressModal");
const addAddressModalBtn = addAddressModalHtml.querySelector("#addAddressModalBtn");
const addAddressModalForm = addAddressModalHtml.querySelector("#addAddressModalForm");
const updateAddressModalHtml = document.querySelector("#updateAddressModal");
const updateAddressModalBtn = updateAddressModalHtml.querySelector("#updateAddressModalBtn");
const updateAddressModalForm = updateAddressModalHtml.querySelector("#updateAddressModalForm");
const deleteAddressModalHtml = document.querySelector("#deleteAddressModal");
const deleteAddressModalBtn = deleteAddressModalHtml.querySelector("#deleteAddressModalBtn");
const postalCodes = document.querySelectorAll(".postalCode");
const cities = document.querySelectorAll(".City");

const tab1Btn = document.querySelector("#detailsTabBtn");
const tab2Btn = document.querySelector("#addressesTabBtn");
const tab3Btn = document.querySelector("#changePasswordTabBtn");

const tab1 = bootstrap.Tab.getOrCreateInstance(tab1Btn);
const tab2 = bootstrap.Tab.getOrCreateInstance(tab2Btn);
const tab3 = bootstrap.Tab.getOrCreateInstance(tab3Btn);
const toast = bootstrap.Toast.getOrCreateInstance(toastHtml);
const deleteAddressModal = bootstrap.Modal.getOrCreateInstance(deleteAddressModalHtml);
const addAddressModal = bootstrap.Modal.getOrCreateInstance(addAddressModalHtml);
const updateAddressModal = bootstrap.Modal.getOrCreateInstance(updateAddressModalHtml);

tab3Btn.addEventListener("hide.bs.tab", (e) => {
	const ChangePasswordFormValidator = $("#ChangePasswordForm").validate();
	ChangePasswordFormValidator.resetForm();
	ChangePasswordForm.reset();
});

const getCityByPostalCode = async (PostalCode) => {
	try {
		if (PostalCode.trim()) {
			const res = await fetch(`/Static/GetCityByPostalCode?PostalCode=${PostalCode}`, { method: "GET" });
			if (res.redirected) {
				window.location.href = res.url;
			}
			const data = await res.json();
			if (data.cityName) {
				return { city: data.cityName };
			}
		}
		return { err: "City Not Found" };
	} catch (error) {
		console.log(error.message);
		return { err: "Internal Server Error !" };
	}
};

postalCodes.forEach((p, i) => {
	p.addEventListener("focusout", async () => {
		const data = await getCityByPostalCode(p.value);
		if (data.city) {
			cities[i].value = data.city;
		} else {
			cities[i].value = "";
		}
		const addAddressModalFormValidator = $("#addAddressModalForm").validate();
		addAddressModalFormValidator.element("#" + cities[i].id);
	});
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

const editAddress = (data) => {
	updateAddressModalForm.querySelector("#UpdateStreetName").value = data.addressLine1;
	updateAddressModalForm.querySelector("#UpdateHouseNumber").value = data.addressLine2;
	updateAddressModalForm.querySelector("#UpdateCity").value = data.city;
	updateAddressModalForm.querySelector("#UpdatePostalCode").value = data.postalCode;
	updateAddressModalForm.querySelector("#UpdatePhoneNumber").value = data.phoneNumber;
	updateAddressModalForm.querySelector("#UpdateAddressId").value = data.addressId;
	updateAddressModal.show();
};

const makeAddressDefault = async (event, addressId) => {
	event.preventDefault();
	event.target.blur();
	setTimeout(async () => {
		try {
			const checkbox = document.querySelector("#address" + addressId);
			if (!checkbox.checked) {
				loading(true);
				const res = await fetch(`/Customer/MakeAddressDefault?addressId=${addressId}`, { method: "GET" });
				if (res.redirected) {
					window.location.href = res.url;
				}
				const data = await res.json();
				loading(false);
				if (data.success) {
					showToast("success", data.success);
					checkbox.checked = true;
				} else {
					showToast("danger", data.err);
				}
			} else {
				showToast("danger", "This is already your default address !");
			}
		} catch (error) {
			loading(false);
			console.log(error.message);
			showToast("danger", "Internal Server Error !");
		}
	}, 100);
};

const openDeleteAddressModal = (addressId) => {
	deleteAddressModalBtn.setAttribute("data-address-id", addressId);
	const checkbox = document.querySelector("#address" + addressId);
	if (checkbox.checked) {
		deleteAddressModalHtml.querySelector(".modal-body").classList.add("text-danger");
		deleteAddressModalHtml.querySelector(".modal-body").innerHTML =
			"To delete this address kindly change your default address to another address";
		deleteAddressModalBtn.classList.remove("d-inline-block");
		deleteAddressModalBtn.classList.add("d-none");
	} else {
		deleteAddressModalHtml.querySelector(".modal-body").classList.remove("text-danger");
		deleteAddressModalHtml.querySelector(".modal-body").innerHTML = "Are you sure you want to delete this address?";
		deleteAddressModalBtn.classList.remove("d-none");
		deleteAddressModalBtn.classList.add("d-inline-block");
	}
	deleteAddressModal.show();
};

deleteAddressModalBtn.addEventListener("click", async () => {
	try {
		const addressId = parseInt(deleteAddressModalBtn.getAttribute("data-address-id"));
		loading(true);
		const res = await fetch(`/Customer/DeleteAddress?addressId=${addressId}`, { method: "GET" });
		if (res.redirected) {
			window.location.href = res.url;
		}
		const data = await res.json();
		loading(false);
		deleteAddressModal.hide();
		if (data.success) {
			showToast("success", data.success);
			const tr = document.querySelector("#tr" + addressId);
			tr.remove();
		} else {
			showToast("danger", data.err);
		}
	} catch (error) {
		loading(false);
		deleteAddressModal.hide();
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
});

tab2Btn.addEventListener("show.bs.tab", async () => {
	try {
		loading(true);
		const res = await fetch("/Customer/GetAddresses");
		if (res.redirected) {
			window.location.href = res.url;
		}
		const jsonData = await res.json();
		loading(false);
		if (jsonData.length > 0) {
			tableBody.innerHTML = "";
			jsonData.forEach((a) => {
				tableBody.innerHTML += `
				<tr id="tr${a.addressId}">
					<td class="text-md-center text-start">
						<input 
						type="radio"
						name="UserAddresses"
						id="address${a.addressId}"
						class="form-check-input"
						role="button"
						onclick=makeAddressDefault(event,${a.addressId})
						${a.isDefault ? "checked" : ""}
						/>
						<label role="button" for="address${a.addressId}" class="ms-2 fw-bold d-inline-block d-md-none">Make this
							address default</label>
					</td>
					<td>
						<div class="addressline addressline1">
							<strong>Address:</strong> ${a.addressLine1} ${a.addressLine2}, ${a.postalCode} ${a.city}
						</div>
						<div class="addressline addressline2">
							<strong>Phone number:</strong> ${a.phoneNumber}
						</div>
					</td>
					<td class="text-md-center text-start">
						<div
							class="actions d-flex align-items-center justify-content-start justify-content-md-center flex-nowrap">
							<button onclick='editAddress(${JSON.stringify(a)})'
								class="editAddress d-flex align-items-center justify-content-center rounded-circle border-0 outline-0 bg-transparent"><img
									src="/images/edit-icon.png"></button>
							<button onclick=openDeleteAddressModal(${a.addressId})
								class="deleteAddress d-flex align-items-center justify-content-center rounded-circle border-0 outline-0 bg-transparent"><img
									src="/images/delete-icon.png"></button>
						</div>
					</td>
				</tr>
				`;
			});
		} else {
			tableBody.innerHTML = "There are no addresses ! <br/> Please Click button below to add some !";
		}
	} catch (err) {
		console.log(err.message);
	}
});

UpdateDetailsFormBtn.addEventListener("click", (e) => {
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
				submitForm();
			}
		} else {
			doberror.innerHTML = "Enter Valid Date !";
		}
	}
});

const submitForm = async () => {
	try {
		loading(true);
		const formData = new FormData(UpdateDetailsForm);
		const bodyData = {};
		bodyData.FirstName = formData.get("Details.FirstName");
		bodyData.LastName = formData.get("Details.LastName");
		bodyData.Day = parseInt(formData.get("Details.Day"));
		bodyData.Month = parseInt(formData.get("Details.Month"));
		bodyData.Year = parseInt(formData.get("Details.Year"));
		bodyData.Email = document.querySelector("#Details_Email").value;
		bodyData.Language = document.querySelector("#Details_Language").value;
		bodyData.PhoneNumber = formData.get("Details.PhoneNumber");
		const res = await fetch("/Customer/UpdateDetails", {
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
		if (data.success) {
			showToast("success", data.success);
		} else {
			showToast("danger", data.err);
		}
		loading(false);
	} catch (error) {
		loading(false);
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
};

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
				if (data.success) {
					showToast("success", data.success);
					ChangePasswordForm.reset();
				} else {
					showToast("danger", data.err);
				}
				loading(false);
			}
		}
	} catch (error) {
		loading(false);
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
});

addAddressModalBtn.addEventListener("click", async (e) => {
	try {
		const addAddressModalFormValidator = $("#addAddressModalForm").validate();
		if (addAddressModalFormValidator.form()) {
			e.preventDefault();
			e.preventDefault();
			const formData = new FormData(addAddressModalForm);
			const data = {};
			data.StreetName = formData.get("AddNewAddressViewModel.StreetName");
			data.PostalCode = formData.get("AddNewAddressViewModel.PostalCode");
			data.HouseNumber = formData.get("AddNewAddressViewModel.HouseNumber");
			data.PhoneNumber = formData.get("AddNewAddressViewModel.PhoneNumber");
			data.City = document.querySelector("#AddNewAddressViewModel_City").value;
			loading(true);
			const res = await fetch("/Customer/AddNewAddress", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (res.redirected) {
				window.location.href = res.url;
			}
			const jsonData = await res.json();
			loading(false);
			if (tableBody.innerHTML === "There are no addresses ! <br/> Please Click button below to add some !") {
				tableBody.innerHTML = "";
			}
			if (jsonData.addressId) {
				tableBody.innerHTML += `
				<tr id="tr${jsonData.addressId}">
					<td class="text-md-center text-start">
						<input 
						type="radio"
						name="UserAddresses"
						id="address${jsonData.addressId}"
						class="form-check-input"
						role="button"
						onclick=makeAddressDefault(event,${jsonData.addressId})
						/>
						<label role="button" for="address${jsonData.addressId}" class="ms-2 fw-bold d-inline-block d-md-none">Make this
							address default</label>
					</td>
					<td>
						<div class="addressline addressline1">
							<strong>Address:</strong> ${data.StreetName} ${data.HouseNumber}, ${data.PostalCode} ${data.City}
						</div>
						<div class="addressline addressline2">
							<strong>Phone number:</strong> ${data.PhoneNumber}
						</div>
					</td>
					<td class="text-md-center text-start">
						<div
							class="actions d-flex align-items-center justify-content-start justify-content-md-center flex-nowrap">
							<button onclick='editAddress(${JSON.stringify({
								addressId: jsonData.addressId,
								addressLine1: data.StreetName,
								addressLine2: data.HouseNumber,
								postalCode: data.PostalCode,
								phoneNumber: data.PhoneNumber,
								city: data.City,
								isDefault: false,
								isDeleted: false,
							})})'
								class="editAddress d-flex align-items-center justify-content-center rounded-circle border-0 outline-0 bg-transparent"><img
									src="/images/edit-icon.png"></button>
							<button onclick=openDeleteAddressModal(${jsonData.addressId})
								class="deleteAddress d-flex align-items-center justify-content-center rounded-circle border-0 outline-0 bg-transparent"><img
									src="/images/delete-icon.png"></button>
						</div>
					</td>
				</tr>
				`;
				addAddressModalFormValidator.resetForm();
				showToast("success", "Address Added Successfully !");
				addAddressModal.hide();
			} else {
				throw new Error();
			}
		}
	} catch (error) {
		loading(false);
		addAddressModal.hide();
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
});

updateAddressModalBtn.addEventListener("click", async (e) => {
	try {
		const updateAddressModalFormValidator = $("#updateAddressModalForm").validate();
		if (updateAddressModalFormValidator.form()) {
			e.preventDefault();
			const formData = new FormData(updateAddressModalForm);
			const data = {};
			data.AddressId = parseInt(updateAddressModalForm.querySelector("#UpdateAddressId").value);
			data.StreetName = formData.get("AddNewAddressViewModel.StreetName");
			data.HouseNumber = formData.get("AddNewAddressViewModel.HouseNumber");
			data.PhoneNumber = formData.get("AddNewAddressViewModel.PhoneNumber");
			data.City = formData.get("AddNewAddressViewModel.City");
			data.PostalCode = formData.get("AddNewAddressViewModel.PostalCode");
			loading(true);
			const res = await fetch("/Customer/UpdateAddress", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (res.redirected) {
				window.location.href = res.url;
			}
			const jsonData = await res.json();
			loading(false);
			updateAddressModal.hide();
			if (jsonData.success) {
				showToast("success", jsonData.success);
				const tr = tableBody.querySelector("#tr" + data.AddressId);
				tr.querySelector(
					".addressline1"
				).innerHTML = `<strong>Address:</strong> ${data.StreetName} ${data.HouseNumber}, ${data.PostalCode} ${data.City}`;
				tr.querySelector(".addressline2").innerHTML = `<strong>Phone number:</strong> ${data.PhoneNumber}`;
				tr.querySelector(".editAddress").setAttribute(
					"onclick",
					`editAddress({"addressId":${data.AddressId},"addressLine1":"${data.StreetName}","addressLine2":"${data.HouseNumber}","postalCode":"${data.PostalCode}","phoneNumber":"${data.PhoneNumber}","city":"${data.City}","isDefault":false,"isDeleted":false})`
				);
			} else {
				throw new Error(jsonData.err);
			}
		}
	} catch (error) {
		updateAddressModal.hide();
		loading(false);
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
});
