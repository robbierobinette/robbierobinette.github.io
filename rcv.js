function rand_bm(mean, stddev, skew) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1'ind',
    if (num > 1 || num < 0) num = rand_bm(mean, stddev, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    // return to unit guassian then scale and offset.
    num = (num - .5) * 10 * stddev + mean;
    return num;
}

class Slider {
    constructor(id, label, min, max, step, value, callback_obj, change_callback, mouseup_callback) {
        const sliderbox = document.createElement("div");
        sliderbox.id = id + "_box";

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
    }

    configure() {
        this.pop_group = document.createElement("div");
        this.pop_group.id = this.name;
        this.pop_group.style.display = "flex";
        this.pop_group.style.clear = "both";
        this.pop_group.style['flex-wrap'] = 'wrap';
        this.pop_group.style.width = "50%";
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
        this.sliders.appendChild(this.skew_slider.div());
        this.sliders.appendChild(this.weight_slider.div());
        return this.pop_group
    }
    dem_bonus = {'dem': .1, 'ind': .05, 'rep': 0};
    rep_bonus = {'dem': 0, 'ind': .05, 'rep': .1};
    ind_bonus = {'dem': 0, 'ind': .05, 'rep': 0};
    bonuses = {
        'dem': this.dem_bonus,
        'rep': this.rep_bonus,
        'ind': this.ind_bonus,
    };

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

class PopulationArea {
    constructor(populations) {
        this.populations = populations;
        Object.values(this.populations).forEach(p => {
            p.set_change_callback(this, this.onchange);
            p.set_mouseup_callback(this, this.onmouseup)
        });

        this.change_callback = null;
        this.mouseup_callback = null;
    }

    random_population() {
        const idx = Math.floor(Math.random() * Object.values(this.populations).length);
        const labels = ['dem', 'rep', 'ind'];
        return this.populations[labels[idx]];
    }

    random_voter() {
        return new Voter(this.random_population())
    }

    set_mouseup_callback(object, method) {
        this.mouseup_obj = object;
        this.mouseup_callback = method;
    }

    set_change_callback(object, method) {
        this.change_obj = object;
        this.change_callback = method;
    }

    onchange() {
        this.update_combined_pop();
        if (this.change_callback != null)
            this.change_callback.call(this.change_obj, this)
    }

    onmouseup() {
        if (this.mouseup_callback != null)
            this.mouseup_callback.call(this.mouseup_obj, this)
    }

    get_pop_layout() {
        return {
            xaxis: {
                range: [-1, 1]
            },
            yaxis: {
                range: [0, 10]
            },
            margin: {
                l: 10, r: 10, b: 20, t: 20, pad: 4,
                color: '#444'
            },
            plot_bgcolor: '#222',
            paper_bgcolor: '#222'
        };
    }

    update_combined_pop() {
        const traces = Object.values(this.populations).map(p => p.getTrace());
        const layout = this.get_pop_layout();
        const container = document.getElementById("combined_plotdiv");

        Plotly.react(container, traces, layout);
    }

    configure() {
        const voters = document.getElementById("voters");

        const h = document.createElement("h2");
        h.innerHTML = "Voting Population Ideology";
        h.style.width = "100%";
        voters.appendChild(h);

        voters.style.display = "flex";
        voters.style['flex-wrap'] = 'wrap';
        Object.values(this.populations).forEach(p => {
            voters.appendChild(p.configure());
        });
        this.configure_combined_pop();
        voters.appendChild(this.combined_pop);
        return voters
    }

    configure_combined_pop() {
        const combined_pop = document.createElement("div");
        combined_pop.id = 'combined_population';
        combined_pop.style.width = '50%';
        const plotDiv = document.createElement("div");
        plotDiv.id = "combined_plotdiv";
        plotDiv.style.width = "100%";
        plotDiv.style.height = "150px";
        combined_pop.appendChild(plotDiv);
        this.combined_pop = combined_pop;
    }

