const fs = require('fs');

const input = fs.readFileSync('input/8.txt').toString().split('\n');

const instructions = input[0].split('');

const map = input.slice(2).reduce((m, l) => {
	m[l.substring(0, 3)] = {
		L: l.substring(7, 10),
		R: l.substring(12, 15)
	};

	return m;
}, {})

// P1
let steps = 0;
let location = 'AAA';

while (location != 'ZZZ') {
	location = map[location][instructions[steps % instructions.length]];
	steps++;
}

console.log(`P1 ${steps}`);

const locations = Object.keys(map).filter(v => v.endsWith('A'));
steps = new Array(locations.length).fill(0);

// P2
// calculate number of steps for each location then find the least common multiple
locations.forEach((location, i) => {
	while (!location.endsWith('Z')) {
		location = map[location][instructions[steps[i] % instructions.length]];
		steps[i]++;
	}
});

function gcd(a, b) {
	return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
	return a / gcd(a, b) * b;
}

console.log(`P2 ${steps.reduce(lcm)}`);
