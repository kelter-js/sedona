const menuToggleButton = document.querySelector(".main-nav__toggle");
const menuElement = document.querySelector(".main-nav");
const mapContainer = document.querySelector(".interest__map-container");
const staticMap = document.querySelector(".interest__map-wrapper");

menuElement.classList.remove("main-nav--withoutjs");

const onClickMenu = () => {
  menuElement.classList.toggle("main-nav--closed");
  menuElement.classList.toggle("main-nav--opened");
};

menuToggleButton.addEventListener("click", onClickMenu);

if (mapContainer && mapContainer.classList.contains("invisible")) {
  mapContainer.classList.toggle("invisible");
  staticMap.classList.toggle("invisible");
}
