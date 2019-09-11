class Button {
    constructor(name, text, click_obj, click_callback) {
        this.name = name;
        this.click_obj = click_obj;
        this.click_callback = click_callback;
        this.text = text;

        const button = document.createElement("button");
        button.name = name;
        button.innerHTML = this.text;
        button.style['background-color'] = '#333';
        button.style.color = 'red';
        button.style.border = 'none';

        const obj = this;
        button.onclick = function () {
            obj.onclick(this);
        };
        this.button = button;
    }

    div() {
        return this.button;
    }

    onclick(selector) {
        this.value = selector.value;
        this.click_callback.call(this.click_obj, this)
    }
}
