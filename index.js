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