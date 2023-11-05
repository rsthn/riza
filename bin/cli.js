#!/usr/bin/env node

import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import url from 'url';
import { exec } from 'child_process';

const INFO = '\x1B[32m';
const ERROR = '\x1B[91m(error)\x1B[0m ';
const SUCCESS = '\x1B[92m';
const BLANK = '\x1B[0m';
const WHITE = '\x1B[97m';

function msg (type, message) {
	console.log(WHITE + 'riza: ' + type + message + BLANK);
}

function patch (dest, fileNames, searchString, newString)
{
	searchString = new RegExp(searchString, 'g');

	for (let fileName of fileNames)
	{
		let filePath = path.join(dest, fileName);
		if (!fs.existsSync(filePath)) continue;

		let data = fs.readFileSync(filePath).toString();
		data = data.replace(searchString, newString);
		fs.writeFileSync(filePath, data);
	}
}

function run (command)
{
	return new Promise ((resolve, reject) => {
		exec(command, (err, stdout) => {

			if (err) {
				msg(ERROR, err);
				reject(err);
				return;
			}

			resolve();
		});
	});
};

console.log('');

const args = process.argv.slice(2);
if (args.length == 0)
{
	console.log(
`Syntax:
    riza <command> [options]

Command:
    new [<template>] <name>              Create a new project <name> using pnpm.
    new:yarn [<template>] <name>         Create a new project <name> using yarn.
    new:npm [<template>] <name>          Create a new project <name> using npm.

Template:
    app
    app-jsx (default)
`);

	process.exit();
}

const cdir = path.resolve('.');
const sdir = path.dirname(url.fileURLToPath(import.meta.url));
let manager = 'pnpm';
let dest;

switch (args[0])
{
	case 'new':
	case 'new-yarn':
	case 'new-npm':
		if (args.length < 2) {
			msg(ERROR, 'Parameter <name> missing for command `new`');
			break;
		}

        if (args.length < 3) {
            args[2] = args[1];
            args[1] = 'app-jsx';
        }

		if (args[1] != 'app' && args[1] != 'app-jsx') {
			msg(ERROR, 'Parameter <template> is incorrect, should be: `app` or `app-jsx`');
			break;
		}

		if (args.length < 3) {
			msg(ERROR, 'Parameter <name> missing for command `new`');
			break;
		}

		msg(INFO, 'Creating project ' + args[2] + ' ...');
		dest = path.join(cdir, args[2]);
		if (!fs.existsSync(dest)) fs.mkdirSync(dest);

		msg(INFO, 'Copying template for ' + args[1] + ' ...');
		fse.copy(path.join(sdir, args[1]), dest, { overwrite: true }, function (err)
		{
			if (err) {
				msg(ERROR, err);
				return;
			}

			patch(dest, ['package.json', 'src/manifest.jsond', 'src/index.html'], 'project_name', args[2]);

			if (args[0] == 'new:yarn')
				manager = 'yarn';
			else if (args[0] == 'new:npm')
				manager = 'npm';

			if (manager !== 'pnpm')
				patch(dest, ['package.json'], 'pnpm', manager);

			msg(SUCCESS, 'Please run `'+manager+' install`\nCompleted.');
		});

		break;

	default:
		msg(ERROR, 'Unknown command: ' + args[0]);
		break;
}
