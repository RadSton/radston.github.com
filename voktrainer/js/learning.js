let LEARNING = {
    ButtonObjects: {
        PERFECT: {
            name: document.querySelector("th[learning_text=\"perfect\"]"),
            button: document.querySelector("td[learning_button=\"perfect\"]")
        },
        HARDLY: {
            name: document.querySelector("th[learning_text=\"hardly\"]"),
            button: document.querySelector("td[learning_button=\"hardly\"]")
        },
        BLACKOUT: {
            name: document.querySelector("th[learning_text=\"blackout\"]"),
            button: document.querySelector("td[learning_button=\"blackout\"]")
        },
        REVEAL: {
            name: document.querySelector("th[learning_text=\"reveal\"]"),
            button: document.querySelector("td[learning_button=\"reveal\"]")
        },
        REMEMBER: {
            name: document.querySelector("th[learning_text=\"remember\"]"),
            button: document.querySelector("td[learning_button=\"remember\"]"),
            icon: document.querySelector('td[learning_button=\"remember\"] > i')
        }
    },
    CurrentButton: Button.NONE,
    Question: {
        obj: document.querySelector(".learning_question"),
        sub: document.querySelector(".learning_question > .subquestion"),
        question: document.querySelector(".learning_question > .question"),
        showing: document.querySelector(".learning_question > .showing"),
    },
    UI: {
        toRevise: document.querySelector('[learning_ui="toRevise"]'),
        toLearn: document.querySelector('[learning_ui="toLearn"]'),
        learned: document.querySelector('[learning_ui="learned"]'),
        percent: document.querySelector('[learning_ui="percent"]')
    },
    Data: {
        currentVocabular: {
            vocab: [],
            id: -1,
            interval: 0,
            repetitions: 0,
            easeFactor: 2.5
        },
        vocabularyData: {
            201: [0, 0, 2.5, Date.now()]
        },
        tempEntries: [],
        tempSorted: {},
        statistics: {
            toRevise: -1,
            toLeran: -1,
            learned: -1
        }
    },
    Timeouts: {
        onLoad: -1,
        started: -1,
        took: -1,
    }
}

const hideLearningButtons = () => {
    for (const [, elements] of Object.entries(LEARNING.ButtonObjects)) {
        elements.button.style.display = "none";
        elements.name.style.display = "none";
    }
}

const setLearningButton = (button, state) => {
    button.button.style.display = (state ? "table-cell" : "none")
    button.name.style.display = (state ? "table-cell" : "none")
}

const showLearningButtons = (button) => {

    LEARNING.CurrentButton = button;

    hideLearningButtons();

    if (button == Button.SHOWAWNSERS) {
        setLearningButton(LEARNING.ButtonObjects.REVEAL, true)
        return;
    }

    setLearningButton(LEARNING.ButtonObjects.BLACKOUT, true)
    setLearningButton(LEARNING.ButtonObjects.HARDLY, true)
    setLearningButton(LEARNING.ButtonObjects.PERFECT, true)
    setLearningButton(LEARNING.ButtonObjects.REMEMBER, true)

}

const onShowLearningAwnser = (event) => {
    if (event) event.preventDefault();
    revealLearningAwnser();
    showLearningButtons(Button.AWNSERS);

}


const addLearningAwnser = (awnser) => LEARNING.Question.showing.innerHTML += "<hr><text>" + awnser + "</text>";
const showLearningQuestion = (question) => LEARNING.Question.question.innerHTML = question;
const clearLearningAwnsers = () => LEARNING.Question.showing.innerHTML = "";

