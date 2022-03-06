const nowDate = new Date();
if (nowDate.getHours() >= 18 && nowDate.getMinutes() > 0) {
	nowDate.setDate(nowDate.getDate() + 1);
}

$("#bookServiceSubmitViewModel_ServiceDate").datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true,
	minDate: nowDate,
	showAnim: "slideDown",
	dateFormat: "dd/mm/yy",
});

$("#bookServiceSubmitViewModel_ServiceDate").datepicker("setDate", nowDate);
const body = document.querySelector("body");
const successModalHtml = document.querySelector("#successModal");
const successModal = new bootstrap.Modal(successModalHtml);
const tab1Btn = document.querySelector(".nav > button:nth-child(1)");
const tab2Btn = document.querySelector(".nav > button:nth-child(2)");
const tab3Btn = document.querySelector(".nav > button:nth-child(3)");
const tab4Btn = document.querySelector(".nav > button:nth-child(4)");
const addresses = document.querySelector(".addresses");
const PostalCode = document.querySelector("#addNewAddressViewModel_PostalCode");
const City = document.querySelector("#addNewAddressViewModel_City");
const save = document.querySelector(".save");
const extraServiceContainer = document.querySelector(".extraServiceContainer");
const checkAvailabilityBtn = document.querySelector(".checkAvailabilityBtn");
const totalServiceTime = document.querySelector(".totalServiceTime .fw-bold:nth-child(2)");
const totalPayment = document.querySelector(".totalPayment .fw-bold");
const yourDetailsBtn = document.querySelector(".yourDetailsBtn");
const scheduleAndPlanFormBtn = document.querySelector("#scheduleAndPlanFormBtn");
const ZipCodeForm = document.querySelector("#ZipCodeForm");
const scheduleAndPlanForm = document.querySelector("#scheduleAndPlanForm");
const addNewAddressForm = document.querySelector("#addNewAddressForm");
const ZipCode = document.querySelector("#bookServiceSubmitViewModel_ZipCode");
const ServiceDate = document.querySelector("#bookServiceSubmitViewModel_ServiceDate");
const ServiceStartTime = document.querySelector("#bookServiceSubmitViewModel_ServiceStartTime");
const serviceDateAndTimeSummaryDate = document.querySelector("#serviceDateAndTimeSummaryDate");
const serviceDateAndTimeSummaryTime = document.querySelector("#serviceDateAndTimeSummaryTime");
const ServiceBasicHours = document.querySelector("#bookServiceSubmitViewModel_ServiceBasicHours");
const ServiceBasicHoursText = document.querySelector("#ServiceBasicHoursText");
const extraServicesCheckBoxs = document.querySelectorAll(".extraServicesCheckBox");
const ServiceBasicHoursError = document.querySelector("#ServiceBasicHoursError");
const selectedCheckBoxs = [];
const tab1 = bootstrap.Tab.getOrCreateInstance(tab1Btn);
const tab2 = bootstrap.Tab.getOrCreateInstance(tab2Btn);
const tab3 = bootstrap.Tab.getOrCreateInstance(tab3Btn);
const tab4 = bootstrap.Tab.getOrCreateInstance(tab4Btn);

const tabsBtns = [tab1Btn, tab2Btn, tab3Btn, tab4Btn];
const handleTabsClick = (tabNumber) => {
	for (let i = tabNumber; i < tabsBtns.length; i++) {
		tabsBtns[i].setAttribute("disabled", "disabled");
		tabsBtns[i].classList.remove("completed");
	}
};
tabsBtns.forEach((tab, index) => {
	tab.addEventListener("click", () => {
		handleTabsClick(index + 1);
	});
});

checkAvailabilityBtn.addEventListener("click", async (e) => {
	try {
		const zipCodeValidator = $("#ZipCodeForm").validate();
		if (zipCodeValidator.form()) {
			e.preventDefault();
			const isZipCodeValid = zipCodeValidator.element("#bookServiceSubmitViewModel_ZipCode");
			if (isZipCodeValid) {
				document.querySelector("#checkAvailbilityError").innerHTML = "";
				body.classList.add("loading");
				const res = await fetch(`/Customer/CheckAvailability?ZipCode=${ZipCode.value}`, { method: "GET" });
				if (res.redirected) {
					window.location.href = res.url;
				}
				const jsonData = await res.json();
				body.classList.remove("loading");
				if (jsonData.cityName) {
					PostalCode.value = ZipCode.value;
					City.value = jsonData.cityName;
					tab1Btn.removeAttribute("disabled");
					tab1Btn.classList.add("completed");
					tab2.show();
				} else {
					document.querySelector("#checkAvailbilityError").innerHTML =
						"We are not providing service in this area. We’ll notify you if any helper would start working near your area.";
				}
			}
		}
	} catch (err) {
		body.classList.remove("loading");
		document.querySelector("#checkAvailbilityError").innerHTML = "Internal Server Error !";
	}
});
ZipCodeForm.addEventListener("submit", (e) => {
	const zipCodeValidator = $("#ZipCodeForm").validate();
	if (zipCodeValidator.form()) {
		e.preventDefault();
		checkAvailabilityBtn.click();
	}
});

