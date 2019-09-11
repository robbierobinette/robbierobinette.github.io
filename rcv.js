
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



function setup() {

    const democratic_color = 'blue';
    const republican_color = 'red';
    const independent_color = 'gray';

    const populations = {};
    populations['dem'] = new PopulationGroup("Democrats", 'dem', "blue", -.15, .2, 0);
    populations['rep'] = new PopulationGroup("Republicans", 'rep', "red", .15, .2, 0);
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
