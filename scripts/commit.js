import { exec } from "child_process";

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

run('svn-commit')
.then(r => run('git add .'))
.then(r => run('git commit -F .svn\\messages.log.old'))
.then(r => run('git push'))

.then(() => {
	console.log();
	console.log('\x1B[93m * Done.\x1B[0m');
});
