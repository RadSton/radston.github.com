
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

let lastCharacters = ""; 
document.onkeypress = function (e) {
    e = e || window.event;
    // use e.keyCode
    if (isTestingSelectedInMenu()) handleTrainKeyPress(e);
    if (isVerbSelectedInMenu()) handleVerbKeyPress(e);
    lastCharacters += e.key;
    if(lastCharacters.includes("orf1dienacht")) {
        location.href = "https://drive.google.com/drive/folders/13tqpD0eL7ApYjY2NWQgC1GIi9Me6VCRO";
    }
    console.log(lastCharacters);
};
