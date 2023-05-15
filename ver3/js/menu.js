const menus = [
    {
        menu: document.querySelector(".dashboard"),
        button: document.querySelector("[name=\"dashboard\"]"),
    },
    {
        default: true,
        menu: document.querySelector(".testing"),
        button: document.querySelector("[name=\"testing\"]"),
    },
    {
        menu: document.querySelector(".library"),
        button: document.querySelector("[name=\"library\"]"),
    },
    {
        menu: document.querySelector(".vocabulary_view"),
        button: undefined,
    },
    {
        menu: document.querySelector(".settings"),
        button: document.querySelector("[name=\"settings\"]"),
        update: () => settings_change()
    },
]

let INDEX_OF_TESTING = 1; // menus[1] -> testing

const hideAll = () => {
    for (const menu of menus) {
        menu.menu.classList.add("hidden");
        if (menu.update) menu.update();
    }
}

const unmarkAllButtons = () => {
    for (const menu of menus)
        if (menu.button) menu.button.classList.remove("menu__item__active");
}

hideAll();
unmarkAllButtons();

for (const menu of menus) {
    if (menu.default || MENU_VISUALLISATION) {
        if (menu.button) menu.button.classList.add("menu__item__active");
        menu.menu.classList.remove("hidden");
    }
    if (menu.button)
        menu.button.addEventListener("click", (event) => {
            event.preventDefault();
            hideAll();
            unmarkAllButtons();
            menu.menu.classList.remove("hidden");
            menu.button.classList.add("menu__item__active");
        });
}