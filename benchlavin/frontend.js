const questionField = document.querySelector(".questiontext");
const awnsers = document.querySelectorAll(".awnsersection");
const solutionField = document.querySelector(".solutiontext");
const label = document.querySelector(".toptext");

const vokSelection = document.querySelector(".vokSelection");

const showAwnser = document.querySelector(".revealawnserbutton");
const closeButton = document.querySelector(".closebutton");
const checkButton = document.querySelector(".checkbutton");
const saveButton = document.querySelector(".save");
const loadButton = document.querySelector(".load");
const infoButton = document.querySelector(".info");

let isInfoOpen = false;

saveButton.addEventListener("click", (e) => {
    e.preventDefault();
    save();
})

loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadFromLocal();
})

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


// run init in backend.js if everything has loaded
document.addEventListener("DOMContentLoaded", init);
