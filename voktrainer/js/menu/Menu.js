class Menu {
    constructor (name, isButtonLess = false) {
        this.name = name;
        MenuManager.registerMenu(this, isButtonLess);
    }

    registerOnShowEvent (func) {
        MenuManager.registerOnShowEvent(this, func);
    }

    registerOnHideEvent (func) {
        MenuManager.registerOnHideEvent(this, func);
    }

    registerOnKeypressEvent (func) {
        MenuManager.registerOnKeypressEvent(this, func);
    }

    getName () {
        return this.name;
    }
}