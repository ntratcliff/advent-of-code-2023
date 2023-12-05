const fs = require('fs');


const input = fs.readFileSync('input/5.txt').toString();

const seeds = input.substring(7, input.indexOf('\n')).split(' ').map(v => parseInt(v));

// console.log(seeds);

// generate array arrays of ranges for each map
const maps = input.split(/\n\n.*?:\n/gm).slice(1).map(
	m => m.split('\n').map(r => r.split(' ').map(v => parseInt(v)))
		.map(r => ({ out: r[0], in: r[1], range: r[2] }))
);

// console.log(maps);

// find lowest location value mapped to a seed
let lowestLocation = seeds.reduce((lowest, seed) => {
	// send seed through maps to get location
	const location = maps.reduce((value, current) => {
		// find range that contains value as an input
		for (let i = 0; i < current.length; i++) {
			const cr = current[i];
			const mv = value - cr.in;
			if (mv >= 0 && mv <= cr.range) {
				return cr.out + mv;
			}
		}

		// map 1=>1 if no matching range above
		return value;
	}, seed);

	return Math.min(lowest, location);
}, Infinity);

console.log(`P1: ${lowestLocation}`);

const seedsRange = seeds.reduce((a, v, i, s) => { 
	if (i % 2 == 0) {
		a.push({ start: v, length: s[i+1]});
	}

	return a;
}, []);

// TODO: optimize me! :^)
lowestLocation = seedsRange.reduce((lowest, seedRange) => {

	// send each seed value through maps to get location
	let localLowest = Infinity;
	for (let seed = seedRange.start; seed <= seedRange.start + seedRange.length; seed++) {
		const location = maps.reduce((value, current) => {
			// find range that contains value as an input
			for (let i = 0; i < current.length; i++) {
				const cr = current[i];
				const mv = value - cr.in;
				if (mv >= 0 && mv <= cr.range) {
					return cr.out + mv;
				}
			}

			// map 1=>1 if no matching range above
			return value;
		}, seed);

		localLowest = Math.min(localLowest, location);
	}


	return Math.min(lowest, localLowest);
}, Infinity);

console.log(`P2: ${lowestLocation}`);