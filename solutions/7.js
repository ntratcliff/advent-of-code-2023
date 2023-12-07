const fs = require('fs');

const input = fs.readFileSync('input/7.txt').toString();

function getCardValue (label, wildcard) {
	switch (label) {
		case 'A': return 14;
		case 'K': return 13;
		case 'Q': return 12;
		case 'J': return wildcard ? 0 : 11;
		case 'T': return 10;
		default: return parseInt(label);
	}
}

function prependType (hand) {
	// determine the type of the hand and add its value to the beginning of the hand for comparison
	let counts = {};
	hand.forEach(c => counts[c] ? counts[c]++ : counts[c] = 1);

	// handle wildcard jokers if present (0 value)
	if (counts['0']) {
		// add 0 to highest count value
		let highestCount, highestValue;
		Object.keys(counts).forEach(key => {
			if (key == '0') return;

			let count = counts[key];
			let value = parseInt(key);
			if (!highestCount || count > highestCount || (count == highestCount && value > highestValue)) { 
				highestCount = counts[key];
				highestValue = value;
			}
		});

		counts[highestValue] += counts['0'];
		delete counts['0'];
	}

	counts = Object.values(counts).sort().reverse();

	// 5 of a kind: 1
	// 4 of a kind: 2: 4, 1
	// full house: 2: 3, 2
	// three of a kind: 3: 3, 1, 1
	// two pair: 3: 2, 2, 1
	// one pair: 4
	// high card: 5
	let type = 7;
	if (counts.length == 2) {
		type -= counts[1];
	} else if (counts.length == 3) {
		type -= 2 + counts[1]
	} else if (counts.length > 3) {
		type -= 1 + counts.length;
	}

	hand.splice(0, 0, type);
	return hand;
}

function roundSort(a, b) {
	const handA = a[0], handB = b[0];

	let order = 0;
	for (let i = 0; i < handA.length; i++) {
		order = handA[i] - handB[i];
		if (order != 0) break;
	}

	return order;
}

function roundScore(s, r, i) {
	return s += r[1] * (i + 1);
}

// a round is a hand and a bid
let rounds = input.split('\n').map(
	l => l.split(' ').map(
		(s, i) => i % 2 != 0 ? parseInt(s) : prependType(s.split('').map(c => getCardValue(c)))
	)
).sort(roundSort);

console.log(`P1: ${rounds.reduce(roundScore, 0)}`);

rounds = input.split('\n').map(
	l => l.split(' ').map(
		(s, i) => i % 2 != 0 ? parseInt(s) : prependType(s.split('').map(c => getCardValue(c, true)))
	)
).sort(roundSort);

console.log(`P2: ${rounds.reduce(roundScore, 0)}`);