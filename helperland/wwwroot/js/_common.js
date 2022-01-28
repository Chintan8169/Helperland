const hamburger = document.querySelector(".hamburger");
const halfPageBlack = document.querySelector(".halfPageBlack");
const navMenu = document.querySelector(".fullPage");

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("open");
	navMenu.classList.toggle("open");
});

halfPageBlack.addEventListener("click", () => hamburger.click());