if (ServiceDate.value.trim() === "") serviceDateAndTimeSummaryDate.innerHTML = "No Date Selected";
else serviceDateAndTimeSummaryDate.innerHTML = ServiceDate.value;

if (ServiceStartTime.value.trim() === "") serviceDateAndTimeSummaryTime.innerHTML = "";
else serviceDateAndTimeSummaryTime.innerHTML = ServiceStartTime.options[ServiceStartTime.options.selectedIndex].innerHTML;

if (ServiceBasicHours.value.trim() === "") ServiceBasicHoursText.innerHTML = "";
else {
	ServiceBasicHoursText.innerHTML = ServiceBasicHours.options[ServiceBasicHours.options.selectedIndex].innerHTML;
	totalServiceTime.innerHTML = `${parseFloat(ServiceBasicHours.options[ServiceBasicHours.options.selectedIndex].value)} Hrs.`;
}

const calculateTotalPrice = () => (totalPayment.innerHTML = parseFloat(totalServiceTime.innerHTML.replace(" Hrs.")) * 18 + " €");

const checkExtremeHours = () => {
	if (parseFloat(totalServiceTime.innerHTML.replace(" Hrs.")) + parseFloat(ServiceStartTime.value) > 21) {
		ServiceBasicHoursError.innerHTML = "Service Time Should not increased than 21:00 !";
		return false;
	} else {
		ServiceBasicHoursError.innerHTML = "";
		return true;
	}
};

const checkTimeIsPassed = () => {
	const now = new Date();
	const selectedDate = $("#bookServiceSubmitViewModel_ServiceDate").datepicker("getDate");
	if (
		now.getTime() >= selectedDate.getTime() &&
		parseFloat(ServiceStartTime.options[ServiceStartTime.options.selectedIndex].value) < now.getHours()
	) {
		document.querySelector(".ServiceStartTimeError").innerHTML = "This time is passed";
		return true;
	}
	document.querySelector(".ServiceStartTimeError").innerHTML = "";
	return false;
};

calculateTotalPrice();
ServiceDate.onchange = () => {
	const scheduleAndPlanFormValidator = $("#scheduleAndPlanForm").validate();
	scheduleAndPlanFormValidator.element("#bookServiceSubmitViewModel_ServiceDate");
	if (ServiceDate.value.trim() === "") serviceDateAndTimeSummaryDate.innerHTML = "No Date Selected";
	else serviceDateAndTimeSummaryDate.innerHTML = ServiceDate.value;
	checkTimeIsPassed();
};

ServiceStartTime.onchange = () => {
	checkTimeIsPassed();
	serviceDateAndTimeSummaryTime.innerHTML = ServiceStartTime.options[ServiceStartTime.options.selectedIndex].innerHTML;
	checkExtremeHours();
};

ServiceBasicHours.onchange = () => {
	if (ServiceBasicHours.value.trim() === "") ServiceBasicHoursText.innerHTML = "";
	else {
		if (totalServiceTime.innerHTML != "0 Hrs.") {
			totalServiceTime.innerHTML = `${
				parseFloat(totalServiceTime.innerHTML.replace(" Hrs.")) - parseFloat(ServiceBasicHoursText.innerHTML.replace(" Hrs."))
			} Hrs.`;
		}
		ServiceBasicHoursText.innerHTML = ServiceBasicHours.options[ServiceBasicHours.options.selectedIndex].innerHTML;
		totalServiceTime.innerHTML = `${
			parseFloat(totalServiceTime.innerHTML.replace(" Hrs.")) +
			parseFloat(ServiceBasicHours.options[ServiceBasicHours.options.selectedIndex].value)
		} Hrs.`;
	}
	calculateTotalPrice();
	checkExtremeHours();
};

