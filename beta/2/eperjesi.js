
// SETTINGS
const AUTHOR = "radston12"
const MODE_NAME = "EPERJESI"
const RELEASE_TYPE = "BETA"
// SETTINGS END

// VARS 
let awnserField;

// VARS END


/**
 *
 * @param {Function} check
 * @description This function gets called when the DOMContext of the webpage has loaded! 
 * It should be used to initalize variables that contain something from the context 
 *      for example: document.getElementById("example"). 
 * This function should install callbacks to the check variable and it should be called when the user is done with inputing their awnser!
**/

const init = (check) => {
    $runCheck = check;

    awnserField = document.createElement("input");
    awnserField.type = "text";
    awnserField.value = "";
    awnserField.placeholder = "Type here"
    awnserField.classList.add("awnser");

    const nextBtn = document.createElement("span");
    nextBtn.innerHTML = "navigate_next";
    nextBtn.classList.add("material-icons")
    nextBtn.id = "awnser-icon"


    document.querySelector(".card").appendChild(awnserField);
    document.querySelector(".card").appendChild(document.createElement("br"));
    document.querySelector(".card").appendChild(nextBtn);

    awnserField.addEventListener("keyup", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) check();
    })
    nextBtn.addEventListener("click", (e) => {
        check();
    })

}


/**
 * @description This function gets called when the last vocabular was awnserd correctly
**/
const showDoneScreen = () => {

}


/**
 * @param {$exampleQuestion} questionObject
 * @description This function gets called when check from init is called. 
 * It should return a bool that is true if the user gave the correct awnser!
 * @returns {Boolean}
**/
const checkIfInputCorrect = (questionObject) => {
    if (awnserField.value == questionObject.awnser) return true;
    let taw = awnserField.value.replaceAll(" ", "").toLowerCase();
    let qaw = questionObject.awnser.replaceAll(" ", "").toLowerCase();
    if (taw === qaw) return true;

    taw = taw.replaceAll("(", ",").replaceAll(")", ",").replaceAll(";", ",");
    qaw = qaw.replaceAll("(", ",").replaceAll(")", ",").replaceAll(";", ",");
    if (taw === qaw) return true;


    if (taw.length <= 1) return false;

    taw = taw.replaceAll(/([1-9])+./g, "").split(",");
    qaw = qaw.replaceAll(/([1-9])+./g, "").split(",");

    for (const tawnser of taw) {
        for (const qawnser of qaw) {
            if (tawnser == qawnser) return true;
        }
    }

    return false;
}


/**
 * @param {Function} done
 * @description This function gets called when an incorrect awnser was enterd. 
 * If the user is done with viewing the correct awnser "done" should be called to get the next question
**/
const revealWhatsWrong = (done) => {
    awnserField.style.color = "var(--wrong-color)";
    $next = done;
    awnserField.value = getCurrentQuestion().awnser;
    setTimeout(done, 1300);
}


/**
 * @param {Function} done
 * @description This function gets called when an correct awnser was enterd. 
 * If the user is done with checking "done" should be called to get the next question
**/
const revealItsCorrect = (done) => {
    awnserField.style.color = "var(--right-color)";
    awnserField.value = getCurrentQuestion().awnser;
    setTimeout(done, 500);
}


/**
 * @description This function gets called when there was some kind of visual representation that needs to be reset!
**/
const clearCorrectAwnserField = () => {
    awnserField.style.color = "var(--primary-color)";
}


/**
 * @param {$exampleQuestion} question
 * @description This function gets called when the programm is ready to get new data from the user. 
 * It should be used to clear the input or generate new possible awnsers
**/
const prepareAwnserFields = (question) => {
    awnserField.value = "";
}


/**
 * @param {String} promt
 * @description This function gets called when the programm wants to show a question to the user
**/
const showQuestion = (promt) => document.querySelector(".question").innerHTML = promt;



// Development erleichterungen:
let $exampleQuestion = { question: "q", awnser: "a" }
let $runCheck;
let $next;