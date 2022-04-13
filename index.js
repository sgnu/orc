const rateElement = document.getElementById('rate');
const initialBPMElement = document.getElementById('initial-bpm');
const changedBPMElement = document.getElementById('changed-bpm');
const initialARElement = document.getElementById('initial-ar');
const changedARElement = document.getElementById('changed-ar');
const initialODElement = document.getElementById('initial-od');
const changedODElement = document.getElementById('changed-od');

let initial = true; // Represents if changing initial -> changed

function getValues() {
    return {
        rate: Number(rateElement.value),
        initialBPM: Number(initialBPMElement.value),
        changedBPM: Number(changedBPMElement.value),
        initialAR: Number(initialARElement.value),
        changedAR: Number(changedARElement.value),
        initialOD: Number(initialODElement.value),
        changedOD: Number(changedODElement.value),
    }
}

function calculateAR(approachTime) {
    // AR = 5 if time = 1200
    // AR (if under 5) = 15 - 5(time) / 600
    // AR (if above 5) = (6000 - 5t) / 750 + 5
    if (approachTime > 1200) {
        return 15 - (5 * approachTime / 600);
    } else if (approachTime < 1200) {
        return ((6000 - 5 * approachTime) / 750) + 5;
    } else {
        return 5
    }
}

function calculateApproachTime(approachRate) {
    // https://osu.ppy.sh/wiki/en/Beatmapping/Approach_rate
    if (approachRate < 5) {
        return 1200 + 600 * (5 - approachRate) / 5;
    } else if (approachRate > 5) {
        return 1200 - 750 * (approachRate - 5) / 5;
    } else {
        return 1200;
    }
}

function arChange(approachRate, rateChange, reversed) {
    const approachTime = calculateApproachTime(approachRate);
    if (reversed) {
        return calculateAR(approachTime * rateChange);
    } else {
        return calculateAR(approachTime / rateChange);
    }
}

function calculate300Window(overallDifficulty) {
    return 80 - (6 * overallDifficulty);
}

function calculateOD(window) {
    return (80 - window) / 6;
}

function odChange(overallDifficulty, rateChange, reversed) {
    const window = calculate300Window(overallDifficulty);
    if (reversed) {
        return calculateOD(window * rateChange);
    } else {
        return calculateOD(window / rateChange);
    }
}

function round(number, digits) { // digits after decimal point
    return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits)
}

function rateChangeEvent() {
    bpmChangeEvent();
    arChangeEvent();
    odChangeEvent();
}

function bpmChangeEvent() {
    const values = getValues();
    if (initial) {
        changedBPMElement.value = round(values.initialBPM * values.rate, 0);
    } else {
        initialBPMElement.value = round(values.changedBPM / values.rate, 0);
    }
}

function arChangeEvent() {
    const values = getValues();
    if (initial) {
        changedARElement.value = round(arChange(values.initialAR, values.rate, false), 1);
    } else {
        initialARElement.value = round(arChange(values.changedAR, values.rate, true), 1);
    }
}

function odChangeEvent() {
    const values = getValues();
    if (initial) {
        changedODElement.value = round(odChange(values.initialOD, values.rate, false), 1);
    } else {
        initialODElement.value = round(odChange(values.changedOD, values.rate, true), 1);
    }
}

rateElement.oninput = rateChangeEvent;
initialBPMElement.oninput = function() {
    initial = true;
    bpmChangeEvent();
};
initialARElement.oninput = function() {
    initial = true;
    arChangeEvent();
};
initialODElement.oninput = function() {
    initial = true;
    odChangeEvent();
};
changedBPMElement.oninput = function() {
    initial = false;
    bpmChangeEvent();
};
changedARElement.oninput = function() {
    initial = false;
    arChangeEvent();
};
changedODElement.oninput = function() {
    initial = false;
    odChangeEvent();
};