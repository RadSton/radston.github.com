// RELEASE VERSION - if changes shows beta warning
const DEV = false;
const VOCABULAR_DATABASE = "https://raw.githubusercontent.com/RadSton/radston.github.com/master/beta/1/vocset.json";
const VERSION_ID = "0.3";


const VERSION = (DEV ? "dev-" : "") + VERSION_ID;
// ----

let currentQuestion = {
    currendId: -1,
    cardSetId: 0,
    currentPack: [],
    currentWrongs: []
}

let isDone = false,
    hasLoaded = false,
    hasInitzialized = false,
    isShowingAwnser = false;

let cardSets = [];

const getCurrentQuestion = () => currentQuestion.currentPack[currentQuestion.currendId];

const _showDoneScreen = () => {
    isDone = true;
    showDoneScreen();
}

const load = (pack = 0) => {
    addDevMarkers();
    fillCardsSelection(cardSets.flashcards);
    loadPack(pack);
}

const loadPack = (pack) => {
    currentQuestion.currendId = -1;
    currentQuestion.currentPack = cardSets.flashcards[pack].cards;
    currentQuestion.cardSetId = pack;

    nextCard();
}

const nextCard = () => {
    currentQuestion.currendId = currentQuestion.currendId + 1;

    if (currentQuestion.currendId >= currentQuestion.currentPack.length) {
        if (currentQuestion.currentWrongs.length == 0) {
            _showDoneScreen();
            return;
        }

        let newPack = [];

        for (var w of currentQuestion.currentWrongs) {
            newPack.push({
                ...currentQuestion.currentPack[w]
            })
        }

        currentQuestion.currentWrongs = [];

        currentQuestion.currentPack = newPack;
        currentQuestion.currendId = 0;
    }


    showCurrentCard();
}

const showCurrentCard = () => {
    showQuestion(getCurrentQuestion().question);
    prepareAwnserFields(getCurrentQuestion());
    updateProgress();
}


const uncoverAwnser = () => {
    if (isDone) return;
    if (isShowingAwnser) return;

    isShowingAwnser = true;

    if (!checkIfInputCorrect(getCurrentQuestion())) {
        // WRONG

        currentQuestion.currentWrongs.push(currentQuestion.currendId);
        revealWhatsWrong(nextCardWithReset);

    } else

        // RIGHT 

        revealItsCorrect(nextCardWithReset);
}

const nextCardWithReset = () => {
    clearCorrectAwnserField();
    nextCard();
    isShowingAwnser = false;
}

const updateProgress = () => {
    showProgress(currentQuestion.currendId + 1, currentQuestion.currentPack.length);
}

// loading

const loadVocSetsFromURL = (url) => {
    return new Promise((res, rej) => {
        fetch(url).then((content) => content.text()).then((text) => {
            res(JSON.parse(text));
        });
    })
}

loadVocSetsFromURL(VOCABULAR_DATABASE).then(res => {
    cardSets = res;
    hasInitzialized = true;
    if (hasLoaded) load();
})

const runBackend = () => {
    init(uncoverAwnser)
    hasLoaded = true;
    if (hasInitzialized) load();

    shouldWarn();
    // TODO: addButtonListeners();
};

// -------------------------------------
// frontend.js
// -------------------------------------

const shouldWarn = () => {
    let currentVersion = localStorage.getItem("version");

    if (currentVersion != VERSION) showWarning();
}

const showWarning = () => {
    document.querySelector(".warning" + (DEV ? "_dev" : "_beta")).style.display = "inline-block";
    document.querySelector(".warningbutton" + (DEV ? "_dev" : "_beta")).addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        localStorage.setItem("version", VERSION);
        document.querySelector(".warning" + (DEV ? "_dev" : "_beta")).style.display = "none";
    });
}

const getLocalStorageSize = () => {
    var total = 0;
    for (var x in localStorage) {
        var amount = (localStorage[x].length * 2) / 1024 / 1024;
        if (!isNaN(amount) && localStorage.hasOwnProperty(x)) total += amount;
    }
    return (total * 1000).toFixed(3);
};

const showProgress = (a, b) => document.querySelector(".progress").innerHTML = a + " / " + b;

const fillCardsSelection = (filling, replace = true) => {

    const cardsSelection = document.querySelector(".cardsSelection");

    if (replace) cardsSelection.innerHTML = "";

    for (let index = 0; index < filling.length; index++) {
        const cardSet = filling[index];

        const option = document.createElement("option"); // Create
        option.setAttribute("value", index); // Set Id
        option.innerText = cardSet.name + " (" + cardSet.cards.length + ")"; // Set name

        cardsSelection.appendChild(option);

    }

    cardsSelection.addEventListener("change", (e) => {
        let val = parseInt(e.target.selectedOptions[0].getAttribute("value"));
        loadPack(val);
    });
}


const addDevMarkers = () => {
    document.querySelector(".impl_author").innerText = AUTHOR;
    document.querySelector(".impl_mode").innerText = MODE_NAME;
    document.querySelector(".impl_releaseType").innerText = (DEV ? "DEV_" : "") + RELEASE_TYPE;
}

// ---------------------
// end frontend.js
// new code
// ---------------------

const loadScript = (url, callback) => {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
}

const possibleScripts = [
    {
        name: "EPERJESI",
        author: "radston12",
        file: "./eperjesi.js"
    }
]

const showScriptMenu = () => {
    let i = 0;
    for(const script of possibleScripts) {
        const btn = document.createElement("button");
        btn.setAttribute("id", i);
        btn.innerText = script.name + " by " + script.author;
        btn.addEventListener("click", (e) => {
            const script = possibleScripts[e.target.getAttribute("id")]
            loadScript(script.file, runBackend);
            document.querySelector(".mode_selection").style.display = "none";
        });
        document.querySelector(".mode_buttons").appendChild(btn);
        i++;
    }

    document.querySelector(".mode_selection").style.display = "inline-block";
}

if(!DEV) showScriptMenu();
else loadScript("./impl.js", runBackend);