scheduleAndPlanFormBtn.addEventListener("click", async (e) => {
	try {
		const scheduleAndPlanFormValidator = $("#scheduleAndPlanForm").validate();
		e.preventDefault();
		if (checkExtremeHours() && scheduleAndPlanFormValidator.form() && !checkTimeIsPassed()) {
			body.classList.add("loading");
			const res = await fetch(`/Customer/GetAddresses?ZipCode=${ZipCode.value}`, { method: "GET" });
			if (res.redirected) {
				window.location.href = res.url;
			}
			const adds = await res.json();
			body.classList.remove("loading");
			if (adds.length > 0) {
				addresses.innerHTML = "";
				adds.forEach((a) => {
					addresses.innerHTML += `
					<label
						class="addressLabel d-flex align-items-center justify-content-start py-2 py-md-3 px-2 px-md-3 mb-2 mb-md-3 form-check"
						for="address${a.addressId}">
						<input class="form-check-input mx-0" type="radio" name="addressRadio" id="address${a.addressId}" data-addressid="${a.addressId}" ${
						a.isDefault ? "checked" : ""
					}/>
						<div class="form-check-label">
							<div class="address"><strong>Address:</strong> ${a.addressLine1} ${a.addressLine2}, ${a.city} ${a.postalCode}</div>
							<div class="phoneNumber"><strong>Phone Number:</strong> ${a.phoneNumber}</div>
						</div>
					</label>
					`;
				});
			} else {
				addresses.innerHTML = "There Are No Addresses.Please Add Some !";
			}
			document.querySelector("#tab3Error").innerHTML = "";
			tab2Btn.removeAttribute("disabled");
			tab2Btn.classList.add("completed");
			tab3.show();
		}
		document.querySelector(".scheduleAndPlanFormError").innerHTML = "";
	} catch (err) {
		document.querySelector(".scheduleAndPlanFormError").innerHTML = "Internal Server Error !";
	}
});

scheduleAndPlanForm.addEventListener("submit", (e) => {
	const scheduleAndPlanFormValidator = $("#scheduleAndPlanForm").validate();
	if (scheduleAndPlanFormValidator.form()) {
		e.preventDefault();
		scheduleAndPlanFormBtn.click();
	}
});

yourDetailsBtn.addEventListener("click", () => {
	const addressCheckboxes = document.querySelectorAll("input[name='addressRadio'");
	if (addressCheckboxes.length > 0) {
		let anyAddressChecked = false;
		for (let index = 0; index < addressCheckboxes.length; index++) {
			const element = addressCheckboxes[index];
			element.addEventListener("click", () => {
				document.querySelector("#tab3Error").innerHTML = "";
			});
			if (element.checked) {
				anyAddressChecked = true;
			}
		}
		if (anyAddressChecked) {
			tab3Btn.removeAttribute("disabled");
			tab3Btn.classList.add("completed");
			tab4.show();
		} else {
			document.querySelector("#tab3Error").innerHTML = "No Address is selected ! Please Select any one !";
		}
	}
});

save.addEventListener("click", async (e) => {
	try {
		const addNewAddressFormValidator = $("#addNewAddressForm").validate();
		if (addNewAddressFormValidator.form()) {
			e.preventDefault();
			const formData = new FormData(addNewAddressForm);
			const data = {};
			data.StreetName = formData.get("addNewAddressViewModel.StreetName");
			data.PostalCode = PostalCode.value;
			data.HouseNumber = formData.get("addNewAddressViewModel.HouseNumber");
			data.PhoneNumber = formData.get("addNewAddressViewModel.PhoneNumber");
			data.City = City.value;
			body.classList.add("loading");
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
			body.classList.remove("loading");
			if (addresses.innerHTML === "There Are No Addresses.Please Add Some !") {
				addresses.innerHTML = "";
			}
			if (jsonData.addressId) {
				document.querySelector("#tab3Error").innerHTML = "";
				addresses.innerHTML += `<label
			class="addressLabel d-flex align-items-center justify-content-start py-2 py-md-3 px-2 px-md-3 mb-2 mb-md-3 form-check"
			for="address${jsonData.addressId}">
			<input class="form-check-input mx-0" type="radio" name="addressRadio" id="address${jsonData.addressId}" data-addressid="${jsonData.addressId}"/>
			<div class="form-check-label">
				<div class="address"><strong>Address:</strong> ${data.StreetName} ${data.HouseNumber}, ${data.City} ${data.PostalCode}</div>
				<div class="phoneNumber"><strong>Phone Number:</strong> ${data.PhoneNumber}</div>
			</div>
		</label>`;
				addNewAddressForm.querySelector("#addNewAddressViewModel_StreetName").value = "";
				addNewAddressForm.querySelector("#addNewAddressViewModel_HouseNumber").value = "";
				addNewAddressForm.querySelector("#addNewAddressViewModel_PhoneNumber").value = "";
			} else {
				throw new Error();
			}
		}
	} catch (err) {
		document.querySelector("#tab3Error").innerHTML = "Internal Server Error !";
	}
});

