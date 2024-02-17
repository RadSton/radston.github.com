class LearningMenu extends Menu {
    constructor () {
        super("learning");
        this.registerOnKeypressEvent(this.onKeypress);
    }

    onKeypress(keypressEvent) {
        handleLearnKeyPress(keypressEvent);
    }
}