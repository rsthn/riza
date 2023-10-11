import { exec } from 'child_process';
import fs from 'fs';

let info = JSON.parse(fs.readFileSync('package.json'));

function run (command)
{
	return new Promise ((resolve, reject) => {
		console.log('\x1B[32m * ' + command + '\x1B[0m');
		exec(command, (err, stdout) => {
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

run('svn-add')
run('svn-del')
.then(r => run('svn commit -m "v'+info.version+'"'))
.then(r => run('git add .'))
.then(r => run('git commit -m "v'+info.version+'"'))
.then(r => run('git push'))
.then(r => run('git tag v'+info.version))
.then(r => run('git push origin refs/tags/v'+info.version))
.then(r => run('npm publish'))

.then(() => {
	console.log();
	console.log('\x1B[93m * Published: '+info.version+'.\x1B[0m');
});
