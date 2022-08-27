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
		let data = fs.readFileSync(path.join(dest, fileName)).toString();
		data = data.replace(searchString, newString);
		fs.writeFileSync(path.join(dest, fileName), data);
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
    create <name>                Create a project <name> using pnpm.
    create-yarn <name>           Create a project <name> using yarn.
    create-npm <name>            Create a project <name> using npm.
`);

	process.exit();
}

const cdir = path.resolve('.');
const sdir = path.dirname(url.fileURLToPath(import.meta.url));
let manager = 'pnpm';
let dest;

switch (args[0])
{
	case 'create':
	case 'create-yarn':
	case 'create-npm':
		if (args.length < 2) {
			msg(ERROR, 'Parameter <name> missing for command `create`');
			break;
		}

		msg(INFO, 'Creating project ' + args[1] + '...');
		dest = path.join(cdir, args[1]);
		if (!fs.existsSync(dest)) fs.mkdirSync(dest);

		msg(INFO, 'Copying template ...');
		fse.copy(path.join(sdir, 'template'), dest, { overwrite: true }, function (err)
		{
			if (err) {
				msg(ERROR, err);
				return;
			}

			patch(dest, ['package.json', 'src/manifest.jsond', 'src/index.html'], 'project_name', args[1]);

			if (args[0] == 'create-yarn')
				manager = 'yarn';
			else if (args[0] == 'create-npm')
				manager = 'npm';

			if (manager !== 'pnpm')
				patch(dest, ['package.json'], 'pnpm', manager);

			msg(INFO, 'Installing dependencies ...');

			process.chdir(dest);
			run(manager + ' install').then(r => {
				msg(SUCCESS, 'Completed.');
			});
		});

		break;

	default:
		msg(ERROR, 'Unknown command: ' + args[0]);
		break;
}