    render() {
        Object.values(this.populations).forEach(p => {
            p.render();
        });
        this.update_combined_pop();
    }
}

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
        for (let i = 0 ; i < this.values.length; ++i) {
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

class Checkbox {
    constructor(name, value, change_obj, change_callback) {
        this.name = name;
        this.change_obj = change_obj;
        this.change_callback = change_callback;
        this.value = value;

        const checkBox = document.createElement("checkbox");
        checkBox.name = name;
        checkBox.value = this.value;

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

class ConfigurationArea {
    constructor(n_candidates, uncertainty, party_bonus_scale, quality_scale) {
        this.n_candidates = n_candidates;
        this.party_bonus_scale = party_bonus_scale;
        this.uncertainty = uncertainty;
        this.quality_scale = quality_scale;
        this.change_callback = null;
        this.change_obj = null;

    }

    configure() {
        const div = document.createElement("div");
        div.style.display = 'float';
        div.style.contain = 'both';
        div.style.width = '100%';

        const h = document.createElement("h2");
        h.innerHTML = "Configuration";
        h.style.width = "100%";
        div.appendChild(h);

        const obj = this;
        const un_sl = new Slider('uncertainty', 'Uncertainty', 0, .30, .001, this.uncertainty, this, this.update_uncertainty, this.onmouseup);
        const pty_sl = new Slider('party_bonus', 'Party Bonus', 0, 2, .01, this.party_bonus_scale, this, this.update_bonus, this.onmouseup);
        const q_sl = new Slider('quality_scale', 'Quality Scale', 0, 2, .01, this.quality_scale, this, this.update_quality, this.onmouseup);
        div.appendChild(un_sl.div());
        div.appendChild(pty_sl.div());
        div.appendChild(q_sl.div());
        this.div = div;
    }

    set_change_callback(change_obj, change_callback) {
        this.change_obj = change_obj;
        this.change_callback = change_callback;
    }

    render() {
        const configuration = document.getElementById("configuration");
        configuration.appendChild(this.div);
    }

    onmouseup() {
        if (this.change_callback != null)
            this.change_callback.call(this.change_obj, this);
    }

    update_uncertainty(slider) {
        this.uncertainty = Number(slider.value);
    }

    update_bonus(slider) {
        this.party_bonus_scale = Number(slider.value);
    }

    update_quality(slider) {
        this.quality_scale = Number(slider.value);
    }
}

class Candidate {
    constructor(name, ideology_score, quality, population, population_area) {
        this.name = name;
        this.population = population;
        this.ideology_score = ideology_score;
        this.quality = quality;
        this.configure();
        this.change_callback = null;
        this.population_area = population_area;
        this.incumbent = false;
    }

    configure() {
        const candidate_area = document.createElement("div");
        candidate_area.id = "candidate_" + this.name;
        candidate_area.style.display = "flex";
        candidate_area.style.width = "100%";
        candidate_area.style.display = "flex";
        candidate_area.style['justify-content'] = 'space-around';

        const name = document.createElement("label");
        name.innerHTML = this.name;
        name.style.width = '10%';
        candidate_area.appendChild(name);
        const obj = this;
        this.ideology_slider = new Slider("ideology_" + this.name,
            "", -1, 1, .01, this.ideology_score,
            this, this.update_ideology, this.onmouseup);
        this.quality_slider = new Slider("quality_" + this.name,
            "", -.2, .2, .01,
            this.quality, this, this.update_quality, this.onmouseup);
        this.party_selector = new Selector(this.name,
            ['ind', 'dem', 'rep'],
            ["Independent", "Democratic", "Republican"],
            this.population.tag, this, this.update_population, this.onmouseup);

        this.incumbent_box = new Checkbox(this.name, this, this.update_incumbent);
        candidate_area.appendChild(this.ideology_slider.div());
        candidate_area.appendChild(this.quality_slider.div());
        candidate_area.appendChild(this.party_selector.div());
        candidate_area.appendChild(this.incumbent_box.div());
        this.div = candidate_area
    }

    color() {
        return this.population.color
    }

    set_change_callback(change_obj, change_callback) {
        this.change_obj = change_obj;
        this.change_callback = change_callback;
    }

    update_ideology(slider) {
        this.ideology_score = Number(slider.value);
    }

    update_quality(slider) {
        this.quality = Number(slider.value);
    }

    update_population(selector) {
        this.population = this.population_area.populations[selector.value];
        this.onchange();
    }

    update_incumbent(checkbox) {
        this.incumbent = checkbox.value;
        this.onchange();
    }

    onmouseup(slider) {
        this.onchange();
    }
    onchange() {
        if (this.change_callback != null)
            this.change_callback.call(this.change_obj, this);
    }
}


class CandidateArea {
    constructor(n_candidates, population_area) {
        this.n_candidates = n_candidates;
        this.candidates = {};
        for (let i = 0; i < this.n_candidates; ++i) {
            let population = population_area.populations['ind'];
            const is = Number(-.5 + i / (this.n_candidates - 1)).toFixed(2);
            if (is < -.15) population = population_area.populations['dem'];
            if (is > .15) population = population_area.populations['rep'];
            const candidate = new Candidate(`candidate-${i}`, is, 0, population, population_area);
            candidate.set_change_callback(this, this.onchange);
            this.candidates[candidate.name] = candidate;
        }
        this.population_area = population_area;
        this.div = document.createElement("div");
        this.div.style.display = "float";
        this.div.style.contain = "both";

        const h = document.createElement("h2");
        h.innerHTML = "Candidate Definition";
        h.style.width = "100%";
        this.div.appendChild(h);

        Object.values(this.candidates).forEach(c => {
            this.div.appendChild(c.div)
        });
    }

    set_change_callback(change_obj, change_callback) {
        this.change_obj = change_obj;
        this.change_callback = change_callback;
    }

    onchange(candidate) {
        if (this.change_callback !== null)
            this.change_callback.call(this.change_obj, this);
    }

    render() {
        const candidate_area = document.getElementById("candidates_div");
        candidate_area.appendChild(this.div)
    }
}


class Voter {
    constructor(population) {
        this.population = population;
        this.ideology_score = population.draw_sample()
    };
    party_bonus(candidate) {
        return this.population.party_bonus(candidate.population)
    }
}

class RCVElection {
    constructor(population, candidates, configuration) {
        this.population = population;
        this.candidates = candidates;
        this.configuration = configuration;
    }

    configure() {
    }

    render() {
        this.run_rcv_election();
    }

    clear_rounds() {
        const rounds_div = document.getElementById("rounds");
        while (rounds_div.firstChild) {
            rounds_div.removeChild(rounds_div.firstChild);
        }
        const h = document.createElement("h2");
        h.innerHTML = "Ranked Choice Rounds";
        h.style.width = "100%";
        rounds_div.appendChild(h);
    }

    get_random_voter() {
        return this.population.random_voter();
    }
    uncertainty() {
        return rand_bm(0, this.configuration.uncertainty, 1)
    }

    rankedChoiceRound(candidates_this_round) {
        const cc = Object.values(candidates_this_round);
        const votes = {};
        cc.forEach(c => {
            votes[c.name] = 0;
        });

        for (let i = 0; i < 10000; ++i) {
            const voter = this.get_random_voter();
            let best_score = 0;
            let best_candidate = null;
            cc.forEach(c => {
                // max distance is 2, the score is 2 - the distance.
                let score = 2 - Math.abs(c.ideology_score - voter.ideology_score);
                score += this.uncertainty();
                score += c.quality + this.configuration.quality_scale;
                score += voter.party_bonus(c) * this.configuration.party_bonus_scale;
                if (best_candidate == null || score > best_score) {
                    best_score = score;
                    best_candidate = c;
                }
            });
            votes[best_candidate.name] += 1;
        }

        return votes;
    }

    run_rcv_election() {
        let done = false;
        let cc = this.candidates.candidates;
        this.clear_rounds();
        while (!done) {
            console.log(`running rcv round with ${Object.keys(cc).length} candidates.`);
            const votes = this.rankedChoiceRound(cc);
            let vote_count = 0;
            let min_candidate = null;
            let max_votes = 0;
            let max_candidate = null;
            let min_votes = 0;
            Object.keys(votes).forEach(c => {
                vote_count += votes[c];
                if (min_candidate == null || votes[c] <= min_votes) {
                    min_candidate = c;
                    min_votes = votes[c];
                }
                if (max_candidate == null || votes[c] > max_votes) {
                    max_candidate = c;
                    max_votes = votes[c]
                }
            });
            this.draw_rcv_round(votes, cc);
            // console.log(`rcv: max_candidate: ${max_candidate} ${max_votes} ${max_votes / vote_count}`);
            console.log(`rcv: eliminating: ${min_candidate} ${min_votes}`);
            if (max_votes / vote_count > .5) {
                console.log(`rcv: ${max_candidate} is the winner!`);
                done = true
            } else {
                const new_cc = {};
                Object.keys(cc).forEach(c => {
                    if (c !== min_candidate) {
                        new_cc[c] = cc[c]
                    }
                });
                cc = new_cc;
            }
        }
    }

    draw_rcv_round(votes, candidates) {
        const starting_candidates = this.candidates.candidates;
        const rounds_div = document.getElementById("rounds");
        rounds_div.style.display = 'flex';
        rounds_div.style['flex-wrap'] = 'wrap';
        const round = document.createElement("div");
        round.id = `round-with-${candidates.length}`;
        round.style.width = '20%';
        round.style.height = '150px';
        rounds_div.appendChild(round);

        const c_names = [];
        const c_colors = [];
        const c_votes = [];
        Object.keys(starting_candidates).forEach(name => {
                if (name in votes)
                    c_votes.push(votes[name]);
                else
                    c_votes.push(0);
                c_names.push(name);
                c_colors.push(starting_candidates[name].color());
            }
        );

        const data = [{
            x: c_names,
            y: c_votes,
            type: 'bar',
            marker: {
                color: c_colors
            },
        }];
        const layout = {
            margin: {
                t: 20, b: 20, l: 20, r: 20
            },
            plot_bgcolor: '#444',
            paper_bgcolor: '#444',
        };
        Plotly.react(round, data, layout);
    }
}


function setup() {

    const democratic_color = 'blue';
    const republican_color = 'red';
    const independent_color = 'gray';

    const populations = {};
    populations['dem'] = new PopulationGroup("Democrats", 'dem', "blue", -.15, .1, 0);
    populations['rep'] = new PopulationGroup("Republicans", 'rep', "red", .15, .1, 0);
    populations['ind'] = new PopulationGroup("Independents", 'ind', "gray", .0, .2, 0);


    const configuration = new ConfigurationArea(10, .1, 1, 1);
    const populationArea = new PopulationArea(populations);
    const candidateArea = new CandidateArea(10, populationArea);
    const RCVArea = new RCVElection(populationArea, candidateArea, configuration);

    populationArea.set_mouseup_callback(RCVArea, RCVArea.run_rcv_election);
    configuration.set_change_callback(RCVArea, RCVArea.run_rcv_election);
    candidateArea.set_change_callback(RCVArea, RCVArea.run_rcv_election);

    configuration.configure();
    configuration.render();
    populationArea.configure();
    populationArea.render();
    candidateArea.render();

    RCVArea.render();
    RCVArea.run_rcv_election();
}

setup();

