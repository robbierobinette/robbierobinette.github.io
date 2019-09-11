class Selector {
    constructor(name, values, labels, selected, change_obj, change_callback) {
        this.name = name;
        this.values = values;
        this.labels = labels;
        this.change_callback = change_callback;
        this.change_obj = change_obj;
        this.value = selected;


        const select = document.createElement("select");
        select.label = name;
        select.style['background-color'] = '#333';
        select.style.color = '#AAA';
        select.style.border = 'none';
        for (let i = 0; i < this.values.length; ++i) {
            const option = document.createElement("option");
            option.innerHTML = this.labels[i];
            option.value = this.values[i];
            if (this.values[i] === selected)
                option.selected = true;
            select.appendChild(option);
        }
        select.value = this.value;
        const obj = this;
        select.onchange = function () {
            obj.onchange(this);
        };
        this.select = select;
    }

    div() {
        return this.select;
    }

    onchange(selector) {
        this.value = selector.value;
        this.change_callback.call(this.change_obj, this)
    }
}
