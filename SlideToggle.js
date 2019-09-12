class SlideToggle {
    constructor(inner_div, label) {
        this.inner_div = inner_div;
        this.label = label;
        this.outer_div = document.createElement("div");
        this.outer_div.id = `${label}_outer_div`;
        this.h = document.createElement("h3");
        this.h.innerHTML = `- ${label}`;
        this.outer_div.appendChild(this.h);
        this.outer_div.appendChild(inner_div);
        this.state = 'open';
        const obj = this;
        this.h.onclick = function() {
            obj.onclick()
        }
    }
    div() {
        return this.outer_div;
    }
    onclick() {
        if (this.state === 'open') {
            $(this.inner_div).slideUp();
            this.h.innerHTML = `+ ${this.label}`;
            this.state = 'closed';
        }
        else {
            $(this.inner_div).slideDown();
            this.h.innerHTML = `- ${this.label}`;
            this.state = 'open';
        }
    }
}