class PopulationGroup {
    constructor(name, tag, color, mean, stddev, skew) {
        this.name = name;
        this.tag = tag;
        this.color = color;
        this.mean = mean;
        this.stddev = stddev;
        this.skew = skew;
        this.change_callback = null;
        this.mouseup_callback = null;
        this.dem_bonus = {'dem': .1, 'ind': .05, 'rep': 0};
        this.rep_bonus = {'dem': 0, 'ind': .05, 'rep': .1};
        this.ind_bonus = {'dem': 0, 'ind': .05, 'rep': 0};
        this.bonuses = {
            'dem': this.dem_bonus,
            'rep': this.rep_bonus,
            'ind': this.ind_bonus,
        };
    }

    configure() {
        this.pop_group = document.createElement("div");
        this.pop_group.id = this.name;
        this.pop_group.style.display = "flex";
        this.pop_group.style.clear = "both";
        this.pop_group.style['flex-wrap'] = 'wrap';
        this.pop_group.style.width = "25%";
        this.plotDiv = document.createElement("div");
        this.plotDiv.id = this.name + "_plotdiv";
        this.plotDiv.style.width = "100%";
        this.plotDiv.style.height = "150px";
        this.pop_group.appendChild(this.plotDiv);

        this.sliders = document.createElement("div");
        this.sliders.id = "sliders_new";
        this.sliders.style.width = "100%";
        this.pop_group.appendChild(this.sliders);
        const obj = this;
        this.mean_slider = new Slider("mean" + name,
            "Mean:  ", -1, 1, .01,
            this.mean, this, this.update_mean, this.onmouseup);
        this.stddev_slider = new Slider("stddev" + name,
            "Stddev:  ", .1, 2, .01,
            this.stddev, this, this.update_stddev, this.onmouseup);
        this.skew_slider = new Slider("skew" + name,
            "Skew:  ", -3, 3, .01,
            this.skew, this, this.update_skew, this.onmouseup);
        this.weight_slider = new Slider("weight" + name,
            "Weight:  ", 0, 1, .01,
            this.weight, this, this.update_weight, this.onmouseup);

        this.sliders.appendChild(this.mean_slider.div());
        this.sliders.appendChild(this.stddev_slider.div());
        // this.sliders.appendChild(this.skew_slider.div());
        // this.sliders.appendChild(this.weight_slider.div());
        return this.pop_group
    }


    party_bonus(that) {
        return this.bonuses[this.tag][that.tag];
    }


    render() {
        this.update_histogram();
    }

    draw_sample() {
        // draw a sample from a normal distribution
        const s = rand_bm(0, 1, 1);
        return s * this.stddev + this.mean;
    }

    update_mean(slider) {
        console.log("update_mean:  ", this, slider);
        this.mean = Number(slider.value);
        if (this.change_callback != null)
            this.change_callback.call(this.change_obj, this);
        this.render();
    }

    update_stddev(slider) {
        console.log("update_mean:  ", this, slider);
        this.stddev = Number(slider.value);
        if (this.change_callback != null)
            this.change_callback.call(this.change_obj, this);
        this.render();
    }

    update_skew(slider) {
        console.log("update_mean:  ", this, slider);
        this.skew = Number(slider.value);
        if (this.change_callback != null)
            this.change_callback.call(this.change_obj, this);
        this.render();
    }

    update_weight(slider) {
        console.log("update_mean:  ", this, slider);
        this.weight = Number(slider.value);
        if (this.change_callback != null)
            this.change_callback.call(this.change_obj, this);
        this.render();
    }

    set_mouseup_callback(obj, method) {
        this.mouseup_callback = method;
        this.mouseup_obj = obj;
    }

    set_change_callback(obj, method) {
        this.change_obj = obj;
        this.change_callback = method;
    }

    onmouseup(slider) {
        console.log("mouseup_redraw:  ", this, slider);
        if (this.mouseup_callback != null)
            this.mouseup_callback.call(this.mouseup_obj, this);
    }

    getTrace() {
        const [x_data, pdf_data] = this.get_pdf_data();
        return {
            type: 'line',
            x: x_data,
            y: pdf_data,
            stackgroup: 'one',
            line: {
                color: this.color
            },
        };
    }

    get_pdf_data() {
        const pdf_data = [];
        const x_data = [];
        // sign flip, invert and center around zero.  The idea is to have a scale -5 -> 5 where
        // where zero is no bias and positive skews correspond to shifting the distribution to
        // the right.
        const steps = 1000;
        const start = -5;
        const end = 5;
        const step = (end - start) / steps;
        const pi = 3.14159265;
        const stddev = this.stddev;
        const u = this.mean;
        const scale = 1 / Math.sqrt(2 * pi * stddev * stddev);
        for (let i = 0; i < steps; ++i) {
            const x = start + i * step;
            const p = scale * Math.exp(-1 * (x - u) * (x - u) / (2 * stddev * stddev));
            pdf_data.push(p);
            x_data.push(x);
        }
        return [x_data, pdf_data];
    }


    get_pop_layout() {
        return {
            xaxis: {
                range: [-1, 1]
            },
            yaxis: {
                range: [0, 4]
            },
            margin: {
                l: 10, r: 10, b: 20, t: 20, pad: 4,
                color: '#444'
            },
            title: {
                text: this.name,
                x: .05,
                y: .90,
                font: {
                    color: '#7f7f7f'
                }
            },
            plot_bgcolor: '#222',
            paper_bgcolor: '#222'
        };
    }


    update_histogram() {
        console.log(`updating histogram:  mean ${this.mean} stddev ${this.stddev}`);
        const traces = [this.getTrace()];
        const layout = this.get_pop_layout();
        Plotly.react(this.plotDiv, traces, layout);
    }
}
