let asking = {
    current: 0,
    pack: undefined,
    wrong: []
}

let hasLearntEveryVocabulary = false;
let flashCardSets;

const init = () => {
    loadJSONFromPage("benchlavin/vocset.json").then(res => { flashCardSets = res; loadAfterFinish() });
}

// save current memory image to localStorage
const save = () => {
    let name = ("VOK-" + (new Date()).toLocaleString());

    let isOverriten = localStorage.getItem("saveVokTrainer") != undefined;

    localStorage.setItem("saveVokTrainer", JSON.stringify({
        name: name,
        wrong: asking.wrong,
        pack: asking.pack,
        index: asking.current
    }));

    notify(isOverriten ? "Speicherstand mit  " + name + " überschrieben" : "Gespeichert als  " + name);
}


// load localStorage image and override current memory 
const loadFromLocal = () => {
    let saveState = JSON.parse(localStorage.getItem("saveVokTrainer"));

    if (saveState) {
        notify("Loading:  " + saveState.name);
        asking.wrong = [...saveState.wrong];
        asking.pack = saveState.pack;
        asking.current = saveState.index - 1;
        setTimeout(() => nextCard(), 990);
    } else
        notify("Keine Daten gefunden!");
}


// init when flashCardSet has been loaded
const loadAfterFinish = () => {
    asking.pack = flashCardSets.flashcards[0].cards;

    showQuestion(asking.pack[0].question, asking.pack[0].awnser);
    setProgress(asking.current + 1, asking.pack.length);

    var i = 0;
    for (var f of flashCardSets.flashcards) {
        const option = document.createElement("option");
        option.setAttribute("value", i);
        option.innerText = f.name + " by " + f.author
        vokSelection.appendChild(option);
        i++;
    }

    vokSelection.addEventListener("change", (e) => {
        let val = parseInt(e.target.selectedOptions[0].getAttribute("value"));
        load(val);
    });

};

// load a set of vocabulary
const load = (val) => {
    asking.pack = flashCardSets.flashcards[val].cards;
    asking.current = 0;
    asking.wrong = [];
    showQuestion(asking.pack[0].question, asking.pack[0].awnser);
    setProgress(asking.current + 1, asking.pack.length);
    hasLearntEveryVocabulary = false;
}

// Get next card and show it
const nextCard = () => {
    if (checkIfDone()) return;

    asking.current++;

    if (asking.current >= asking.pack.length) {
        if (asking.wrong.length == 0) {
            showDoneScreen();
            return;
        }

        let newPack = [];

        for (var w of asking.wrong) {
            newPack.push({
                ...asking.pack[w]
            })
        }

        asking.wrong = [];

        asking.pack = newPack;
        asking.current = 0;
    }

    showCurrentCard();
    setProgress(asking.current + 1, asking.pack.length);
}

/// HELPERS

const checkIfDone = () => {
    if (hasLearntEveryVocabulary) {
        setTimeout(() => vokSelection.dispatchEvent(new Event("change")), 1); // call async just for safty probably not needed!
        return true;
    }
    return false
}


const loadJSONFromPage = (url) => {
    return new Promise((res, rej) => {
        fetch(url).then((content) => content.text()).then((text) => {
            res(JSON.parse(text));
        });
    })
}

// GEN PDF
const generatePDF = () => {
    body = [
        ['lateinisch', 'deutsch', 'Platz für Fremdwörter, englische Wörter, Eselsbrücken…'],
    ];

    for (var wrongid of asking.wrong) {
        let ask = asking.pack[wrongid];
        body.push([ask.question, ask.awnser, '']);
    }

    var dd = {
        header: {
            columns: [
                { text: 'Made by BENCHLAVIN v3.2', alignment: 'center' },
                { text: 'Name: _____________________________', alignment: 'center' }
            ]
        },
        content: [
            { text: 'Lernvokabel von _____________________________', style: 'header' },

            {
                table: {
                    widths: ['33%', '33%', '33%'],
                    body: body
                },
            },
            ' ',
            { text: 'KEINE GARANTIE AUF RICHTIGKEIT', style: 'big', alignment: 'center' },
            { text: '(Dieses Vokabelblatt wurde von https://radston.github.io/benchlavin generiert!)', style: 'radplat', alignment: 'center' },

        ],
        styles: {
            header: {
                fontSize: 11,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            radplat: {
                fontSize: 10,
                bold: true,
            },
            big: {
                fontSize: 16,
                bold: true,

            }
        }
    }
    pdfMake.createPdf(dd).download("BENCHLAVIN v3.2.pdf");
}
