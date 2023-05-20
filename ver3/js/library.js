const vocabulary_view = document.querySelector(".vocabulary_view");

const sortAlphabeticly = (toSort) => {
    var clone = [...toSort];
    clone.sort(function (a, b) {
        var wordA = a[0].toUpperCase();
        var wordB = b[0].toUpperCase();
        if (wordA < wordB) {
            return -1;
        }
        if (wordA > wordB) {
            return 1;
        }
        return 0;
    });

    return clone;
}

const showVocSetInVocabularyView = (set, category) => {
    hideAll();
    unmarkAllButtons();

    vocabulary_view.querySelector("[vocabulary_view=\"table\"]").innerHTML = `<tr vocabulary_view="format"></tr>`;

    vocabulary_view.querySelector("[vocabulary_view=\"title\"]").innerHTML = "Vokabel von " + category.name + "/" + set.name;
    const amount = category.format.names.length;
    const spacing = Math.floor(100 / amount);

    let tr = ``;

    for (let i = 0; i < amount; i++) {
        tr += `<th width="${spacing}%"><text>${category.format.names[i]}</text></th>`;
    }

    vocabulary_view.querySelector("[vocabulary_view=\"format\"]").innerHTML = tr;

    let th = ``;

    const sortedSet = category.format.sortable ? sortAlphabeticly(set.vocabulary) : set.vocabulary;

    for (let voc of sortedSet) {
        th += `<tr>`;
        for (let inVoc of voc) th += `<td>${inVoc}</td>`;
        th += `</tr>`;
    }


    vocabulary_view.querySelector("[vocabulary_view=\"table\"]").innerHTML += th;



    var el = document.querySelector('[vocabulary_view="button"]'),
        elClone = el.cloneNode(true);
    el.parentNode.replaceChild(elClone, el);

    elClone.addEventListener("click", (e) => {
        e.preventDefault();
        trainSet(set, category.name);
        hideAll();
        unmarkAllButtons();
        menus[INDEX_OF_TESTING].menu.classList.remove("hidden");
        menus[INDEX_OF_TESTING].button.classList.add("menu__item__active");
    })


    vocabulary_view.classList.remove("hidden");
}

const loadLibrary = () => {
    let catIndex = 0;
    for (const category of vocabularyDB.categorys) {
        let htmlToInject = `<category><text>${category.name}</text><hr>`;

        let index = 0;
        for (const set of category.sets) {
            htmlToInject += `<div class="vocset" identifyer="${catIndex}-${index}">
                <div class="voc_set_description">
                    <div class="count">
                        <div class="count_description">Vokabel</div>
                        <div class="count_value">${set.vocabulary.length}</div>
                    </div>
                    <div class="vocset_name">${set.name}</div>
                    <div class="vocset_author">by ${set.author}</div>
                </div>
            </div>`;
            index++;
        }

        htmlToInject += "</category>";
        document.querySelector(".vocsets").innerHTML += htmlToInject;
        catIndex++;
    }

    for (const set of document.querySelectorAll(".vocset")) {
        set.addEventListener("click", (ev) => {
            const identifyer = set.getAttribute("identifyer").split("-");
            showVocSetInVocabularyView(vocabularyDB.categorys[identifyer[0]].sets[identifyer[1]], vocabularyDB.categorys[identifyer[0]]);
        })
    };
};