const getRandomVocabulary = () => {
    // TODO: Make more efficient [LEAST IMPORTANT]

    LEARNING.Data.tempSorted = {};

    let highestKey = -1;

    let sorted = [];

    for (const [key, val] of Object.entries(LEARNING.Data.vocabularyData)) {
        const sortedKey = Math.floor(val[0]);

        if (!LEARNING.Data.tempSorted[sortedKey]) LEARNING.Data.tempSorted[sortedKey] = [];
        LEARNING.Data.tempSorted[sortedKey].push(key);

        if (sortedKey > highestKey) highestKey = sortedKey;
    }


    for (let i = 0; i <= highestKey; i++) {
        if (!LEARNING.Data.tempSorted[i]) continue;

        sorted.push(LEARNING.Data.tempSorted[i]);
    }

    const firstSortedLen = sorted[0].length;
    const random = Math.floor(Math.random() * firstSortedLen);

    const ID = sorted[0][random];

    return {
        vocab: learningDB[ID],
        id: Number.parseInt(ID),
        interval: LEARNING.Data.vocabularyData[ID][0],
        repetitions: LEARNING.Data.vocabularyData[ID][1],
        easeFactor: LEARNING.Data.vocabularyData[ID][2]
    }
}

const updateLearningUi = () => {

    LEARNING.Data.statistics = {
        toRevise: 0,
        toLearn: 0,
        learned: 0
    }

    const DAY_MULTIPLYER = 86400;
    const CURRENT_DATE = Date.now();

    for (const entry of LEARNING.Data.tempEntries) {
        const [interval, , , date] = LEARNING.Data.vocabularyData[entry];

        if ((interval * DAY_MULTIPLYER) == 0) {
            LEARNING.Data.statistics.toLearn++;
            continue;
        }

        if (((interval * DAY_MULTIPLYER) + date) < CURRENT_DATE) {
            LEARNING.Data.statistics.toRevise++;
        } else
            LEARNING.Data.statistics.learned++;
    }

    const percent = Math.floor((LEARNING.Data.statistics.learned / LEARNING.Data.tempEntries.length) * 1000) / 10

    LEARNING.UI.toRevise.innerHTML = LEARNING.Data.statistics.toRevise;
    LEARNING.UI.toLearn.innerHTML = LEARNING.Data.statistics.toLearn;
    LEARNING.UI.learned.innerHTML = LEARNING.Data.statistics.learned;
    LEARNING.UI.percent.innerHTML = percent + "%";

}

const generateDefaultVocabularyData = () => {
    if (!learningDB) return;
    if (!LEARNING.Data.vocabularyData) return;

    LEARNING.Data.tempEntries = [];

    for (const [key, val] of Object.entries(learningDB)) {
        if (val[0].startsWith("##")) continue; // TODO: Make more efficient [LEAST PRIORITY (0.3 ms)]

        if (!LEARNING.Data.vocabularyData[key])
            LEARNING.Data.vocabularyData[key] = [0, 0, 2.5, Date.now()];

        LEARNING.Data.tempEntries.push(key);
    }
}


const showVocabularLearningQuestion = () => {
    LEARNING.Question.question.innerHTML = "troll";
}


const revealLearningAwnser = () => {
    LEARNING.Timeouts.took = (Date.now() - LEARNING.Timeouts.started) / 1000;

    clearLearningAwnsers();
    let index = 0;
    for (const iter of getLearningVocab()) {
        if (index != 0 && iter && iter.length >= 2) addLearningAwnser(iter);
        index++;
    }
    if (isRemeberd(getLearningVocab()))
        LEARNING.ButtonObjects.REMEMBER.icon.innerHTML = "star";
    else
        LEARNING.ButtonObjects.REMEMBER.icon.innerHTML = "star_border";
}



const handleLearningAwnser = (button) => {

    let stage = 0, took = LEARNING.Timeouts.took;

    if (button == "perfect") {
        if (took >= 15)
            stage = 4
        else
            stage = 5;
    } else if (button == "hardly") {
        if (took >= 15)
            stage = 2
        else
            stage = 3;
    } else if (button == "blackout" && took >= 25)
        stage = 1;

    const res = calcSM2(stage, LEARNING.Data.currentVocabular.interval, LEARNING.Data.currentVocabular.repetitions, LEARNING.Data.currentVocabular.easeFactor);

    const ID = LEARNING.Data.currentVocabular.id;

    LEARNING.Data.vocabularyData[ID] = [res.interval, res.repetitions, res.easeFactor, Date.now()];

    saveLearningStorage();

    updateLearningToNextVocab();
}

