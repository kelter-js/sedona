const MENU_TOGGLE_BUTTON = document.querySelector('.main-nav__toggle');
const MENU_ELEMENT = document.querySelector('.main-nav');

MENU_ELEMENT.classList.remove('main-nav--withoutjs');

const onClickMenu = () => {
  MENU_ELEMENT.classList.toggle('main-nav--closed');
  MENU_ELEMENT.classList.toggle('main-nav--opened');
}

MENU_TOGGLE_BUTTON.addEventListener('click', onClickMenu)
