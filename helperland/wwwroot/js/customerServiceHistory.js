const tbody = document.querySelector("tbody");
const sortingButton = document.querySelector(".sortingButton");
const body = document.querySelector("body");
const toastHtml = document.querySelector(".toast");
const toastBody = toastHtml.querySelector(".toast-body");
const ratingModalHtml = document.querySelector("#ratingModal");
const ratingModalError = ratingModalHtml.querySelector(".ratingModalError");
const Comments = ratingModalHtml.querySelector("#Comments");
const submitRating = ratingModalHtml.querySelector("#submitRating");

const toast = bootstrap.Toast.getOrCreateInstance(toastHtml);
const ratingModal = bootstrap.Modal.getOrCreateInstance(ratingModalHtml);

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"serviceDate-pre": function (a) {
		let time = a
			.match(/<div class="timing">.*<\/div>/)[0]
			.replace(`<div class="timing">`, "")
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
	},
	buttons: ["excel"],
	columnDefs: [
		{ orderable: false, targets: 4 },
		{ type: "serviceDate", targets: 0 },
	],
});
$(".tableHeader").insertAfter(".dt-buttons");

sortingButton.addEventListener("click", () =>
	document
		.querySelectorAll("input[name='sortingRadio']")
		.forEach((radioBtn) =>
			radioBtn.addEventListener("click", () => dt.order([radioBtn.getAttribute("data-st-col"), radioBtn.getAttribute("data-st-type")]).draw())
		)
);

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

const openRatingModal = async (serviceId, serviceProviderId, serviceProviderName, avgRating, profilePic) => {
	try {
		if (serviceId && serviceProviderId) {
			ratingModalHtml.querySelector("img").src = `/images/${profilePic}`;
			ratingModalHtml.querySelector(".serviceProviderName").innerHTML = serviceProviderName;
			ratingModalHtml.querySelector(".avgRating").innerHTML = avgRating;
			ratingModalHtml.querySelector(".feedback .cover").style.width = (5 - parseFloat(avgRating)) * 20 + "%";
			body.classList.add("loading");
			const res = await fetch(`/Customer/IsRatingGiven?ServiceId=${serviceId}&ServiceProviderId=${serviceProviderId}`, { method: "GET" });
			if (res.redirected) {
				window.location.href = res.url;
			}
			const data = await res.json();
			body.classList.remove("loading");
			const onTimeArrivalRating = document.querySelector(".onTimeArrivalRating");
			const friendlyRating = document.querySelector(".friendlyRating");
			const qualityOfServiceRating = document.querySelector(".qualityOfServiceRating");
			const ratingDivs = [onTimeArrivalRating, friendlyRating, qualityOfServiceRating];
			if (data.success) {
				Comments.value = "";
				Comments.removeAttribute("readonly");
				ratingModalError.innerHTML = "";
				ratingDivs.forEach((ratingDiv) => {
					const stars = ratingDiv.querySelectorAll(".stars svg path");
					const cover = ratingDiv.querySelector(".cover");
					cover.style.width = "100%";
					const givenRating = ratingDiv.querySelector(".givenRating");
					givenRating.innerHTML = "0";
					stars.forEach((p, i) => {
						const $p = p;
						$($p).on("click", () => {
							cover.style.width = 100 - (i + 1) * 20 + "%";
							givenRating.innerHTML = i + 1;
							const friendlyR = parseInt(friendlyRating.querySelector(".givenRating").innerHTML);
							const onTimeArrivalR = parseInt(onTimeArrivalRating.querySelector(".givenRating").innerHTML);
							const qualityOfServiceR = parseInt(qualityOfServiceRating.querySelector(".givenRating").innerHTML);
							if (friendlyR > 0 && onTimeArrivalR > 0 && qualityOfServiceR > 0) {
								ratingModalError.innerHTML = "";
							}
						});
						$($p).on("mouseover", () => {
							cover.style.width = 100 - (i + 1) * 20 + "%";
						});
						$($p).on("mouseout", () => {
							cover.style.width = 100 - parseInt(givenRating.innerHTML) * 20 + "%";
						});
					});
				});
				const $submitRating = submitRating;
				$($submitRating).on("click", async () => {
					const friendlyR = parseInt(friendlyRating.querySelector(".givenRating").innerHTML);
					const onTimeArrivalR = parseInt(onTimeArrivalRating.querySelector(".givenRating").innerHTML);
					const qualityOfServiceR = parseInt(qualityOfServiceRating.querySelector(".givenRating").innerHTML);
					if (friendlyR > 0 && onTimeArrivalR > 0 && qualityOfServiceR > 0) {
						ratingModalError.innerHTML = "";
						const data = {
							FriendlyRating: friendlyR,
							OnTimeArrivalRating: onTimeArrivalR,
							QualityOfServiceRating: qualityOfServiceR,
							ServiceId: serviceId,
							ServiceProviderId: serviceProviderId,
						};
						if (Comments.value) {
							data.Comments = Comments.value;
						}
						body.classList.add("loading");
						const response = await fetch("/Customer/GiveRating", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(data),
						});
						if (response.redirected) {
							window.location.href = response.url;
						}
						const resJson = await response.json();
						body.classList.remove("loading");
						if (resJson.success) {
							ratingModal.hide();
							showToast("success", resJson.success);
							setTimeout(() => {
								window.location.reload();
							}, 3000);
						} else {
							showToast("danger", res.err);
						}
					} else {
						ratingModalError.innerHTML = "All Rating should greater than 0 !";
					}
				});
				ratingModal.show();
			} else {
				Comments.setAttribute("readonly", "true");
				if (data.err === true) {
					Comments.value = data.comments;
					ratingModalError.innerHTML = "Rating is already given by you !!";
					ratingModal.show();
					const strs = ["onTimeArrival", "friendly", "qualityOfService"];
					ratingDivs.forEach((ratingDiv, index) => {
						const stars = ratingDiv.querySelectorAll(".stars svg path");
						const cover = ratingDiv.querySelector(".cover");
						cover.style.width = (5 - data[strs[index]]) * 20 + "%";
						const givenRating = ratingDiv.querySelector(".givenRating");
						givenRating.innerHTML = data[strs[index]];
						stars.forEach((p) => {
							const $p = p;
							$($p).unbind("click");
							$($p).unbind("mouseover");
							$($p).unbind("mouseout");
						});
					});
				} else {
					showToast("danger", data.err);
				}
			}
		}
	} catch (error) {
		body.classList.remove("loading");
		console.log(error.message);
		showToast("danger", "Internal Server Error !");
	}
};
