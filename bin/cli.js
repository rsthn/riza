#!/usr/bin/env node

import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import url from 'url';
import { spawn } from 'child_process';

const INFO = '\x1B[90m';
const ERROR = '\x1B[91m(error)\x1B[0m ';
const HIGHLIGHT = '\x1B[36m';
const RESET = '\x1B[0m';
const WHITE = '\x1B[97m';

function msg (type, message) {
    console.log(type + message + RESET);
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

function run (command, args)
{
    return new Promise ((resolve, reject) =>
    {
        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true
        });
    
        child.on('error', (error) => {
            msg(ERROR, `Error: ${error.message}`);
            reject();
        });
    
        child.on('close', (code) => {
            if (code !== 0) {
                msg(ERROR, `Command failed with exit code ${code}`);
                reject();
            } else {
                resolve();
            }
        });
    });
};

function detectPackageManager() {
    const userAgent = process.env.npm_config_user_agent || '';
    if (userAgent.includes('yarn'))
        return 'yarn';
    else if (userAgent.includes('pnpm'))
        return 'pnpm';
    return 'npm';
}

let pm = detectPackageManager();

const args = process.argv.slice(2);
if (args.length == 0)
{
    console.log(
`Syntax:
    riza <command> [options]

Command:
    new [<template>] <name>          Create a new project <name> using the auto-detected package manager.
    new:pnpm [<template>] <name>     Create a new project <name> using pnpm.
    new:yarn [<template>] <name>     Create a new project <name> using yarn.
    new:npm [<template>] <name>      Create a new project <name> using npm.

Templates:
    classic
    minimal (default)
    app (beta)
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
    case 'new_yarn':
    case 'new_npm':
    case 'new_pnpm':
        if (args.length < 2) {
            msg(ERROR, 'Parameter <name> missing for command `new`');
            break;
        }

        if (args.length < 3) {
            args[2] = args[1];
            args[1] = 'minimal';
        }

        if (args[1] != 'app' && args[1] != 'minimal') {
            msg(ERROR, 'Parameter <template> is incorrect: ' . args[1]);
            break;
        }

        if (args.length < 3) {
            msg(ERROR, 'Parameter <name> missing for command `new`');
            break;
        }

        msg(INFO, '\nCreating project folder ' + WHITE + args[2] + INFO + '...');
        dest = path.join(cdir, args[2]);
        if (!fs.existsSync(dest))
            fs.mkdirSync(dest);

        msg(INFO, 'Copying files for ' + WHITE + args[1] + INFO + ' template ...');
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
            else if (args[0] == 'new:pnpm')
                manager = 'pnpm';
            else
                manager = pm;

            if (manager !== 'pnpm')
                patch(dest, ['package.json'], 'pnpm', manager);

            msg(INFO, 'Running ' + HIGHLIGHT + manager + ' install ' + INFO + '...\n');
            process.chdir(dest);
            run(manager + ' install').then(() => {
                msg(WHITE, '\n✨ Done');
            });
        });

        break;

    default:
        msg(ERROR, 'Unknown command: ' + args[0]);
        break;
}
