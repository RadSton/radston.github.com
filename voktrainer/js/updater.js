// RELEASE VERSION - changes
if (typeof PROD_MODE === 'undefined') {
    window.PROD_MODE = false;
    window.DEV = true;
} else
    window.DEV = false;
const VOCABULAR_DATABASE = "./db/data.json";
const VERBS_DATABASE = "./db/verbs.json";
const LEARN_DATABASE = "./db/learning.json";
const VERSION_NUMBER = "1.4-BETA";

// dev settings
const MENU_VISUALLISATION = false;

const VERSION_NAME = (DEV ? "dev-" : "") + VERSION_NUMBER;

