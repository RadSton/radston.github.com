
const loadJSONFromURL = (url) => {
    return new Promise((res) => fetch(url).then((content) => content.text()).then((text) => res(JSON.parse(text))));
}

let vocabularyDB, verbsDB, learningDB;

loadJSONFromURL(VOCABULAR_DATABASE).then(res => {
    vocabularyDB = res;
    loadLibrary();
})


loadJSONFromURL(LEARN_DATABASE).then(res => {
    learningDB = res;
    onLearningLoad();
})