import { exec } from 'child_process';
import fs from 'fs';

let info = JSON.parse(fs.readFileSync('package.json'));

let version = info.version.split('.');
version[version.length-1]++;

if (version[version.length-1] == '100')
{
	version[version.length-1] = 0;
	version[version.length-2]++;
}

info.version = version.join('.');

fs.writeFileSync('package.json', JSON.stringify(info, null, '    '));

function run (command)
{
	return new Promise ((resolve, reject) =>
	{
		console.log('\x1B[32m * ' + command + '\x1B[0m');
		exec(command, (err, stdout) =>
		{
			if (stdout)
				console.log(stdout);

			if (err) {
				console.log('\x1B[31m Error: ' + err + '\x1B[0m');
				reject(err);
				return;
			}

			resolve();
		});
	});
};

run('svn-msg-pre "" && svn-msg-pre "v'+info.version+'"')
.then(r => run('svn-commit'))
.then(r => run('git add .'))
.then(r => run('git commit -F .svn\\messages.log.old'))
.then(r => run('git push'))
.then(r => run('git tag v' + info.version))
.then(r => run('git push origin refs/tags/v'+info.version))
.then(r => run('npm publish'))

.then(() => {
	console.log();
	console.log('\x1B[93m * Published: '+info.version+'.\x1B[0m');
});