const getLearningVocab = () => {
    return LEARNING.Data.currentVocabular.vocab;
}

const updateLearningToNextVocab = () => {
    clearLearningAwnsers();

    LEARNING.Data.currentVocabular = getRandomVocabulary();
    updateLearningUi();

    showLearningButtons(Button.SHOWAWNSERS);

    LEARNING.Timeouts.started = Date.now();

    showLearningQuestion(LEARNING.Data.currentVocabular.vocab[0]);
}

const addLearningAwnserHandler = (obj, button) => {
    const handler = (event) => {
        event.preventDefault();
        handleLearningAwnser(button);
    };

    obj.button.addEventListener("click", handler);
    obj.name.addEventListener("click", handler);
}

const initLearning = () => {
    initRemember(LEARNING.ButtonObjects.REMEMBER.button, revealLearningAwnser, getLearningVocab);
    initRemember(LEARNING.ButtonObjects.REMEMBER.name, revealLearningAwnser, getLearningVocab);

    loadLearningStorage();

    showLearningButtons(Button.SHOWAWNSERS);

    LEARNING.ButtonObjects.REVEAL.button.addEventListener("click", onShowLearningAwnser);
    LEARNING.ButtonObjects.REVEAL.name.addEventListener("click", onShowLearningAwnser);

    addLearningAwnserHandler(LEARNING.ButtonObjects.BLACKOUT, "blackout");
    addLearningAwnserHandler(LEARNING.ButtonObjects.HARDLY, "hardly");
    addLearningAwnserHandler(LEARNING.ButtonObjects.PERFECT, "perfect");

    LEARNING.Timeouts.onLoad = setTimeout(onLearningLoad, 350);
}

const onLearningLoad = () => {
    try {
        clearTimeout(LEARNING.Timeouts.onLoad);
    } catch (e) { }

    generateDefaultVocabularyData();
    updateLearningToNextVocab();
}

const handleLearnKeyPress = (e) => {
    if (LEARNING.CurrentButton == Button.AWNSERS) {
        if (e.keyCode == 97) handleLearningAwnser("perfect");
        if (e.keyCode == 115) handleLearningAwnser("hardly");
        if (e.keyCode == 100) handleLearningAwnser("blackout");
    } else if (LEARNING.CurrentButton == Button.SHOWAWNSERS) {
        if (e.keyCode == 119) onShowLearningAwnser();
    }
};


const saveLearningStorage = (save = "LEARNING") => {
    localStorage.setItem(save, JSON.stringify(LEARNING.Data.vocabularyData));
}

const loadLearningStorage = (save = "LEARNING") => {
    const temp = JSON.parse(localStorage.getItem(save));
    if (!temp) return;

    LEARNING.Data.vocabularyData = temp;
}

const clearLearningStorage = (save = "LEARNING") => {
    clearStorage(save);
}


initLearning();

/* MAYBE NOT NEEDED:

const updateEntries = () => {
    LEARNING.Data.tempEntries = [];

    for (const [key,] of Object.entries(LEARNING.Data.vocabularyData)) {
        LEARNING.Data.tempEntries.push(key);
    }

}

const resetLearning = () => {
    clearAwnsers();
    showButtons(Button.NONE);
    questionField.innerHTML = `Gehe auf <i class="material-icons" style="font-size: 20pt">book</i> wähle ein Set aus und drücke unten auf "Überprüfen" oder auf "Lernen"`;
    UI.vocset_name.innerText = "Nicht verfügbar";
    UI.vocset_cards.innerText = "0";
    UI.vocset_learned.innerText = "0";
    UI.vocset_right.innerText = "0";
    UI.vocset_wrong.innerText = "0";
    UI.vocset_percent.innerText = "0%";
    currentTraining = {
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
    clearStorage();
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


*/