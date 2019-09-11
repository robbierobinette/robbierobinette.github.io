class Candidate {
    constructor(name, ideology_score, quality, population, population_area, candidate_area) {
        this.name = name;
        this.population = population;
        this.ideology_score = ideology_score;
        this.quality = quality;
        this.configure();
        this.change_callback = null;
        this.population_area = population_area;
        this.candidate_area = candidate_area;
        this.incumbent = false;
    }

    configure() {
        const candidate_area = document.createElement("div");
        candidate_area.id = "candidate_" + this.name;
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
        this.remove_button = new Button(`remove-${this.name}`, 'remove', this, this.onremove);

        candidate_area.appendChild(this.ideology_slider.div());
        candidate_area.appendChild(this.quality_slider.div());
        candidate_area.appendChild(this.party_selector.div());
        // candidate_area.appendChild(this.incumbent_box.div());
        candidate_area.appendChild(this.remove_button.div());
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

    onremove(checkbox) {
        this.candidate_area.remove_candidate(this.name);
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