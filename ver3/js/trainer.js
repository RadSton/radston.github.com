const right = {
    name: document.querySelector("th[trainer=\"right\"]"),
    button: document.querySelector("td[trainer=\"right\"]")
}
const wrong = {
    name: document.querySelector("th[trainer=\"wrong\"]"),
    button: document.querySelector("td[trainer=\"wrong\"]")
}
const visible = {
    name: document.querySelector("th[trainer=\"visibility\"]"),
    button: document.querySelector("td[trainer=\"visibility\"]")
}

const awnserField = document.querySelector(".showing");

const UI = {
    vocset_name: document.querySelector('[trainer_ui="vocset_name"]'),
    vocset_cards: document.querySelector('[trainer_ui="vocset_cards"]'),
    vocset_learned: document.querySelector('[trainer_ui="vocset_learned"]'),
    vocset_right: document.querySelector('[trainer_ui="vocset_right"]'),
    vocset_wrong: document.querySelector('[trainer_ui="vocset_wrong"]'),
    vocset_percent: document.querySelector('[trainer_ui="vocset_percent"]'),
}

const questionField = document.querySelector(".question");

let currentButton;

const Button = {
    NONE: -1,
    SHOWAWNSERS: 0,
    AWNSERS: 1
}

const showButtons = (button) => {

    currentButton = button;

    visible.button.style.display = "none";
    visible.name.style.display = "none";
    right.button.style.display = "none";
    right.name.style.display = "none";
    wrong.button.style.display = "none";
    wrong.name.style.display = "none";

    if (button == Button.AWNSERS) {
        right.button.style.display = "table-cell";
        right.name.style.display = "table-cell";
        wrong.button.style.display = "table-cell";
        wrong.name.style.display = "table-cell";
    } else if (button == Button.SHOWAWNSERS) {
        visible.button.style.display = "table-cell";
        visible.name.style.display = "table-cell";
    }
}

let currentTraining = {
    set: [],
    wrongs: [],
    currentVocabular: undefined,
    stats: {
        setName: "none",
        gesamt: 0,
        trainedWords: 0,
        rightWords: 0,
        wrongWords: 0,
        percentage: 0,
    }
}

const onShowAwnser = (event) => {
    if (event) event.preventDefault();
    revealAwnser();
    showButtons(Button.AWNSERS);
}


const addAwnser = (awnser) => awnserField.innerHTML += "<hr><text>" + awnser + "</text>";
const clearAwnsers = () => awnserField.innerHTML = "";


showButtons(Button.NONE);

const mixArray = (array) => {
    let clone = [...array];
    let result = [];

    while (clone.length != 0) {
        const a = Math.floor(Math.random() * clone.length + 1) - 1;
        result.push(clone[a]);
        clone.splice(a, 1);
    }

    delete clone;

    return result;
}


const updateUi = () => {
    currentTraining.stats.percentage = Math.floor((currentTraining.stats.rightWords / (currentTraining.stats.rightWords + currentTraining.stats.wrongWords ))*100);
    if(!currentTraining.stats.percentage) currentTraining.stats.percentage = 0;
    // old Math.floor(((currentTraining.stats.gesamt - currentTraining.set.length) / currentTraining.stats.gesamt) * 100)
    UI.vocset_name.innerText = currentTraining.stats.setName;
    UI.vocset_cards.innerText = currentTraining.stats.gesamt;
    UI.vocset_learned.innerText = currentTraining.stats.gesamt - currentTraining.set.length;
    UI.vocset_right.innerText = currentTraining.stats.rightWords;
    UI.vocset_wrong.innerText = currentTraining.stats.wrongWords;
    UI.vocset_percent.innerText = currentTraining.stats.percentage + "%";
}

const showVocabularQuestion = () => {
    questionField.innerHTML = currentTraining.currentVocabular[0];
}

const clearStats = () => {
    currentTraining.stats.gesamt = currentTraining.set.length;
    currentTraining.stats.rightWords = 0;
    currentTraining.stats.wrongWords = 0;
}

const getNextVocabular = () => {
    if (!currentTraining.set) return false;
    if (currentTraining.set.length == 0 && currentTraining.wrongs.length == 0) return false;

    if (currentTraining.set.length == 0) {
        currentTraining.set = mixArray(currentTraining.wrongs);
        currentTraining.wrongs = [];
        clearStats();
    }

    currentTraining.currentVocabular = currentTraining.set.pop();
    showVocabularQuestion();
    clearAwnsers();
    showButtons(Button.SHOWAWNSERS)
    updateUi();
    return true;
}

const revealAwnser = () => {
    clearAwnsers();
    let index = 0;
    for (const iter of currentTraining.currentVocabular) {
        if (index != 0 && iter) addAwnser(iter);
        index++;
    }
}

const trainSet = (set, category, isCategory = false) => {
    currentTraining.set = mixArray(set.vocabulary);
    currentTraining.stats = {
        setName: category.name + (isCategory ? "/*" : "/" + set.name),
        gesamt: set.vocabulary.length,
        trainedWords: 0,
        rightWords: 0,
        wrongWords: 0,
        percentage: 100,
    }
    currentTraining.wrongs = [];
    getNextVocabular();
}

const handleAwnser = (good) => {
    return (event) => {
        if(event) event.preventDefault();
        if (good) currentTraining.stats.rightWords++;
        else {
            currentTraining.wrongs.push(currentTraining.currentVocabular);
            currentTraining.stats.wrongWords++;
        }
        if (!getNextVocabular()) {
            console.log("Done!");
            // Temporary solution: Refresh page TODO: Get more intelligent 
            clearStorage();
            window.location.href = window.location.href;
        } else saveProgress();
    }
}


visible.button.addEventListener("click", onShowAwnser);
right.button.addEventListener("click", handleAwnser(true));
wrong.button.addEventListener("click", handleAwnser(false));

document.onkeypress = function (e) {
    e = e || window.event;
    // use e.keyCode

    if (!isTestingSelectedInMenu()) return;
    if (currentButton == Button.AWNSERS) {
        switch (e.keyCode) {
            case 97: handleAwnser(true)(undefined); break;
            case 100: handleAwnser(false)(undefined); break;
            default: break;
        }
    } else if (currentButton == Button.SHOWAWNSERS) {
        switch (e.keyCode) {
            case 32:
            case 119:
                onShowAwnser();
            default: break;
        }
    }
};



// dev

const SAVE_NAME = "currentTraining";

const saveProgress = () => {
    localStorage.setItem(SAVE_NAME, JSON.stringify(currentTraining));
} 

const load = () => {
    const tempCurrentTraining = JSON.parse(localStorage.getItem(SAVE_NAME));
    if(!tempCurrentTraining) return;
    if(!tempCurrentTraining.set || !tempCurrentTraining.stats || !tempCurrentTraining.wrongs) return;

    console.log(tempCurrentTraining);

    currentTraining.set = mixArray(tempCurrentTraining.set);
    currentTraining.stats = tempCurrentTraining.stats;
    currentTraining.wrongs = tempCurrentTraining.wrongs;
    currentTraining.currentVocabular = tempCurrentTraining.currentVocabular;


    showVocabularQuestion();
    clearAwnsers();
    showButtons(Button.SHOWAWNSERS)
    updateUi();
}

const clearStorage = () => {
    localStorage.setItem(SAVE_NAME, undefined);
}

load();