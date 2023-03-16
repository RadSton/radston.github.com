let isInfoOpen = false;

let asking = {
    current: 0,
    pack: undefined,
    wrong: []
}

let hasLearntEveryVocabulary = false;

let flashCardSets;

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

infoButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleInfoScreen();
})

const notify = (title) => {
    showButtons(false)
    showQuestion(title, " ");

    setTimeout(() =>  // After a second show voc again
        showCurrentCard()
        , 1000)
}


const showQuestion = (question, awnser) => {

    showAwnsers(false); // Hide awnser

    questionField.innerHTML = question;
    solutionField.innerHTML = awnser;
}

const setProgress = (current, max) => {
    label.innerHTML = current + " / " + max;
}

showAwnser.addEventListener("click", (e) => {
    e.preventDefault();

    showAwnsers();
});

const showButtons = (shouldShow = true) => {
    if (shouldShow)
        document.querySelector(".isCorrectButtons").style.display = "inline-block";
    else
        document.querySelector(".isCorrectButtons").style.display = "none";

}

const showAwnsers = (shouldShow = true) => {
    awnsers.forEach(awnserElement => awnserElement.style.display = (shouldShow ? "block" : "none"));

    if (shouldShow) {
        showAwnser.style.display = "none";
        closeButton.style.display = "inline-block";
        checkButton.style.display = "inline-block";
    } else {
        closeButton.style.display = "none";
        checkButton.style.display = "none";
        showAwnser.style.display = "block";
    }

}


const handleInfoScreen = () => {
    isInfoOpen = !isInfoOpen;

    if (!isInfoOpen) {
        showCurrentCard();
        showButtons();
    } else {

        let table_html = "<a class=\"downloadAsPdfButton\" href=\"#\">Als PDF herrunterladen</a><br><br><table><tr><th>Vokabel</th><th>Antwort</th></tr>";
        for (var wrong of asking.wrong) {
            let card = asking.pack[wrong];
            table_html += "<tr>\n" +
                "<td>" + card.question + "</td>" +
                "<td>" + card.awnser + "</td>" +
                "</tr>"
        }

        table_html += "</table>";

        showButtons(false) // Hide Buttons

        showQuestion("Liste falscher Vokablen:", table_html); // Set promt

        showAwnsers(); // Show promt

        // When clicked download as PDF
        document.querySelector(".downloadAsPdfButton").addEventListener("click", (e) => {
            e.preventDefault();
            generatePDF();
        })
    }
}

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

const loadAfterFinish = () => {
    initflashCardSets();

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

document.addEventListener("DOMContentLoaded", loadAfterFinish);

const load = (val) => {
    asking.pack = flashCardSets.flashcards[val].cards;
    asking.current = 0;
    asking.wrong = [];
    showQuestion(asking.pack[0].question, asking.pack[0].awnser);
    setProgress(asking.current + 1, asking.pack.length);
    hasLearntEveryVocabulary = false;
}

const nextCard = () => {
    if (checkIfDone()) return;

    asking.current++;

    if (asking.current >= asking.pack.length) {
        if (wrong.length == 0) {
            showDoneScreen();
            return;
        }

        let newPack = [];

        for (var w of asking.wrong) {
            newPack.push({
                ...asking.pack[w]
            })
        }

        wrong = [];

        asking.pack = newPack;
        asking.current = 0;
    }

    showCurrentCard();
    setProgress(asking.current + 1, asking.pack.length);
}

const showCurrentCard = () => {
    showButtons();
    showQuestion(asking.pack[asking.current].question, asking.pack[asking.current].awnser);
}

const showDoneScreen = () => {
    setProgress("WARTHUNDER", "LERNERN");
    showQuestion("Du hast alle Vokabeln durch", "Clicke irgendeinen Knopf um von vorne zu beginnen");
    hasLearntEveryVocabulary = true;
}

closeButton.addEventListener("click", (e) => {
    e.preventDefault();
    asking.wrong.push(asking.current);
    nextCard();
})
checkButton.addEventListener("click", (e) => {
    e.preventDefault();
    nextCard();
})

const initflashCardSets = () => {
    flashCardSets = {

    };
}

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

