class Tabs {
    constructor(tabgroup_name, active_color, inactive_color) {
        this.tabgroup_name = tabgroup_name;
        this.active_color = active_color;
        this.inactive_color = inactive_color;
        this.buttons_div = document.createElement("div");
        this.buttons_div.class = 'tab';
        this.buttons_div.name = tabgroup_name;
        this.tab_div = document.createElement("div");
        this.tab_div.appendChild(this.buttons_div);
        this.tabs = {};
        this.buttons = {};
    }

    div() {
        return this.tab_div;
    }

    add_tab(inner_div, label) {
        const tab_div = document.createElement('div');
        tab_div.id = `wrapping_div_${label}`;
        tab_div.appendChild(inner_div);

        this.tabs[label] = tab_div;
        let button = document.createElement('button');
        button.class = `button-${this.tabgroup_name}`;
        button.innerHTML = label;
        button.style['background-color'] = this.inactive_color;
        const obj = this;
        button.onclick = function () {
            obj.select_tab(label);
        };
        this.buttons[label] = button;

        this.buttons_div.appendChild(button);
        this.tab_div.appendChild(tab_div);
        if (Object.keys(this.tabs).length === 1)
            this.select_tab(label)
    }

    select_tab(label) {
        Object.values(this.tabs).forEach(t => {t.style.display = "none"});
        Object.values(this.buttons).forEach(b =>  {
            b.style.className = b.className.replace(" active", "");
            b.style['background-color'] = this.inactive_color;
        });
        this.tabs[label].style.display = "block";
        this.buttons[label].classname += " active";
        this.buttons[label].style['background-color'] = this.active_color;
    }
}