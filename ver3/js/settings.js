const ROOT = document.querySelector(":root");

const CS = getComputedStyle(ROOT);

let COLOR_SETTINGS = [
    {
        cssVar: "--text-primary",
        element: document.querySelector("[setting=\"text_primary\"]"),
        current: "#cc81fd",
        default: "#cc81fd"
    },
    {
        cssVar: "--text-secondary",
        element: document.querySelector("[setting=\"text_sekundary\"]"),
        current: "#5c92ff",
        default: "#5c92ff"
    },
    {
        cssVar: "--bg-primary",
        element: document.querySelector("[setting=\"back_primary\"]"),
        current: "#000000",
        default: "#000000"
    },
    {
        cssVar: "--bg-secondary",
        element: document.querySelector("[setting=\"back_second\"]"),
        current: "#17141a",
        default: "#17141a"
    },
    {
        cssVar: "--bg-tertiary",
        element: document.querySelector("[setting=\"back_tertiary\"]"),
        current: "#121212",
        default: "#121212"
    },
    {
        cssVar: "--accent",
        element: document.querySelector("[setting=\"accent\"]"),
        current: "#707070",
        default: "#707070"
    }
];


const updateLocalStorage = (update = false) => {
    const stored = JSON.parse(localStorage.getItem("settings_colors"));
    if (!stored || update) {
        const toStore = {};

        for (const setting of COLOR_SETTINGS) {
            toStore[setting.cssVar] = setting.current;

        }

        localStorage.setItem("settings_colors", JSON.stringify(toStore));
        update = false;
    } else
        for (const setting of COLOR_SETTINGS) {
            setting.current = stored[setting.cssVar];
        }
}

try {
    updateLocalStorage();
} catch (e) {
    localStorage.clear();
    updateLocalStorage();
}



for (const setting of COLOR_SETTINGS) {

    setting.element.addEventListener("input", (elem) => {
        ROOT.style.setProperty(setting.cssVar, elem.target.value);
    });
}

const settings_change = () => {
    for (const setting of COLOR_SETTINGS) {
        ROOT.style.setProperty(setting.cssVar, setting.current);
        setting.element.value = CS.getPropertyValue(setting.cssVar);
    }

}

const save = () => {
    for (const setting of COLOR_SETTINGS) {
        setting.current = setting.element.value;
    }

    updateLocalStorage(true);
}

const reset = () => {
    for (const setting of COLOR_SETTINGS) {
        setting.current = setting.default;
    }
    settings_change();
    save();
}

document.querySelector("[button_id=\"settings_save\"]").addEventListener("click", save);
document.querySelector("[button_id=\"settings_reset\"]").addEventListener("click", reset);