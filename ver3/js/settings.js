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


const updateLocalStorageSettingColors = (update = false) => {
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
    updateLocalStorageSettingColors();
} catch (e) {
    localStorage.clear();
    updateLocalStorageSettingColors();
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



// save

document.querySelector("[setting=save1_save]").addEventListener("click", (e) => {
    const backup = e.target.innerHTML;
    saveProgress("save1");
    e.target.innerHTML += " (Success!)"
    setTimeout((back, target) => { target.innerHTML = back; }, 1000, backup, e.target)
});
document.querySelector("[setting=save1_read]").addEventListener("click", (e) => {
    const backup = e.target.innerHTML;
    if (localStorage.getItem("save1") != 'undefined' && localStorage.getItem("save1").length > 2) {
        load("save1");
        e.target.innerHTML += " (Success!)"
        setTimeout((back, target) => { target.innerHTML = back; }, 1000, backup, e.target)
    } else {
        e.target.innerHTML += " (ERROR: Not found)"
        setTimeout((back, target) => { target.innerHTML = back; }, 1000, backup, e.target)
    }
});
document.querySelector("[setting=save1_delete]").addEventListener("click", (e) => {
    clearStorage("save1");
    const backup = e.target.innerHTML;
    e.target.innerHTML += " (Success!)"
    setTimeout((back, target) => { target.innerHTML = back; }, 1000, backup, e.target)
});





const save = () => {
    for (const setting of COLOR_SETTINGS) {
        setting.current = setting.element.value;
    }

    updateLocalStorageSettingColors(true);
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






