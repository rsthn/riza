/**
 * Version 1.0.1
 */

import fs from 'fs';
import { Template } from 'rinn';
import path from 'path';

// *************************************************************
function trimArray (arr)
{
	while (arr.length && arr[0].trim() === '')
		arr = arr.splice(0, 1);

	while (arr.length && arr[arr.length-1].trim() === '')
		arr.splice(arr.length-1, 1);

	return arr;
}

// *************************************************************
const writer =
{
	indent: null,
	output: null,

	clear: function ()
	{
		this.indent = '';
		this.output = [];
	},

	add: function (data)
	{
		this.output.push(this.indent + data);
	},

	nl: function ()
	{
		this.output.push('');
	},

	get: function ()
	{
		return this.output.join('\n');
	},

	indentUp: function ()
	{
		this.indent = this.indent + '\t';
	},

	indentDown: function ()
	{
		this.indent = this.indent.substr(0, this.indent.length-1);
	}
};

// *************************************************************
function extract (data)
{
	let state = [0];
	let buffer = [];
	let proto = [];

	data = data.split('\n');
	writer.clear();

	for (let i = 0; i < data.length; i++)
	{
		let line = data[i].trim();

		switch (state[0])
		{
			case 0:
				if (line.startsWith('//!class'))
				{
					writer.add('export ' + line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(1);
					break;
				}

				if (line.startsWith('//!namespace'))
				{
					writer.add('export ' + line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(3);
					break;
				}

				if (line.startsWith('//!declare'))
				{
					writer.add(line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(5);
					break;
				}

				if (line.startsWith('//!enum'))
				{
					writer.add('export ' + line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(7);
					break;
				}

				if (line.startsWith('//!type'))
				{
					writer.add(line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(9);
					break;
				}

				if (line.startsWith('//!interface'))
				{
					writer.add(line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(11);
					break;
				}

				if (line.startsWith('//!') || line.startsWith('//:'))
					writer.add(line.substr(3));

				break;

			case 1: // Class
				if (line === '/**')
				{
					buffer.length = 0;
					proto.length = 0;
					state.unshift(200);
					break;
				}

				if (line === '//!/class')
				{
					writer.indentDown();
					writer.add('}');
					writer.nl();
					state.shift();
					break;
				}

				if (line.startsWith('//!') || line.startsWith('//:'))
					writer.add(line.substr(3));

				break;

			case 2: // Class Member
				if (proto.length !== 0)
				{
					writer.add('/**');

					for (let line of trimArray(buffer))
						writer.add(' *' + line);

					writer.add(' */');

					for (let line of proto)
						writer.add(line);

					writer.nl();
				}

				state[0]--, i--;
				break;

			case 3: // Namespace
				if (line === '/**')
				{
					buffer.length = 0;
					proto.length = 0;
					state.unshift(200);
					break;
				}

				if (line.startsWith('//!class'))
				{
					writer.add('export ' + line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(1);
					break;
				}
				
				if (line.startsWith('//!namespace'))
				{
					writer.add('export ' + line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(3);
					break;
				}
				
				if (line.startsWith('//!declare'))
				{
					writer.add(line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(5);
					break;
				}
				
				if (line.startsWith('//!enum'))
				{
					writer.add(line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(7);
					break;
				}

				if (line.startsWith('//!type'))
				{
					writer.add(line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(9);
					break;
				}

				if (line.startsWith('//!interface'))
				{
					writer.add(line.substr(3));
					writer.add('{');
					writer.indentUp();
					state.unshift(11);
					break;
				}

				if (line === '//!/namespace')
				{
					writer.indentDown();
					writer.add('}');
					writer.nl();
					state.shift();
					break;
				}

				if (line.startsWith('//!') || line.startsWith('//:'))
					writer.add(line.substr(3));

				break;

			case 4: // Namespace Member
				if (proto.length !== 0)
				{
					writer.add('/**');

					for (let line of trimArray(buffer))
						writer.add(' *' + line);

					writer.add(' */');

					for (let line of proto)
						writer.add(line);

					writer.nl();
				}

				state[0]--, i--;
				break;

			case 5: // Declare
				if (line === '/**')
				{
					buffer.length = 0;
					proto.length = 0;
					state.unshift(200);
				}

				if (line === '//!/declare')
				{
					writer.indentDown();
					writer.add('}');
					writer.nl();
					state.shift();
					break;
				}

				if (line.startsWith('//!') || line.startsWith('//:'))
					writer.add(line.substr(3));

				break;

			case 6: // Declare Member
				if (proto.length !== 0)
				{
					writer.add('/**');

					for (let line of trimArray(buffer))
						writer.add(' *' + line);

					writer.add(' */');

					for (let line of proto)
						writer.add(line);

					writer.nl();
				}

				state[0]--, i--;
				break;

			case 7: // Enum

				if (line === '//!/enum')
				{
					writer.indentDown();
					writer.add('}');
					writer.nl();
					state.shift();
					break;
				}

				if (line.startsWith('//!') || line.startsWith('//:'))
				{
					writer.add(line.substr(3) + ',')
				}

				break;

			case 9: // Type
				if (line === '/**')
				{
					buffer.length = 0;
					proto.length = 0;
					state.unshift(200);
				}

				if (line === '//!/type')
				{
					writer.indentDown();
					writer.add('}');
					writer.nl();
					state.shift();
					break;
				}

				if (line.startsWith('//!') || line.startsWith('//:'))
					writer.add(line.substr(3));

				break;

			case 10: // Type Member
				if (proto.length !== 0)
				{
					writer.add('/**');

					for (let line of trimArray(buffer))
						writer.add(' *' + line);

					writer.add(' */');

					for (let line of proto)
						writer.add(line);

					writer.nl();
				}

				state[0]--, i--;
				break;

			case 11: // Interface
				if (line === '/**')
				{
					buffer.length = 0;
					proto.length = 0;
					state.unshift(200);
				}

				if (line === '//!/interface')
				{
					writer.indentDown();
					writer.add('}');
					writer.nl();
					state.shift();
					break;
				}

				if (line.startsWith('//!') || line.startsWith('//:'))
					writer.add(line.substr(3));

				break;

			case 12: // Interface Member
				if (proto.length !== 0)
				{
					writer.add('/**');

					for (let line of trimArray(buffer))
						writer.add(' *' + line);

					writer.add(' */');

					for (let line of proto)
						writer.add(line);

					writer.nl();
				}

				state[0]--, i--;
				break;

			case 200: // Member Comment

				if (line[0] !== '*')
					continue;

				if (line.substr(1).trim()[0] === '!')
				{
					proto.push(line.substr(1).trim().substr(1).trim());
					break;
				}

				if (line === '*/')
				{
					state.shift();
					state[0]++;
					break;
				}

				buffer.push(line.substr(1));
				break;
		}
	}

	while (state[0] == 1 || state[0] == 3 || state[0] == 5 || state[0] == 7)
	{
		writer.indentDown();
		writer.add('}');
		state.shift();
	}

	return writer.get();
}

// *************************************************************
if (process.argv.length < 3)
{
	console.log('Use: tsdoc <source-file> [<output-file>]\n');
	process.exit();
}

let data = { };

let src = path.resolve(process.argv[2]);
let dest = process.argv.length > 3 ? path.resolve(process.argv[3]) : null;

data.total = 0;
data.ok = 0;

data.path = [ path.dirname(src) ];
data.src = [ ];
data.already = { };

Template.register('debug', function (args, parts, data)
{
	console.log('\x1B[36m'+data.src[data.src.length-1]+': '+args[1]+'\x1B[0m');
});

let level = 0;

Template.register('import', function (args, parts, data)
{
	let src = path.join(args[1].startsWith('.') ? data.path[data.path.length-1] : data.path[0], args[1]);

	if (!src.endsWith('.d.ts') && !src.endsWith('.js'))
	{
		if (fs.existsSync(src+'.d.ts'))
			src += '.d.ts';
		else
			src += '.js';
	}

	let ssrc = src.substring(data.path[0].length+1);

	if (!fs.existsSync(src))
		throw new Error('File not found: ' + ssrc);

	if (src in data.already)
		return null;

	data.already[src] = true;

	data.path.push(path.dirname(src));
	data.src.push(path.basename(src));

	let contents = fs.readFileSync(src).toString('utf8');
	let empty = false;

	if (src.endsWith('.js'))
	{
		contents = extract(contents);
		empty = !contents.replace(/\[import.+?\]/g, '').trim();
	}

	let result = Template.eval(contents, data);

	if (empty) {
		console.log(' * ' + ssrc + ' \x1B[31mempty\x1B[0m');
	} else {
		console.log(' * ' + ssrc + ' \x1B[32mok\x1B[0m');
		data.ok++;
	}

	data.total++;

	result = result.trim();

	data.src.pop();
	data.path.pop();

	return result;
});

try
{
	data.initial = path.basename(src);

	let result = Template.eval('[import [initial]]', data).trim();
	if (dest !== null)
	{
		fs.writeFileSync(dest, result);
		console.log('\n\x1B[32mOperation completed ('+data.ok+'/'+data.total+': '+(100*data.ok/data.total).toFixed(2)+'%).\x1B[0m');
	}
	else
		console.log('\n' + result);
}
catch (e) {
	console.log('\x1B[93mError: ' + e.message + '\x1B[0m');
}
