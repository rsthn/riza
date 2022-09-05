
import syntaxJsx from '@babel/plugin-syntax-jsx';
import * as t from "@babel/types";

const hasCallExpression = function (path)
{
	let i = { found: false };

	path.traverse({
		CallExpression (path) {
			this.found = true;
			path.stop();
		},

		JSXSpreadChild (path) {
			this.found = true;
			path.stop();
		}
	}, i);

	return i.found;
};

const hasRequiredImports = function (path)
{
	let i = { effect: false, helpers: false };

	path.traverse({
		ImportSpecifier: function (path) {
			switch (path.node.imported.name)
			{
				case 'effect':
					this.effect = path.node.local.name; break;

				case 'helpers':
					this.helpers = path.node.local.name; break;
			}
		}
	}, i);

	return i;
};

const hasJsxExpression = function (path)
{
	let i = { found: false };

	path.traverse({

		JSXExpressionContainer (path) {
			this.found = true;
			path.stop();
		},

		JSXSpreadChild (path) {
			this.found = true;
			path.stop();
		},

		CallExpression (path) {
			if (path.node.isJsx === true) {
				this.found = true;
				path.stop();
			}
		}

	}, i);

	return i.found;
};

const flattenJsxElement = function (path)
{
	path.traverse(flattenJsxVisitor);

	let expr = ['<' + path.node.openingElement.name.name];

	for (let attr of path.node.openingElement.attributes)
	{
		switch (attr.type)
		{
			case 'JSXAttribute':
				if (attr.value !== null)
					expr.push(attr.name.name + '="' + attr.value.value + '"');
				else
					expr.push(attr.name.name);
				break;

			default:
				console.log('FlattenIssue: ' + attr.type);
				break;
		}
	}

	expr = [expr.join(' ')+'>'];

	for (let child of path.node.children)
	{
		if (t.isStringLiteral(child))
			expr.push(child.value);
		else
			expr.push(child);
	}

	expr.push('</'+path.node.openingElement.name.name+'>');

	for (let i = 1; i < expr.length; i++)
	{
		if (typeof expr[i-1] === 'string' && typeof expr[i] === 'string')
		{
			expr[i-1] = expr[i-1] + expr[i];
			expr.splice(i, 1);
			i--;
		}
	}

	expr = expr.reduce((prev, curr) => {
		curr = typeof curr === 'string' ? t.stringLiteral(curr) : curr;
		return prev ? t.binaryExpression('+', prev, curr) : curr;
	}, null);

	return expr;
};

const flattenJsxVisitor = 
{
	JSXElement (path)
	{
		path.replaceWith(flattenJsxElement(path));
	},

	JSXText (path) {
		path.replaceWith(t.stringLiteral(path.node.value));
	}
};

const flattenJsxPath = function (path)
{
	path.traverse(flattenJsxVisitor);

	let elem = flattenJsxElement(path);
	elem.isJsx = true;

	path.replaceWith(elem);
};

const isNativeElement = function (tagName)
{
	return false;
}

