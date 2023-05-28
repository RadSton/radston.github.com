
const verbs_next = {
    name: document.querySelector("th[verb=\"right\"]"),
    button: document.querySelector("td[verb=\"right\"]")
}
const verbs_visible = {
    name: document.querySelector("th[verb=\"visibility\"]"),
    button: document.querySelector("td[verb=\"visibility\"]")
}

let verbsLength = 0;
let currentVerbShown = undefined;
const possibleVerbTypes = ["Futur", "Imperfekt", "Normal", "Perfekt"]


const verbs_questionField = document.querySelector(".verbs_questionField");
const verbs_awnserField = document.querySelector(".verbs_showing");

const loadVerbs = () => {
    showVerb();
    verbsLength = verbsDB.length;
}



const addVerbAwnser = (awnser) => verbs_awnserField.innerHTML += "<hr><text>" + awnser + "</text>";
const clearVerbAwnsers = () => verbs_awnserField.innerHTML = "";

const revealVerbAwnser = () => {
    clearVerbAwnsers();
    addVerbAwnser(currentVerbShown.name);
    addVerbAwnser(currentVerbShown.originalWord.info);
    addVerbAwnser(currentVerbShown.originalWord.german);
}






let currentVerbButton; 

const showVerbButtons = (button) => {

    currentVerbButton = button;

    verbs_visible.button.style.display = "none";
    verbs_visible.name.style.display = "none";
    verbs_next.button.style.display = "none";
    verbs_next.name.style.display = "none";

    if (button == Button.AWNSERS) {
        verbs_next.button.style.display = "table-cell";
        verbs_next.name.style.display = "table-cell";
    } else if (button == Button.SHOWAWNSERS) {
        verbs_visible.button.style.display = "table-cell";
        verbs_visible.name.style.display = "table-cell";
    }
}

const getRandomVerb = () => {
    const verb = verbsDB[Math.floor(verbsLength * Math.random())];

    const type = possibleVerbTypes[Math.floor(possibleVerbTypes.length  * Math.random())]
    const conjugationType = verb.conjugations[type.toLowerCase()];

    const descriptor = Math.floor(conjugationType.length  * Math.random());
    const randomType = conjugationType[descriptor];

    let readableName = "";

    if(descriptor > 3) readableName = (descriptor - 3) + ".Pl. " + (type === "Normal" ? "Präsens" : type);
    else readableName = descriptor  + ".Sg. " + (type === "Normal" ? "Präsens" : type);
    
    return {
        result: randomType,
        name: readableName,
        originalWord: verb
    }
}

const showVerb = () => {
    showVerbButtons(Button.SHOWAWNSERS)
    clearVerbAwnsers();
    const randomVerb = getRandomVerb();
    verbs_questionField.innerHTML = randomVerb.result;
    currentVerbShown = randomVerb;
}
 
const onShowVerbAwnser = () => {
    revealVerbAwnser();
    showVerbButtons(Button.AWNSERS);
}

verbs_visible.button.addEventListener("click", onShowVerbAwnser);
verbs_next.button.addEventListener("click", showVerb);



const handleVerbKeyPress = (e) => {
    if (currentVerbButton == Button.AWNSERS) {
        switch (e.keyCode) {
            case 32:
            case 119: showVerb();
            default: break;
        }
    } else if (currentVerbButton == Button.SHOWAWNSERS) {
        switch (e.keyCode) {
            case 32:
            case 119: onShowVerbAwnser();
            default: break;
        }
    }
};