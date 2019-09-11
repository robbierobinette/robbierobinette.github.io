class Checkbox {
    constructor(name, value, change_obj, change_callback) {
        this.name = name;
        this.change_obj = change_obj;
        this.change_callback = change_callback;
        this.value = value;

        const checkBox = document.createElement("input");
        checkBox.name = name;
        checkBox.type = 'checkbox';
        checkBox.value = this.value;
        checkBox.innerHTML = 'Incumbent';

        const obj = this;
        checkBox.onchange = function () {
            obj.onchange(this);
        };
        this.checkBox = checkBox;
    }

    div() {
        return this.checkBox;
    }

    onchange(selector) {
        this.value = selector.value;
        this.change_callback.call(this.change_obj, this)
    }
}
