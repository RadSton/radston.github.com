const LAST_DAY = new Date("2023-06-30T12:00:00.000Z");
const TYPE_OF_FREE_DAY = {
    STAATSFEIERTAG: { name: "Staatsfeiertag", datum: "01.05" },
    CHRISTIHIMMELFAHRT: { name: "Christi Himmelfahrt", datum: "18.05-19.05" },
    PFINGSTMONTAG: { name: "Pfingstmontag", datum: "29.05" },
    FROHNLEICHNAHM: { name: "Fronleichnam", datum: "08.06-09.06" },
    WEEKEND: { name: "Wochenende" }
}


let currentTime = document.querySelector(".currentTime");
let fpsDebug = document.querySelector(".fpsCounter");
let fpsCounter = 0;
let fps = 0;
let days = document.querySelector(".days > span");
let hours = document.querySelector(".hours > span");
let minutes = document.querySelector(".minutes > span");
let seconds = document.querySelector(".seconds > span");
let milliseconds = document.querySelector(".milliseconds > span");
let sdays = document.querySelector(".sdays > span");
let free = document.querySelector(".free > span");
let weekends = document.querySelector(".weekends > span");


const getTypeOfDay = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6) return TYPE_OF_FREE_DAY.WEEKEND;

    let month = date.getMonth();
    let day = date.getDate();

    if (month == 4) { // 5
        if (day == 1) return TYPE_OF_FREE_DAY.STAATSFEIERTAG;
        if (day == 18 || day == 19) return TYPE_OF_FREE_DAY.CHRISTIHIMMELFAHRT;
        if (day == 29) return TYPE_OF_FREE_DAY.PFINGSTMONTAG;
    } else if (month == 5) { // 6
        if (day == 8 || day == 9) return TYPE_OF_FREE_DAY.FROHNLEICHNAHM;
    }

    return;
}

const testDaysFromTo = (fromOrig = new Date(), to = LAST_DAY, addition = 1000 * 60 * 60 * 24) => {
    let from = new Date(fromOrig.getTime()); // clone

    let result = {
        school: 0,
        weekends: 0,
        free: 0,
        entrys: {}
    }

    while (from.getTime() <= to.getTime()) {
        let type = getTypeOfDay(from);
        from.setTime(from.getTime() + addition);

        if (!type) {
            result.school++;
            continue;
        }

        if (!type.datum) {
            result.weekends++;
            continue;
        }

        result.entrys[type.datum] = type;
        result.free++;

    }

    return result;
}

const shouldInclude = (variable, spacer, varlen = 2) => { return variable != undefined ? variable.formatNumber(varlen, variable) + spacer : "" };

const getExactTimeUntil = (until = LAST_DAY, spacer = ":") => {
    let diff = until.getTime() - Date.now();

    let ms = diff % 1000;
    let s = Math.floor(diff / 1000) % 60;
    let m = Math.floor(diff / (1000 * 60)) % 60;
    let h = Math.floor(diff / (1000 * 60 * 60)) % 24;
    let d = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (d == 0) d = undefined;
    if (!d && h == 0) h = undefined;

    return { ms, s, m, h, d };
}

const getCurrentTime = () => {
    const date = new Date();
    const dateTime = date.getTime();

    let ms = dateTime % 1000;
    let s = Math.floor(dateTime / 1000) % 60;
    let m = Math.floor(dateTime / (1000 * 60)) % 60;
    let h = Math.floor(dateTime / (1000 * 60 * 60)) % 24;

    let d = date.getDate();
    let mo = date.getMonth() + 1;
    let y = date.getFullYear();

    return `${shouldInclude(d, "")}.${shouldInclude(mo, "")}.${y} ${shouldInclude(h + 2, "")}:${shouldInclude(m, "")}:${shouldInclude(s, "")}:${shouldInclude(ms, "", 3)}`
}

const updateBigTimer = () => {
    const school = getExactTimeUntil();
    days.innerHTML = shouldInclude(school.d, "");
    hours.innerHTML = shouldInclude(school.h, "");
    minutes.innerHTML = shouldInclude(school.m, "");
    seconds.innerHTML = shouldInclude(school.s, "");
    milliseconds.innerHTML = shouldInclude(school.ms, "", 3);
}


const updateSmallTimer = () => {
    const school = testDaysFromTo();
    sdays.innerHTML = shouldInclude(school.school, "");
    free.innerHTML = shouldInclude(school.free, "");
    weekends.innerHTML = shouldInclude(school.weekends, "");
}

const animate = () => {
    fpsCounter++;
    currentTime.innerHTML = getCurrentTime();
    updateBigTimer();
    updateSmallTimer();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

setInterval(() => {
    fps = fpsCounter;
    fpsCounter = 0;
    fpsDebug.innerHTML = "(" + fps + " FPS)";
}, 1000)

Number.prototype.formatNumber = (varlen, target) => {
    let string = target.toString();
    while (string.length < varlen) string = "0" + string;
    return string;
}