export default function ()
{
	const visitor = 
	{
		Program:
		{
			enter (path)
			{
				this.context = {
					importedAll: false,
					imported: { effect: false, helpers: false },
					_effect: t.identifier('effect'),
					_helpers: t.identifier('_helpers'),
					_replaceNode: t.identifier('replaceNode'),
					_spreadAttributes: t.identifier('spreadAttributes'),
					level: 0,
					decl: [],
					nextId: -1,
					getId: function() {
						return '_$' + (++this.nextId);
					}
				};
			},

			exit (path)
			{
				if (!this.context.importedAll)
				{
					let list = [];

					if (!this.context.imported.effect) list.push(t.importSpecifier(this.context._effect, this.context._effect));
					if (!this.context.imported.helpers) list.push(t.importSpecifier(this.context._helpers, this.context._helpers));

					path.unshiftContainer('body', t.importDeclaration(list, t.stringLiteral('riza')));
				}

				path.unshiftContainer('body', this.context.decl);
			}
		},

		ImportDeclaration (path)
		{
			if (this.context.importedAll || path.node.source.value !== 'riza')
				return;

			let info = hasRequiredImports(path);

			if (info.effect) {
				this.context._effect.name = info.effect;
				this.context.imported.effect = true;
			}

			if (info.helpers) {
				this.context._helpers.name = info.helpers;
				this.context.imported.helpers = true;
			}

			this.context.importedAll = true;

			for (let i in this.context.imported)
				this.context.importedAll &&= this.context.imported[i];
		},

		JSXFragment (path)
		{
			path.node.openingElement = path.node.openingFragment;
			path.node.openingElement.name = t.identifier('div');

			if (typeof visitor.JSXElement === 'function')
				visitor.JSXElement.call (this, path);
			else
				visitor.JSXElement.enter[0].call (this, path);
		},

		JSXElement (path)
		{
			this.context.level++;
			path.traverse(visitor, this);

			let tagName = path.node.openingElement.name.name;
			let placeholder = 'span';

			switch (tagName.toLowerCase())
			{
				case 'br':
				case 'hr':
					path.replaceWith(t.stringLiteral(`<${tagName}/>`));
					this.context.level--;
					return;
	
				case 'table':
					placeholder = 'tbody';
					break;

				case 'tbody':
				case 'thead':
				case 'tfoot':
					placeholder = 'tr';
					break;

				case 'tr':
					placeholder = 'td';
					break;

				case 'select':
					placeholder = 'option';
					break;
			}

			// *********************************
			// Using element previously defined.

			if (path.scope.hasBinding(tagName) && !isNativeElement(tagName))
			{
				let props = [];
				let children = [];
				let isDynamic = false;

				for (let i in path.node.openingElement.attributes)
				{
					let attr = path.node.openingElement.attributes[i];
					let value = attr.value ?? t.booleanLiteral(true);

					if (attr.type === 'JSXSpreadAttribute')
					{
						props.push(t.spreadElement(attr.argument));
						continue;
					}

					// Detect `dynamic` attribute.
					if (attr.name.name === 'dynamic')
						isDynamic = value;

					// Style attribute can be set using a string, object or an expression.
					if (attr.name.name.toLowerCase() === 'style')
					{
						if (t.isStringLiteral(value))
						{
							value = t.stringLiteral(
								value.value.split('\n').map(i => i.trim()).join(' ').trim()
							);
						}
					}
					else
					{
						if (value.type === 'JSXExpressionContainer')
							value = value.expression;
					}

					if (attr.name.type === 'JSXIdentifier')
						props.push(t.objectProperty(t.stringLiteral(attr.name.name), value));
					else
						props.push(t.objectProperty(attr.name, value));
				}

				for (let i in path.node.children)
				{
					let child = path.node.children[i];

					switch (child.type)
					{
						case 'JSXSpreadChild':
							children.push(t.spreadElement(child.expression));
							child = null;
							break;

						case 'JSXExpressionContainer':
							children.push(child.expression);
							child = null;
							break;

						case 'StringLiteral':
							if (child.isJsx === true) {
								children.push(t.arrayExpression([child]));
								child = null;
							}
							break;

						case 'CallExpression':
							if (child.isJsx === true && isDynamic) {
								children.push(child.callee);
								child = null;
							}
							break;
					}

					if (child !== null) {
						children.push(child);
					}
				}

				// Trim the first.
				while (children.length > 0 && children[0].type === 'StringLiteral')
				{
					let value = children[0].value.replace(/^\s+/gm, '');
					if (!value.length) {
						children.splice(0, 1);
						continue;
					}

					children[0] = t.stringLiteral(value);
					break;
				}

				// Trim the last.
				while (children.length > 0 && children[children.length-1].type === 'StringLiteral')
				{
					let value = children[children.length-1].value.replace(/\s+$/gm, '');
					if (!value.length) {
						children.splice(children.length-1, 1);
						continue;
					}

					children[children.length-1] = t.stringLiteral(value);
					break;
				}

				let tmp = t.callExpression(t.identifier(tagName), [t.objectExpression(props), children.length ? t.arrayExpression(children) : t.nullLiteral()]);
				tmp.isJsx = true;
				path.replaceWith(
					tmp
				);

				this.context.level--;
				return;
			}

			// Convert node to just a HTML string when possible.
			if (this.context.level > 1)
			{
				if (!path.findParent(p => p.type === 'JSXExpressionContainer') && !hasJsxExpression(path))
				{
					flattenJsxPath(path);
					path.skip();
					this.context.level--;
					return;
				}
			}

			let _id = t.identifier(this.context.getId());

			let _body = [];
			let fn = t.functionExpression(null, [t.identifier('props'), t.identifier('children')], t.blockStatement(_body));
			let _e = t.identifier('_$e');
			let _c = t.identifier('_$c');

			_body.push(
				t.variableDeclaration('let', [
					t.variableDeclarator(_e, t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createElement')), [
						t.stringLiteral(tagName)
					]))
				])
			);

			// Process attributes.
			let _setAttribute = t.identifier('setAttribute');
			let _style = t.identifier('style');
			let _i = t.identifier('i');
			let _t = t.identifier('t');
			let _querySelector = t.identifier('querySelector');

			for (let i in path.node.openingElement.attributes)
			{
				let attr = path.node.openingElement.attributes[i];
				let attrPath = path.get('openingElement.attributes.' + i);
				let expr = null, value = attr.value ?? t.stringLiteral('');

				if (attr.type === 'JSXSpreadAttribute')
				{
					_body.push(t.callExpression(t.memberExpression(this.context._helpers, this.context._spreadAttributes), [_e, attr.argument]));
					continue;
				}

				// Style attribute can be set using a string, object or an expression.
				if (attr.name.name.toLowerCase() === 'style')
				{
					if (t.isStringLiteral(value))
					{
						value = t.stringLiteral(
							value.value.split('\n').map(i => i.trim()).join(' ').trim()
						);
					}
					else
					{
						switch (value.expression.type)
						{
							case 'CallExpression':
								expr = t.callExpression(this.context._effect, [
									t.arrowFunctionExpression([], t.blockStatement([
										t.expressionStatement(
										t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
											t.memberExpression(_e, _style),
											value.expression
										]))
									]))
								]);
								break;

							case 'ObjectExpression':
								let obj = [];

								for (let i in value.expression.properties)
								{
									let hasCall = hasCallExpression(attrPath.get('value.expression.properties.' + i));
									let prop = value.expression.properties[i];

									if (!hasCall)
									{
										obj.push(t.objectProperty(prop.key, prop.value));
										continue;
									}

									switch (prop.value.type)
									{
										default:
											expr = t.callExpression(this.context._effect, [
												t.arrowFunctionExpression([], t.blockStatement([
													t.expressionStatement(
													t.assignmentExpression('=',
														t.memberExpression(t.memberExpression(_e, _style), prop.key),
														prop.value
													))
												]))
											]);

											_body.push(t.expressionStatement(expr));
											break;
									}
								}

								if (obj.length)
								{
									expr = t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
										t.memberExpression(_e, _style),
										t.objectExpression(obj)
									]);
								}
								else
									expr = false;

								break;

							default:
								break;
						}
					}
				}
				else
				{
					if (value.type === 'JSXExpressionContainer')
					{
						if (attr.name.name.startsWith('on'))
						{
							expr = t.assignmentExpression('=', t.memberExpression(_e, t.identifier(attr.name.name.toLowerCase())), value.expression);
						}
						else
						{
							expr = t.callExpression(this.context._effect, [
								t.arrowFunctionExpression([], t.blockStatement([
									t.expressionStatement(
										t.callExpression(t.memberExpression(this.context._helpers, _setAttribute), [ _e, t.stringLiteral(attr.name.name), value.expression ])
									)
								]))
							]);
						}
					}
				}

				if (expr === null)
					expr = t.callExpression(t.memberExpression(this.context._helpers, _setAttribute), [ _e, t.stringLiteral(attr.name.name), value ]);

				if (expr)
					_body.push(t.expressionStatement(expr));
			}

			/* ** */
			let inner = [];
			let elems = [];
			let strings = 0;

			for (let i in path.node.children)
			{
				let child = path.node.children[i];
				let hasCall = hasCallExpression(path.get('children.' + i));

				switch (child.type)
				{
					case 'JSXExpressionContainer':
						if (hasCall) {
							inner.push(t.stringLiteral(`<${placeholder} data-__id='${elems.length}'></${placeholder}>`));
							elems.push(child.expression);
						}
						else
						{
							if (child.expression.type === 'StringLiteral') {
								inner.push(t.stringLiteral(child.expression.value));
								strings++;
							}
							else
								inner.push(child.expression);
						}
						break;

					case 'JSXSpreadChild':
						inner.push(t.stringLiteral(`<${placeholder} data-__id='${elems.length}'></${placeholder}>`));
						elems.push(child.expression);
						break;
	
					case 'StringLiteral':
						inner.push(t.stringLiteral(child.value));
						strings++;
						break;

					case 'CallExpression':
						inner.push(t.stringLiteral(`<${placeholder} data-__id='${elems.length}'></${placeholder}>`));
						elems.push(child);
						break;

					default:
						if (hasCall) {
							inner.push(t.stringLiteral(`<${placeholder} data-__id='${elems.length}'></${placeholder}>`));
							elems.push(child);
						}
						else
							inner.push(child);
						break;
				}
			}

			// Trim the first.
			while (inner.length > 0 && inner[0].type === 'StringLiteral')
			{
				let value = inner[0].value.replace(/^\s+/gm, '');
				if (!value.length) {
					inner.splice(0, 1);
					strings--;
					continue;
				}

				inner[0] = t.stringLiteral(value);
				break;
			}

			// Trim the last.
			while (inner.length > 0 && inner[inner.length-1].type === 'StringLiteral')
			{
				let value = inner[inner.length-1].value.replace(/\s+$/gm, '');
				if (!value.length) {
					inner.splice(inner.length-1, 1);
					strings--;
					continue;
				}

				inner[inner.length-1] = t.stringLiteral(value);
				break;
			}

			if (inner.length > 0)
			{
				//console.log('INNER=', inner.length, 'STRINGS=', strings, 'ELEMS=', elems.length);
				inner = inner.reduce((prev, curr) => prev ? t.binaryExpression('+', prev, curr) : curr, null);

				_body.push(
					t.expressionStatement(
						t.assignmentExpression('=', t.memberExpression(_e, t.identifier('innerHTML')), inner)
					)
				);

				if (elems.length > 1)
				{
					_body.push(
						t.variableDeclaration('let', [ t.variableDeclarator(_c, t.arrayExpression([])) ])
					);

					for (let i in elems)
					{
						_body.push(
							t.expressionStatement(
								t.assignmentExpression(
									'=',
									t.memberExpression(_c, t.numericLiteral(Number(i)), true),

									t.callExpression(t.memberExpression(_e, _querySelector), [
										t.stringLiteral(`[data-__id='${i}']`)
									])
								)
							)
						);
					}

					for (let i in elems)
					{
						_body.push(
							t.expressionStatement(
							t.callExpression(this.context._effect, [
								t.arrowFunctionExpression([], t.blockStatement([
									t.expressionStatement(
										t.assignmentExpression('=', t.memberExpression(_c, t.numericLiteral(Number(i)), true),
											t.callExpression(t.memberExpression(this.context._helpers, this.context._replaceNode), [
												t.memberExpression(_c, t.numericLiteral(Number(i)), true),
												elems[i],
												t.stringLiteral(placeholder)
											])
										)
									)
								]))
							]))
						);
					}
				}
				else if (elems.length == 1)
				{
					_body.push(
						t.variableDeclaration('let', [ t.variableDeclarator(_c, 
								t.callExpression(t.memberExpression(_e, _querySelector), [
									t.stringLiteral(`[data-__id='0']`)
								])
							) ])
					);

					_body.push(
						t.expressionStatement(
						t.callExpression(this.context._effect, [
							t.arrowFunctionExpression([], t.blockStatement([
								t.expressionStatement(
									t.assignmentExpression('=', _c,
										t.callExpression(t.memberExpression(this.context._helpers, this.context._replaceNode), [
											_c,
											elems[0],
											t.stringLiteral(placeholder)
										])
									)
								)
							]))
						]))
					);
				}
			}

			_body.push(t.returnStatement(_e));

			if (path.scope.parent)
				path.scope.push({ kind: 'const', id: _id, init: fn });
			else
				this.context.decl.push(t.variableDeclaration('const', [t.variableDeclarator(_id, fn)]));

			let tmp = t.callExpression(_id, []);
			tmp.isJsx = true;
			path.replaceWith(tmp);
			this.context.level--;
		},

		JSXText (path)
		{
			path.replaceWith(t.stringLiteral(path.node.value));
		},

		JSXEmptyExpression (path)
		{
			path.replaceWith(t.stringLiteral(''));
		}
	};

	return {
		name: 'babel-plugin-riza',
		inherits: syntaxJsx.default,
		visitor
	};
};
