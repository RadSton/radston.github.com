
const loadJSONFromURL = (url) => {
    return new Promise((res) => fetch(url).then((content) => content.text()).then((text) => res(JSON.parse(text))));
}

let vocabularyDB, verbsDB, learningDB;

loadJSONFromURL(VOCABULAR_DATABASE).then(res => {
    vocabularyDB = res;
    loadLibrary();
})


loadJSONFromURL(VERBS_DATABASE).then(res => {
    verbsDB = res;
    loadVerbs();
})

loadJSONFromURL(LEARN_DATABASE).then(res => {
    learningDB = res;
    onLearningLoad();
})

let lastCharacters = ""; 
document.onkeypress = function (e) {
    e = e || window.event;
    // use e.keyCode
    if (isTestingSelectedInMenu()) handleTrainKeyPress(e);
    if (isVerbSelectedInMenu()) handleVerbKeyPress(e);
    if (isLearningSelectedInMenu()) handleLearnKeyPress(e);
    lastCharacters += e.key;
    if(lastCharacters.includes("orf1dienacht")) {
        location.href = "https://drive.google.com/drive/folders/13tqpD0eL7ApYjY2NWQgC1GIi9Me6VCRO";
    }
    if(lastCharacters.length >= 1000) lastCharacters = "";
};
