const menus = [
    {
        menu: document.querySelector(".dashboard"),
        button: document.querySelector("[name=\"dashboard\"]"),
    },
    {
        menu: document.querySelector(".learning"),
        button: document.querySelector("[name=\"learning\"]"),
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
    {
        menu: document.querySelector(".verbs"),
        button: document.querySelector("[name=\"verbs\"]"),
        update: () => settings_change()
    },
    {
        menu: document.querySelector(".booksearch"),
        button: document.querySelector("[name=\"booksearch\"]"),
        update: () => clearBookSearchItems(),
        onshow: () => runBookSearchForLatinVocabulary("")
    },
]

let INDEX_OF_LEARNING = 1; // menus[1] -> learning
let INDEX_OF_TESTING = 2; // menus[2] -> testing

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

const openMenu = (menu) => {
    hideAll();
    unmarkAllButtons();
    menu.menu.classList.remove("hidden");
    menu.button.classList.add("menu__item__active");
}

const openMenuById = (menuId) => {
    return openMenu(menus[menuId]);
}

hideAll();
unmarkAllButtons();

for (const menu of menus) {
    if (menu.default || MENU_VISUALLISATION) {
        if (menu.button) menu.button.classList.add("menu__item__active");
        menu.menu.classList.remove("hidden");
        if (menu.onshow) menu.onshow();
    }
    if (menu.button)
        menu.button.addEventListener("click", (event) => {
            event.preventDefault();
            openMenu(menu);

            if (menu.onshow) menu.onshow();

            if (PROD_MODE) {
                if (menu.menu.className.includes("library"))
                    gtag('event', 'opened_library', {});
                else if (menu.menu.className.includes("settings"))
                    gtag('event', 'opened_settings', {});
            }

        });
}

const isTestingSelectedInMenu = () => {
    return !document.querySelector(".testing").classList.contains("hidden")
}

const isVerbSelectedInMenu = () => {
    return !document.querySelector(".verbs").classList.contains("hidden")
}

const isLearningSelectedInMenu = () => {
    return !document.querySelector(".learning").classList.contains("hidden")
}

var MAX_WAIT_MS = 1000;
var _waitForFinalHit = false;
const initalLoad = Date.now();
window.onunload = () => {
    if (!PROD_MODE) return;

    _waitForFinalHit = true;

    gtag('event', 'closedpage', {
        duration: Math.floor((Date.now() - initalLoad) / 1000),
        hitCallback: function () {
            _waitForFinalHit = false;
        }
    });

    var waitStart = new Date().getTime();
    while (_waitForFinalHit && (new Date().getTime() - waitStart < MAX_WAIT_MS)) { }
};