class PrimaryElection {
    constructor() {
        this.tag = "primary";
        this.label = "Primary Election";
        this.election_area = document.createElement("div");
        this.election_area.id = "primary election area";
        const p = document.createElement("p");
        p.innerHTML = "This is a sample.";
        this.election_area.appendChild(p);
    }
    div() {
        return this.election_area;
    }
}