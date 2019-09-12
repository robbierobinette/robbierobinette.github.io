class PopulationArea {
    constructor(populations) {
        this.populations = populations;
        Object.values(this.populations).forEach(p => {
            p.set_change_callback(this, this.onchange);
            p.set_mouseup_callback(this, this.onmouseup)
        });

        this.change_callback = null;
        this.mouseup_callback = null;

        this.voters =  document.createElement('div');
        this.voters.id = "voters_inner";
        this.voters.style.display = "flex";
        this.voters.style['flex-wrap'] = 'wrap';
        Object.values(this.populations).forEach(p => {
            this.voters.appendChild(p.configure());
        });
        this.configure_combined_pop();
        this.voters.appendChild(this.combined_pop);
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
            paper_bgcolor: '#222',
            title: {
                text: "Combined Ideology",
                x: .05,
                y: .90,
                font: {
                    color: '#7f7f7f'
                }
            },
        };
    }

    update_combined_pop() {
        const traces = Object.values(this.populations).map(p => p.getTrace());
        const layout = this.get_pop_layout();
        const container = document.getElementById("combined_plotdiv");

        Plotly.react(container, traces, layout);
    }

    div() {
        return this.voters;
    }

    configure_combined_pop() {
        const combined_pop = document.createElement("div");
        combined_pop.id = 'combined_population';
        combined_pop.style.width = '25%';
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