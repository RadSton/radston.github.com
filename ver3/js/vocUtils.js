
const loadJSONFromURL = (url) => {
    return new Promise((res) => fetch(url).then((content) => content.text()).then((text) => res(JSON.parse(text))));
}

let vocabularyDB, verbsDB;

loadJSONFromURL(VOCABULAR_DATABASE).then(res => {
    vocabularyDB = res;
    loadLibrary();
})


loadJSONFromURL(VERBS_DATABASE).then(res => {
    verbsDB = res;
    loadVerbs();
})


document.onkeypress = function (e) {
    e = e || window.event;
    // use e.keyCode
    if (isTestingSelectedInMenu()) handleTrainKeyPress(e);
    if (isVerbSelectedInMenu()) handleVerbKeyPress(e);
};
