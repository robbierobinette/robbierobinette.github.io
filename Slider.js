console.log("executing Slider.js");
class Slider {
    constructor(id, label, min, max, step, value, callback_obj, change_callback, mouseup_callback) {
        const sliderbox = document.createElement("div");
        sliderbox.id = id + "_box";
        sliderbox.style.display = 'flex';

        if (label !== '') {
            const slider_label = document.createElement(`label`);
            slider_label.id = id + "_label";
            slider_label.innerHTML = label;
            slider_label.style.width = '100px';
            slider_label.style.fontSize = "10pt";
            slider_label.style.display = "inline-block";
            sliderbox.appendChild(slider_label);
        }

        const slider_value = document.createElement(`label`);
        slider_value.id = id + "_value";
        slider_value.innerHTML = value;
        slider_value.style.width = '100px';
        slider_value.style.fontSize = "10pt";
        slider_value.style.display = "inline-block";

        const slider = document.createElement("input");
        slider.id = id;
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = value;
        slider.style.width = "150px";

        const obj = this;
        slider.oninput = function () {
            obj.onchange(this);
        };
        slider.onmouseup = function () {
            obj.onmouseup(this);
        };


        sliderbox.appendChild(slider);
        sliderbox.appendChild(slider_value);

        this.callback_obj = callback_obj;
        this.mouseup_callback = mouseup_callback;
        this.change_callback = change_callback;
        this.sliderbox = sliderbox;
        this.slider = slider;
        this.slider_value = slider_value;
        this.value = value;
    }

    div() {
        return this.sliderbox;
    }

    onchange(slider) {
        this.slider_value.innerHTML = slider.value;
        this.value = slider.value;
        if (this.change_callback != null)
            this.change_callback.call(this.callback_obj, slider);
    }

    onmouseup(slider) {
        if (this.mouseup_callback != null)
            this.mouseup_callback.call(this.callback_obj, slider);
    }
}
