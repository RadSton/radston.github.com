const calcSM2 = (quality, previousInterval,  repetitions, previousEaseFactor) => {
    var interval;
    var easeFactor;
    if (quality >= 3) {
        switch (repetitions) {
            case 0:
                interval = 1;
                break;
            case 1:
                interval = 4; // 6 -> 4 edited by radston12
                break;
            default:
                interval = Math.round((previousInterval * previousEaseFactor) / 1.7); // division added by radston12
        }

        if(interval == 1 && quality == 5) interval = 2; // added by radston12

        repetitions++;
        easeFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
        repetitions = 0;
        interval = 0; // 1 -> 0 edited by radston12 
        easeFactor = previousEaseFactor - ((5 - quality) * 0.4); // - [...] added by radston12
    }

    if (easeFactor < 1.3) 
        easeFactor = 1.3;
    return {interval, repetitions, easeFactor}
}

// Node.js testing
//exports.calc = calcSM2;
