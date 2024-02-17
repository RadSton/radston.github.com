class BooksearchMenu extends Menu {
    constructor () {
        super("booksearch");
        this.registerOnHideEvent(this.onHide);
        this.registerOnShowEvent(this.onShow);
    }

    onHide() {
        clearBookSearchItems();
    }

    onShow() {
        runBookSearchForLatinVocabulary("");
    }

}