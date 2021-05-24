[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-4-2]
[![Node.js version][nodejs-badge]][nodejs]

# shape-editor

- [TypeScript][typescript] [4.2][typescript-4-2]
- [ESLint][eslint] with some initial rules recommendation
- [Jest][jest] for fast unit testing and code coverage
- Type definitions for Node.js and Jest
- [Prettier][prettier] to enforce consistent code style
- NPM [scripts](#available-scripts) for common operations

🤲 Free as in speech: available under the APLv2 license.

## Getting Started

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs].

Exemple :

````typescript 
window.onload = function (): void {
	const resetEl = document.createElement("button");
	resetEl.innerHTML = "Delete area";

	const saveEl = document.createElement("button");
	saveEl.innerHTML = "Save area";

	const addEl = document.createElement("button");
	addEl.innerHTML = "Add area";

	const canvasEl = document.createElement("canvas");

	const image = new Image();
	image.src = "https://static.enlaps.io/media/packshot/connecte.png";

	canvasEl.style.background = `url(${image.src})`;
	canvasEl.style.backgroundSize = `contain`;

	document.querySelectorAll(".inputs")[0].before(canvasEl);
	document.querySelectorAll(".inputs")[0].before(saveEl);
	document.querySelectorAll(".inputs")[0].before(resetEl);
	document.querySelectorAll(".inputs")[0].before(addEl);

	shapeEditor(
		[
			[157, 303, 241, 371, 272, 295],
			[484, 71, 537, 199, 566, 115]
		],
		resetEl,
		saveEl,
		addEl,
		canvasEl,
		image
	);
}; 
````

## License

Licensed under the APLv2.

[ts-badge]: https://img.shields.io/badge/TypeScript-4.2-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2014.16-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v14.x/docs/api/
[typescript]: https://www.typescriptlang.org/
[typescript-4-2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/wprod
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[travis]: https://travis-ci.org
[repo-template-action]: https://github.com/jsynowiec/node-typescript-boilerplate/generate
