
class Voter {
    constructor(population) {
        this.population = population;
        this.ideology_score = population.draw_sample()
    };

    party_bonus(candidate) {
        return this.population.party_bonus(candidate.population)
    }
}