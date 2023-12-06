const fs = require('fs');

const input = fs.readFileSync('input/6.txt').toString();

// process input into array of race objects
const races = input.split('\n').map(l => l.substring(9).trim().split(/ +/).map(v => parseInt(v))).reduce((ts, ds) => {
	const a = [];
	ts.forEach((t, i) => {
		a.push({time: t, distance: ds[i]});
	});
	return a;
});

function calcWins (time, distance) {
	let wins = 0;
	for (let t = 1; t < time; t++) {
		if (t * (time - t) > distance) {
			wins++;
		}
	}
	return wins;
}

// calculate number of possible winning values and multiply together
console.log(`P1 ${races.reduce((prod, race) => prod *= calcWins(race.time, race.distance), 1)}`);

// calculate number of possible wins for a combined value
const bigRace = input.split('\n').map(l => parseInt(l.substring(9).replace(/ +/g, '')));
console.log(`P2 ${calcWins(bigRace[0], bigRace[1])}`);