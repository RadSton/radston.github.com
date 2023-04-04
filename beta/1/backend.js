let currentQuestion = {
    currendId: -1,
    cardSetId: 0,
    currentPack: [],
    currentWrongs: [],
    currentAwnsers: {
        0: { isCorrect: false },
        1: { isCorrect: false },
        2: { isCorrect: false },
        3: { isCorrect: false }
    }
}

let isDone = false,
    hasLoaded = false,
    hasInitzialized = false,
    isShowingAwnser = false;

let cardSets = [];


const showDoneScreen = () => {
    isDone = true;
    showQuestion("Du hast alle Vok durch");
    showAwnsers(["Dies", "ist", "eine", "Alpha"]);

}

const load = (pack = 0) => {
    fillCardsSelection(cardSets.flashcards);
    loadPack(pack);
}

const loadPack = (pack) => {
    currentQuestion.currendId = -1;
    currentQuestion.currentPack = cardSets.flashcards[pack].cards;
    currentQuestion.cardSetId = pack;

    nextCard();
}

const getRandomCards = (correct) => {
    let final = [];
    let pack = cardSets.flashcards[currentQuestion.cardSetId].cards;
    let idOfCorrect = Math.floor(Math.random() * 3);

    while (final.length < 4) {

        if (final.length == idOfCorrect) {
            final.push(correct);
            currentQuestion.currentAwnsers[final.length - 1] = { isCorrect: true };
            continue;
        }

        const randomCard = pack[Math.floor(Math.random() * (pack.length - 1))];

        if(correct.includes(randomCard.awnser)) continue;

        if (!final.includes(randomCard.awnser)) {
            final.push(randomCard.awnser);
            currentQuestion.currentAwnsers[final.length - 1] = { isCorrect: false };
        }
    }

    return final;
}


const nextCard = () => {
    currentQuestion.currendId = currentQuestion.currendId + 1;



    if (currentQuestion.currendId >= currentQuestion.currentPack.length) {
        if (currentQuestion.currentWrongs.length == 0) {
            showDoneScreen();
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
    let currentCard = currentQuestion.currentPack[currentQuestion.currendId];

    showQuestion(currentCard.question);
    showAwnsers(getRandomCards(currentCard.awnser));
    updateProgress();

}

const uncoverAwnser = (id) => {
    if(isDone) return;
    if (isShowingAwnser && !currentQuestion.currentAwnsers[id].isCorrect) return;

    if (!currentQuestion.currentAwnsers[id].isCorrect) {
        isShowingAwnser = true;
        currentQuestion.currentWrongs.push(currentQuestion.currendId);
        let correctId = -1;

        for (let index = 0; index < 4; index++) {
            const element = currentQuestion.currentAwnsers[index];
            if (element.isCorrect) {
                correctId = index;
                break;
            }

        }

        colorButton(id, correctId);

    } else nextAfterWrong();
}

const nextAfterWrong = () => {
    clearButtonColor();
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

loadVocSetsFromURL("./1/vocset.json").then(res => {
    cardSets = res;
    hasInitzialized = true;
    if (hasLoaded) {
        load();
    }
})

document.addEventListener("DOMContentLoaded", () => {
    hasLoaded = true;
    if (hasInitzialized) {
        load();
    }
});