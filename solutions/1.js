const fs = require('fs');

let sum = fs.readFileSync('input/1.txt').toString().split('\n').reduce((s,v) => {
	const m = v.match(/\d/g);
	return s + parseInt(`${m.at(0)}${m.at(-1)}`);
}, 0);

console.log(`P1: ${sum}`);

sum = fs.readFileSync('input/1.txt').toString()
	.split('\n')
	.reduce((s,v) => {
		// match with lookahead then lookbehind
		const valStr = [
			v.match(/one|two|three|four|five|six|seven|eight|nine|\d/g)[0],
			v.match(/.*(one|two|three|four|five|six|seven|eight|nine|\d)/)[1]
		].join('')
		.replace(/one/g, '1')
		.replace(/two/g, '2')
		.replace(/three/g, '3')
		.replace(/four/g, '4')
		.replace(/five/g, '5')
		.replace(/six/g, '6')
		.replace(/seven/g, '7')
		.replace(/eight/g, '8')
		.replace(/nine/g, '9');

		return s + parseInt(valStr);
	}, 0);

console.log(`P2: ${sum}`);