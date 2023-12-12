const fs = require('fs');
const input = fs.readFileSync('input/12.txt').toString().split('\n').map(
	l => l.split(' ').map(
		(s, i) => i === 0 ? s.split('') : s.split(',').map(v => parseInt(v))
	)
);

function countGroups(map, toIndex) {
	toIndex ??= map.length;

	const groups = [];
	let count = 0;
	for (let i = 0; i < toIndex; i++) {
		if (map[i] === '#') {
			count++;
		} else if (count > 0) {
			groups.push(count);
			count = 0;
		}
	}

	if (count > 0) {
		groups.push(count);
	}

	return groups;
}

function solve(map, numbers, endIndex) {
	endIndex ??= map.length;

	const stack = [map.slice()];
	const found = new Set();

	// let iterations = 0;
	while (stack.length > 0) {
		// iterations++;
		// replace one ? with both . and # and add both states to the stack
		const map = stack.pop();

		// prune branches that are already solved
		const allGroups = countGroups(map);
		if (allGroups.length === numbers.length && allGroups.every((v, i) => v === numbers[i])) {
			const str = map.join('').replace(/\?/g, '.');
			found.add(str);
			continue;
		}

		const ui = map.indexOf('?');
		if (ui !== -1 && ui < endIndex) {
			// prune branches that are already invalid for the numbers
			const groups = countGroups(map, ui);
			if (groups.length > numbers.length) continue;

			// branches that do not have enough remaining characters to match remaining numbers
			let remainingSum = numbers.length - groups.length - 1;
			for (let n = groups.length; n < numbers.length; n++) {
				remainingSum += numbers[n];
			}

			if (map.length - ui < remainingSum) {
				continue;
			}

			// branches where something before the ? does not equal the numbers
			if (groups.length > numbers.length || !groups.every((m, i, a) =>
				m === numbers[i] ||
				(i === a.length - 1 && m < numbers[i] && map[ui-1] === '#')
			)) {
				continue;
			}

			map[ui] = '.';
			stack.push(map.slice());
			map[ui] = '#';
			stack.push(map.slice());
		} else {
			const str = map.join('');
			if (found.has(str)) continue; // quick out

			// check if the current state satisfies the numbers
			const groups = countGroups(map, endIndex);
			if (groups.length === numbers.length && groups.every((v, i) => v === numbers[i])) {
				found.add(str);
			}
		}
	}

	// console.log(`Took ${iterations} iterations`);

	return found;
}

// for each row find possible states that satisfy the numbers
console.log(`P1: ${input.reduce((sum, row) => sum += solve(row[0], row[1]).size, 0)}`);

// TODO: P2 is not fast enough to be a valid solution :^(
// for each row find possible states that satisfy the numbers
const count = input.reduce((sum, row, i) => {
	// console.log(i);

	// "unfold" the values
	let unfoldedMap = Array(5).fill(row[0].join('')).join('?').split('');
	let numbers = Array(5).fill(row[1]).flat();

	const found = solve(unfoldedMap, numbers);

	return sum += found.size;
}, 0);

console.log(`P2: ${count}`);