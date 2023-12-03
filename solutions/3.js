const fs = require('fs');

/*
--- Day 3: Gear Ratios ---
You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source,
but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone!
The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If
you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers
and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part
number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58
(middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine
schematic?
*/

const input = fs.readFileSync('input/3.txt').toString().split('\n');

// create an array of all part numbers, their line number, and their start/end index 
const parts = input.reduce((a, l, i) => {

	const la = [];
	const regex = /\d+/g;

	while ((match = regex.exec(l)) != null) {
		la.push({
			number: parseInt(match[0]),
			startIndex: match.index,
			endIndex: match.index + match[0].length - 1
		});
	}

	a.push(la);
	return a;
}, []);

// now let's find symbols and add numbers adjacent to a sum
let sum = input.reduce((s, l, i) => {

	const regex = /[^\d\.]/g;

	while ((match = regex.exec(l)) != null) {
		// find parts on previous, current, and next lines that are adjacent and add to sum
		const si = match.index;
		for (let line = Math.max(i-1, 0); line <= Math.min(i+1, parts.length); line++) {
			parts[line].forEach((part) => {
				if (si >= part.startIndex - 1 && si <= part.endIndex + 1) {
					s += part.number;
				}
			});
		}
	}

	return s;
}, 0);

console.log(`P1: ${sum}`);

/*
--- Part Two ---
The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the
closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone
labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a
phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is
adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which
gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio
is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because
it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?
*/

// find parts adjacent to a * symbol and add their product to a sum only if there are 2
sum = input.reduce((s, l, i) => {

	const regex = /\*/g;

	while ((match = regex.exec(l)) != null) {
		// find parts on previous, current, and next lines that are adjacent and add to array
		const si = match.index;
		const adj = [];
		for (let line = Math.max(i-1, 0); line <= Math.min(i+1, parts.length); line++) {
			parts[line].forEach((part) => {
				if (si >= part.startIndex - 1 && si <= part.endIndex + 1) {
					adj.push(part.number);
				}
			});
		}

		if (adj.length == 2) {
			s += adj[0]*adj[1];
		}
	}

	return s;
}, 0);

console.log(`P2: ${sum}`)