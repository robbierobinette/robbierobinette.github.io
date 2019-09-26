class RCVElection {
    constructor(population, candidates, configuration) {
        this.tag = 'rcv';
        this.label = "Ranked Choice Election";
        this.population = population;
        this.candidates = candidates;
        this.configuration = configuration;
        this.RCVArea = document.createElement('div');
    }

    div() {
        return this.RCVArea;
    }

    configure() {
    }

    render() {
        this.run_rcv_election();
    }

    clear_rounds() {
        while (this.RCVArea.firstChild !== null) {
            this.RCVArea.removeChild(this.RCVArea.firstChild);
        }
        const h = document.createElement("h4");
        h.innerHTML = "Ranked Choice Rounds";
        h.style.width = "100%";
        this.RCVArea.appendChild(h);
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
        let round = 1;
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
            this.draw_rcv_round(votes, cc, round);
            round += 1;
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

    draw_rcv_round(votes, candidates, round_number) {
        const starting_candidates = this.candidates.candidates;
        const rounds_div = this.RCVArea;
        rounds_div.style.display = 'flex';
        rounds_div.style['flex-wrap'] = 'wrap';
        const round_div = document.createElement("div");
        round_div.id = `round-with-${candidates.length}`;
        round_div.style.width = '11%';
        round_div.style.height = '300px';
        rounds_div.appendChild(round_div);

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
                t: 10, b: 25, l: 10, r: 10
            },
            yaxis: {
                range: [0, 6000],
            },
            plot_bgcolor: '#444',
            paper_bgcolor: '#444',
            title: {
                text: `${round_number}`,
                x: .05,
                y: .90,
                font: {
                    color: '#AfAfAf'
                },
            },
        };
        Plotly.react(round_div, data, layout);
    }
}