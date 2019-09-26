class ElectionArea {
    constructor(election_types) {
        this.election_area = document.getElementById("election_area");
        this.header = document.createElement("h3");
        this.header.innerHTML = "Election Results";
        this.election_area.appendChild(this.header);
        this.tabs = new Tabs("election_types", '#FFF', '#AAA');
        election_types.forEach(e => {
            this.tabs.add_tab(e.div(), e.label);
        });
        this.election_area.appendChild(this.tabs.div())
    }
}