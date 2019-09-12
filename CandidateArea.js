class CandidateArea {
    constructor(n_candidates, population_area) {
        this.population_area = population_area;
        this.n_candidates = n_candidates;
        this.candidates = {};
        for (let i = 0; i < this.n_candidates; ++i) {
            let population = population_area.populations['ind'];
            const is = Number(-.5 + i / (this.n_candidates - 1)).toFixed(2);
            if (is < -.15) population = population_area.populations['dem'];
            if (is > .15) population = population_area.populations['rep'];
            this.add_candidate(is, population);
        }
        this.candidates_div = document.createElement("div");
        this.candidates_div.style.display = "float";
        this.candidates_div.style.contain = "both";
        this.add_candidates();
    }
    div() {
        return this.candidates_div;
    }

    remove_candidate(candiate_name) {
        delete this.candidates[candiate_name];
        this.add_candidates();
        this.onchange();
    }

    add_candidates() {
        while (this.candidates_div.firstChild) {
            this.candidates_div.removeChild(this.candidates_div.firstChild);
        }

        this.add_headers(this.candidates_div);
        Object.values(this.candidates).forEach(c => {
            this.candidates_div.appendChild(c.div);
        });

        const add_button = document.createElement("button");
        add_button.innerHTML = "Add Candidate";
        const obj = this;
        add_button.onclick = function () {
            obj.add_candidate(0, obj.population_area.populations['ind']);
            obj.configure();
            obj.onchange()
        };
        this.candidates_div.appendChild(add_button);
    }

    add_candidate(ideology_score, population) {
        let i = Object.values(this.candidates).length;
        let c_name = `candidate-${i}`;
        while (c_name in this.candidates) {
            i += 1;
            c_name = `candidate-${i}`;
        }
        const candidate = new Candidate(c_name, ideology_score, 0, population, this.population_area, this);
        candidate.set_change_callback(this, this.onchange);
        this.candidates[candidate.name] = candidate;
    }

    add_headers(candidate_area) {
        const headings = document.createElement("div");
        headings.id = "candidate_" + this.name;
        headings.style.width = "100%";
        headings.style.display = "flex";
        headings.style['justify-content'] = 'space-around';
        headings.style['background-color'] = '#444';
        headings.style.color = '#FFF';

        const titles = ["Name", "Ideology", "Quality", "Party"];

        titles.forEach(header => {
            const heading_block = document.createElement("label");
            heading_block.innerHTML = header;
            heading_block.style.width = '20%';
            headings.appendChild(heading_block);
        });
        candidate_area.appendChild(headings)
    }

    set_change_callback(change_obj, change_callback) {
        this.change_obj = change_obj;
        this.change_callback = change_callback;
    }

    onchange() {
        if (this.change_callback !== null)
            this.change_callback.call(this.change_obj, this);
    }

    render() {
    }
}
