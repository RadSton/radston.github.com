const VERSION = "0.1";


const progress = document.querySelector(".progress");
const question = document.querySelector(".question");
const awnsers = document.querySelectorAll(".awnsers > button");

// buttons

const cardsSelection = document.querySelector(".cardsSelection");

const showProgress = (a, b) => { progress.innerHTML = a + " / " + b; }
const showQuestion = (quest) => { question.innerHTML = quest; };
const showAwnser = (id, awnser) => { awnsers[id].innerHTML = awnser; };
const showAwnsers = (toShow) => {
    for (let index = 0; index < awnsers.length; index++)
        awnsers[index].innerHTML = toShow[index];
}

const fillCardsSelection = (filling, replace = true) => {
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

const addButtonListeners = () => {
    let index = 0;
    awnsers.forEach(awnser => {
        awnser.addEventListener("click", (e) => {
            e.preventDefault();
            let id = e.target.getAttribute("awnser-id");

            uncoverAwnser(id);
        });
        index++;
    });
}

const colorButton = (red, green) => {
    awnsers[red].style.backgroundColor = "var(--wrong-color)";
    awnsers[green].style.backgroundColor = "var(--right-color)";
}

const clearButtonColor = () => {
    awnsers.forEach(awnser => {
        awnser.style.backgroundColor = "var(--tertiary-bg)"
    });
}

document.addEventListener("DOMContentLoaded", () => {
    shouldWarn();
    addButtonListeners();
});

// WARNING


const shouldWarn = () => {

    let currentVersion = localStorage.getItem("version");
    if (currentVersion != VERSION) showWarning();
}

const showWarning = () => {
    document.querySelector(".warning").style.display = "inline-block";
    document.querySelector(".relevedData").innerHTML = getLocalStorageSize();
    document.querySelector(".warningbutton").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        localStorage.setItem("version", VERSION);
        document.querySelector(".warning").style.display = "none";
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