const generateExtraServices = () => {
	extraServiceContainer.innerHTML = "";
	if (selectedCheckBoxs.length > 0) {
		extraServiceContainer.innerHTML = `<div class="summaryHeader">Extras</div>`;
		selectedCheckBoxs.forEach((selectedCheckBox) => {
			extraServiceContainer.innerHTML += `
			<div class="serviceIndividualTime d-flex align-items-center justify-content-between">
			<span>${selectedCheckBox.text}</span>
			<span>30 Min.</span>
			</div>
			`;
		});
	}
};

extraServicesCheckBoxs.forEach((extraServicesCheckBox, index) => {
	extraServicesCheckBox.addEventListener("click", () => {
		if (selectedCheckBoxs.length > 0) {
			if (!extraServicesCheckBox.checked) {
				const i = selectedCheckBoxs.findIndex((s) => s.index === index + 1);
				if (i >= 0) selectedCheckBoxs.splice(i, 1);
				totalServiceTime.innerHTML = `${parseFloat(totalServiceTime.innerHTML.replace(" Hrs.")) - 0.5} Hrs.`;
			} else {
				selectedCheckBoxs.push({ index: index + 1, text: extraServicesCheckBox.getAttribute("data-extra-service-name") });
				totalServiceTime.innerHTML = `${parseFloat(totalServiceTime.innerHTML.replace(" Hrs.")) + 0.5} Hrs.`;
			}
		} else {
			selectedCheckBoxs.push({ index: index + 1, text: extraServicesCheckBox.getAttribute("data-extra-service-name") });
			totalServiceTime.innerHTML = `${parseFloat(totalServiceTime.innerHTML.replace(" Hrs.")) + 0.5} Hrs.`;
		}
		generateExtraServices();
		calculateTotalPrice();
	});
});

document.querySelector("#bookService").addEventListener("click", async () => {
	try {
		const data = {};
		data.ZipCode = ZipCode.value;
		data.ServiceDate = ServiceDate.value;
		data.ServiceStartTime = ServiceStartTime.value;
		data.ServiceBasicHours = ServiceBasicHours.value;
		if (selectedCheckBoxs.length > 0) {
			data.ExtraServices = [];
			selectedCheckBoxs.forEach((s) => data.ExtraServices.push(s.index));
		}
		if (document.querySelector("#bookServiceSubmitViewModel_Comments").value) {
			data.Comments = document.querySelector("#bookServiceSubmitViewModel_Comments").value;
		}
		data.HasPets = document.querySelector("#bookServiceSubmitViewModel_HasPets").checked;
		const addressCheckboxes = document.querySelectorAll("input[name='addressRadio'");
		for (let i = 0; i < addressCheckboxes.length; i++) {
			if (addressCheckboxes[i].checked) {
				data.AddressId = parseInt(addressCheckboxes[i].getAttribute("data-addressid"));
				break;
			}
		}
		body.classList.add("loading");
		const res = await fetch("/Customer/BookService", {
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
		body.classList.remove("loading");
		if (jsonData.serviceId) {
			let str = "";
			if (selectedCheckBoxs.length > 0) {
				selectedCheckBoxs.forEach((c, i) => {
					str += i != selectedCheckBoxs.length - 1 ? c.text + ", " : c.text;
				});
			} else {
				str = "No Extra Service Selected";
			}
			successModalHtml.querySelector(".modal-body").innerHTML = `
			<div>Service Id = ${jsonData.serviceId}</div>
			<div>Service Date = ${ServiceDate.value} ${ServiceStartTime.value}</div>
			<div>Extra Services = ${str}</div>
			<div>Total Payment = ${totalPayment.innerHTML}</div>
			`;
			successModal.show();
			document.querySelector(".bookServiceErr").innerHTML = "";
		} else {
			throw new Error();
		}
	} catch (err) {
		document.querySelector(".bookServiceErr").innerHTML = "Internal Server Error !";
	}
});
