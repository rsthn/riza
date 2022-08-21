
import syntaxJsx from '@babel/plugin-syntax-jsx';
import * as t from "@babel/types";

const hasCallExpression = function (path)
{
	let i = { found: false };

	path.traverse({
		CallExpression: function (path) {
			this.found = true;
			path.stop();
		}
	}, i);

	return i.found;
};

const hasRequiredImports = function (path)
{
	let i = { effect: false, replaceNode: false };

	path.traverse({
		ImportSpecifier: function (path) {
			switch (path.node.imported.name)
			{
				case 'effect':
					this.effect = path.node.local.name; break;

				case 'replaceNode':
					this.replaceNode = path.node.local.name; break;
			}
		}
	}, i);

	return i;
};

const hasJsxExpression = function (path)
{
	let i = { found: false };

	path.traverse({
		JSXExpressionContainer: function (path) {
			this.found = true;
			path.stop();
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
			case 'StringLiteral':
				expr.push(t.stringLiteral(attr.key + '=' + attr.value));
				break;

			default:
				console.log('FlattenIssue: ' + attr.type);
				break;
		}
	}

	expr.push('>');

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
	path.replaceWith(flattenJsxElement(path));
};

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
					imported: { effect: false, replaceNode: false },
					_effect: t.identifier('effect'),
					_replaceNode: t.identifier('replaceNode'),
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
					if (!this.context.imported.replaceNode) list.push(t.importSpecifier(this.context._replaceNode, this.context._replaceNode));

					path.unshiftContainer('body', t.importDeclaration(list, t.stringLiteral('riza')));
				}

				path.pushContainer('body', this.context.decl);
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

			if (info.replaceNode) {
				this.context._replaceNode.name = info.replaceNode;
				this.context.imported.replaceNode = true;
			}

			this.context.importedAll = true;

			for (let i in this.context.imported)
				this.context.importedAll &&= this.context.imported[i];
		},

		JSXElement (path)
		{
			if (!hasJsxExpression(path))
			{
				flattenJsxPath(path);
				path.skip();
				return;
			}

			path.traverse(visitor, this);

			let tagName = path.node.openingElement.name.name;
			let children = path.node.children;

			let _id = t.identifier(this.context.getId());

			let _props = t.identifier('props');
			let _children = t.identifier('children');

			let _body = [];
			let fn = t.functionExpression(_id, [_props, _children], t.blockStatement(_body));

			let _e = t.identifier('_$e');
			let _c = t.identifier('_$c');
			let _t = t.identifier('_$t');

			_body.push(
				t.variableDeclaration('let', [
					t.variableDeclarator(_e, t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createElement')), [t.stringLiteral(tagName)]))
				])
			);

			// Process attributes.
			let _setProperty = t.identifier('setProperty');
			let _style = t.identifier('style');

			for (let i in path.node.openingElement.attributes)
			{
				let attr = path.node.openingElement.attributes[i];
				let attrPath = path.get('openingElement.attributes.' + i);
				let expr = null, value = attr.value;

				// Style attribute can be set using a string, object or an expression.
				if (attr.name.name.toLowerCase() === 'style')
				{
					if (t.isStringLiteral(value))
					{
						value = t.stringLiteral(
							value.split('\n').map(i => i.trim()).join(' ').trim()
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
						expr = t.callExpression(this.context._effect, [
							t.arrowFunctionExpression([], t.blockStatement([
								t.expressionStatement(
									t.callExpression(t.memberExpression(_e, _setProperty), [ t.stringLiteral(attr.name.name), value.expression ])
								)
							]))
						]);
					}
				}

				if (expr === null)
					expr = t.callExpression(t.memberExpression(_e, _setProperty), [ t.stringLiteral(attr.name.name), value ]);

				if (expr)
					_body.push(t.expressionStatement(expr));
			}

			/* ** */
			let inner = [];
			let elems = [];
			let strings = 0;

			for (let i in children)
			{
				let child = children[i];
				let hasCall = hasCallExpression(path.get('children.' + i));

				switch (child.type)
				{
					case 'JSXExpressionContainer':
						if (hasCall) {
							inner.push(t.stringLiteral(`<i data-__id='${elems.length}'>EXPR</i>`));
							elems.push(child.expression);
						}
						else {
							inner.push(child.expression);
						}
						break;

					case 'StringLiteral':
						inner.push(t.stringLiteral(child.value));
						strings++;
						break;

					case 'CallExpression':
						inner.push(t.stringLiteral(`<i data-__id='${elems.length}'>EXPR</i>`));
						elems.push(child);
						break;

					default:
						if (hasCall) {
							inner.push(t.stringLiteral(`<i data-__id='${elems.length}'>EXPR</i>`));
							elems.push(child);
						}
						else {
							inner.push(child);
						}
						break;
				}
			}

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
				if (inner.length > 1 || strings > 0)
				{
					inner = inner.reduce((prev, curr) => prev ? t.binaryExpression('+', prev, curr) : curr, null);

					_body.push(
						t.expressionStatement(
							t.assignmentExpression('=', t.memberExpression(_e, t.identifier('innerHTML')), inner)
						)
					);

					if (elems.length != 0) {
						_body.push(
							t.variableDeclaration('let', [ t.variableDeclarator(_c, t.arrayExpression([])) ])
						);
					}

					let _querySelector = t.identifier('querySelector');

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
											t.callExpression(this.context._replaceNode, [
												t.memberExpression(_c, t.numericLiteral(Number(i)), true),
												elems[i]
											])
										)
									)
								]))
							]))
						);
					}
				}
				else
				{
					for (let i in elems)
					{
						_body.push(
							t.expressionStatement(
								t.callExpression(t.memberExpression(_e, t.identifier('appendChild')), [ elems[i] ])
							)
						);
					}
				}
			}

			_body.push(t.returnStatement(_e));

			this.context.decl.push(fn);
			path.replaceWith(t.callExpression(_id, []));
		},

		JSXText (path)
		{
			path.replaceWith(t.stringLiteral(path.node.value));
		}
	};

	return {
		name: 'babel-plugin-riza',
		inherits: syntaxJsx.default,
		visitor
	};
};
