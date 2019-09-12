class ConfigurationArea {
    constructor(n_candidates, uncertainty, party_bonus_scale, quality_scale) {
        this.n_candidates = n_candidates;
        this.party_bonus_scale = party_bonus_scale;
        this.uncertainty = uncertainty;
        this.quality_scale = quality_scale;
        this.change_callback = null;
        this.change_obj = null;
        this.config_area = document.createElement('div');
        this.config_area.id = "config_area";

        const un_sl = new Slider('uncertainty', 'Uncertainty', 0, .30, .001, this.uncertainty, this, this.update_uncertainty, this.onmouseup);
        const pty_sl = new Slider('party_bonus', 'Party Bonus', 0, 2, .01, this.party_bonus_scale, this, this.update_bonus, this.onmouseup);
        const q_sl = new Slider('quality_scale', 'Quality Scale', 0, 2, .01, this.quality_scale, this, this.update_quality, this.onmouseup);
        this.config_area.appendChild(un_sl.div());
        this.config_area.appendChild(pty_sl.div());
        this.config_area.appendChild(q_sl.div());
    }

    div() {
        return this.config_area;
    }

    set_change_callback(change_obj, change_callback) {
        this.change_obj = change_obj;
        this.change_callback = change_callback;
    }

    render() {
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