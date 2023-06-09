
const t = require('@babel/types');
const syntaxJsx = require('./syntax-jsx.js');
const { default: generate } = require('@babel/generator');

/**
 * When using test-mode, the imports are not forced to be from the 'riza' package.
 */
const TEST_MODE = false;

/**
 * Visitors to detect or extract certain features from an AST path.
 */

const v_hasCallExpression = {
	CallExpression (path) {
		this.found = true;
		path.stop();
	},
	JSXSpreadChild (path) {
		this.found = true;
		path.stop();
	}
};

const v_checkRequiredImports = {
	ImportSpecifier: function (path) {
		switch (path.node.imported.name)
		{
			case 'helpers':
				this.helpers = path.node.local.name;
				break;
			case 'watch':
				this.watch = path.node.local.name;
				break;
			case 'expr':
				this.expr = path.node.local.name;
				break;
		}
	}
};

const v_getSignalIdentifiers = {
	Identifier: function (path)
	{
		if (path.parent.type === 'MemberExpression')
			return;

		if (path.node.name[0] === '$' && !(path.node.name.substr(1) in this.names))
		{
			this.names[path.node.name.substr(1)] = true;

			path.node.name = path.node.name;
			this.list.push(path.node);
		}
	}
};

const v_findPath = {
	enter(path) {
		if (path.node === this.targetNode) {
			this.targetPath = path;
			path.stop();
		}
	}
};

/**
 * Returns `true` if the AST contains at least one call-expression or jsx-spread-child node.
 */
function hasCallExpression (path)
{
	let ctx = { found: false };
	path.traverse(v_hasCallExpression, ctx);
	return ctx.found;
}

/**
 * Returns an object indicating which of the required imports are defined in the AST.
 */
function checkRequiredImports (path)
{
	let ctx = { helpers: false, watch: false, expr: false };
	path.traverse(v_checkRequiredImports, ctx);
	return ctx;
}

/**
 * Returns an array with all signal identifiers.
 */
function getSignalIdentifiers (path)
{
	let ctx = { list: [], names: { } };

	path.traverse(v_getSignalIdentifiers, ctx);

	ctx.names = Object.keys(ctx.names).map(s => t.identifier(s));
	ctx.length = ctx.list.length;
	return ctx;
}

/**
 * Searches the path for the specified node and returns it.
 */
function findPath (path, targetNode)
{
	let ctx = { targetPath: null, targetNode };
	path.traverse(v_findPath, ctx);
	return ctx.targetPath;
}

/**
 * Trims the StringLiteral elements from the beginning and end of a children array.
 * @param {array} childList 
 * @returns {array}
 */
function trimChildren (childList)
{
	// Trim the first string literal.
	while (childList.length > 0 && childList[0].type === 'StringLiteral')
	{
		let value = childList[0].value.replace(/^\s+/gm, '');
		if (!value.length) {
			childList.splice(0, 1);
			continue;
		}

		childList[0] = t.stringLiteral(value);
		break;
	}

	// Trim the last string literal.
	while (childList.length > 0 && childList[childList.length-1].type === 'StringLiteral')
	{
		let value = childList[childList.length-1].value.replace(/\s+$/gm, '');
		if (!value.length) {
			childList.splice(childList.length-1, 1);
			continue;
		}

		childList[childList.length-1] = t.stringLiteral(value);
		break;
	}

	return childList;
}

/**
 * Returns the plugin information.
 */
module.exports = function()
{
	/**
	 * AST visitor used to transform JSX into vanilla JS using Riza's advanced JSX runtime.
	 */
	const jsxTransformer = 
	{
		Program:
		{
			/**
			 * Prepares a new context for sub-sequent processing of AST nodes.
			 */
			enter (path)
			{
				this.context =
				{
					//runtimePackage: './utils.js',
					runtimePackage: 'riza',

					importsReady: false,
					imported: { helpers: false, watch: false, expr: false },

					lastDecl: null,

					id: {
						helpers: t.identifier('_helpers'),
						watch: t.identifier('_watch'),
						expr: t.identifier('_expr'),
						create: t.identifier('create'),
						DYNAMIC: t.identifier('DYNAMIC'),
					},

					expr: {
						DYNAMIC: null,
					},

					custom: {
					},

					nextId: -1,
					allocateId: function() {
						return t.identifier('_$' + (++this.nextId));
					}
				};

				this.context.expr.DYNAMIC = t.memberExpression(this.context.id.helpers, this.context.id.DYNAMIC);
			},

			/**
			 * Ensures that the required imports are present, and adds the declarations to the container body.
			 */
			exit (path)
			{
				if (this.context.importsReady)
					return;

				let list = [];
				if (!this.context.imported.helpers) list.push(t.importSpecifier(this.context.id.helpers, t.identifier('helpers')));
				if (!this.context.imported.watch) list.push(t.importSpecifier(this.context.id.watch, t.identifier('watch')));
				if (!this.context.imported.expr) list.push(t.importSpecifier(this.context.id.expr, t.identifier('expr')));

				path.unshiftContainer('body', t.importDeclaration(list, t.stringLiteral(this.context.runtimePackage)));
			}
		},

		/**
		 * Looks for imports from the `riza` package to mark them as imported.
		 */
		ImportDeclaration (path)
		{
			if (this.context.importsReady || (TEST_MODE === false && path.node.source.value !== this.context.runtimePackage))
				return;

			let info = checkRequiredImports(path);

			if (info.helpers) {
				this.context.id.helpers.name = info.helpers;
				this.context.imported.helpers = true;
			}

			if (info.watch) {
				this.context.id.watch.name = info.watch;
				this.context.imported.watch = true;
			}

			if (info.expr) {
				this.context.id.expr.name = info.expr;
				this.context.imported.expr = true;
			}

			this.context.importsReady = true;

			for (let i in this.context.imported)
				this.context.importsReady &&= this.context.imported[i];
		},

		/**
		 * Detect top-level declarations and expression statements.
		 */
		VariableDeclaration (path)
		{
			if (path.parent.type === 'Program')
				this.context.lastDecl = path;
		},

		FunctionDeclaration (path)
		{
			if (path.parent.type === 'Program')
				this.context.lastDecl = path;
		},

		ExpressionStatement (path)
		{
			if (path.parent.type === 'Program')
				this.context.lastDecl = path;
		},

		ExportDefaultDeclaration (path)
		{
			if (path.parent.type === 'Program')
				this.context.lastDecl = path;
		},

		/**
		 * Transforms a JSXText node into a string literal.
		 */
		JSXText (path)
		{
			path.replaceWith(t.stringLiteral(path.node.value));
		},

		/**
		 * Transforms a JSXNamespacedName into a "namespace:name" JSXIdentifier.
		 */
		JSXNamespacedName (path)
		{
			path.replaceWith(t.JSXIdentifier(path.node.namespace.name + ':' + path.node.name.name));
		},

		/**
		 * Transforms an empty JSXExpression into an empty string literal.
		 */
		JSXEmptyExpression (path)
		{
			path.replaceWith(t.stringLiteral(''));
		},

		/**
		 * Transforms a JSXExpressionContainer into an expression or an arrow-function expression.
		 */
		JSXExpressionContainer (path)
		{
			// Expressions belonging to an attribute will not be transformed.
			if (path.parent.type === 'JSXAttribute')
				return;

			let node = path.node.expression;

			//if (hasCallExpression(path))
			//	node = t.arrowFunctionExpression([], node);

			node.isDynamic = true;
			path.replaceWith(node);	
		},

		/**
		 * Transforms a JSXFragment into an array expression with multiple children.
		 */
		JSXFragment (path)
		{
			path.traverse(jsxTransformer, this);
			let node = t.arrayExpression(trimChildren(path.node.children));
			node.isDynamic = true;
			path.replaceWith(node);
		},

		/**
		 * Transforms an JSX Element into vanilla JS using the Riza's JSX runtime.
		 */
		JSXElement (path)
		{
			path.traverse(jsxTransformer, this);

			let tagName = path.node.openingElement.name.name;
			let signature = tagName;

			// Process attributes.
			let attributeList = [];
			let dynamicAttributeList = [];
			let spreadAttributes = [];

			for (let i in path.node.openingElement.attributes)
			{
				let attr = path.node.openingElement.attributes[i];
				let value = attr.value ?? t.booleanLiteral(true);

				if (attr.type === 'JSXSpreadAttribute') {
					spreadAttributes.push(attr.argument);
					continue;
				}

				if (value.type === 'JSXExpressionContainer')
				{
					dynamicAttributeList.push(findPath(path.get('openingElement'), value.expression));
					value = this.context.expr.DYNAMIC;
				}

				// All event names are always stored in lowercase.
				if (attr.name.name.startsWith('on'))
					attr.name.name = attr.name.name.toLowerCase();

				// Data-* attributes should be properly renamed to be use as properties.
				if (attr.name.name.startsWith('data-'))
				{
					attr.name.name = 'dataset:' + attr.name.name.substr(5).split('-').map((s,idx) => idx ? s[0].toUpperCase()+s.substr(1) : s).join('');
				}

				attributeList.push(t.stringLiteral(attr.name.name));
				attributeList.push(value);

				signature += '|' + attr.name.name + (value === this.context.expr.DYNAMIC ? '' : '=' + generate(value).code);
			}

			// Process child elements.
			let childList = [];
			let dynamicChildrenList = [];

			for (let i in path.node.children)
			{
				let child = path.node.children[i];

				switch (child.type)
				{
					case 'JSXSpreadChild':
						child.expression.isDynamic = true;
						dynamicChildrenList.push(findPath(path.get('children.'+i), child.expression));
						childList.push(this.context.expr.DYNAMIC);
						signature += '@';
						break;

					default:
						if (child.isDynamic) {
							dynamicChildrenList.push(path.get('children.'+i));
							childList.push(this.context.expr.DYNAMIC);
							signature += '@';
						}
						else {
							childList.push(child);
							signature += '@' + generate(child).code;
						}

						break;
				}
			}

			childList = trimChildren(childList);

			// Using an element defined in the current scope.
			if (tagName[0] === tagName[0].toUpperCase())
			{
				// Any element starting with uppercase must be defined in the current scope.
				if (!path.scope.hasBinding(tagName))
					throw new Error ('Custom element not defined: ' + tagName);

				// ***
				let finalAttributes = [];
				let nextDynAttr = 0;

				for (let i = 0; i < attributeList.length; i += 2)
				{
					if (attributeList[i+1] !== this.context.expr.DYNAMIC) {
						finalAttributes.push(t.objectProperty(attributeList[i], attributeList[i+1]));
						continue
					}

					let exprPath = dynamicAttributeList[nextDynAttr++];

					let signalIds = getSignalIdentifiers(exprPath);
					if (signalIds.length > 0)
						finalAttributes.push(t.objectProperty(attributeList[i],
							t.callExpression(this.context.id.expr, [t.arrayExpression(signalIds.names), t.arrowFunctionExpression(signalIds.list, exprPath.node)])
						));
					else
						finalAttributes.push(t.objectProperty(attributeList[i], exprPath.node));
				}

				for (let i of spreadAttributes)
					finalAttributes.push(t.spreadElement(i));

				// ***
				let finalChildren = [];
				let nextDynChild = 0;

				for (let i = 0; i < childList.length; i += 1)
				{
					if (childList[i] !== this.context.expr.DYNAMIC) {
						finalChildren.push(childList[i]);
						continue;
					}

					let exprPath = dynamicChildrenList[nextDynChild++];

					let signalIds = getSignalIdentifiers(exprPath);
					if (signalIds.length > 0 && !exprPath.node.isDynamicChild)
						finalChildren.push(t.callExpression(this.context.id.expr, [t.arrayExpression(signalIds.names), t.arrowFunctionExpression(signalIds.list, exprPath.node)]));
					else
						finalChildren.push(exprPath.node);
				}

				let node = t.callExpression(t.identifier(tagName), [
					t.objectExpression(finalAttributes), t.arrayExpression(finalChildren)
				]);

				node.isDynamic = dynamicAttributeList.length != 0 || dynamicChildrenList.length != 0;
				node.isDynamicChild = true;
				path.replaceWith(node);
			}
			else
			{
				let _id = this.context.custom[signature];
				if (!_id)
				{
					_id = this.context.allocateId();
					this.context.custom[signature] = _id;

					let decl = t.variableDeclaration('const', [t.variableDeclarator(_id,
								t.callExpression(
									t.memberExpression(this.context.id.helpers, this.context.id.create),
									[ t.stringLiteral(tagName), t.arrayExpression(attributeList), t.arrayExpression(childList) ]
								)
							)]);

					this.context.lastDecl.insertBefore(decl);
				}

				// ***
				for (let i in dynamicAttributeList)
				{
					let exprPath = dynamicAttributeList[i];

					let signalIds = getSignalIdentifiers(exprPath);
					if (signalIds.length > 0)
						dynamicAttributeList[i] = t.callExpression(this.context.id.expr, [t.arrayExpression(signalIds.names), t.arrowFunctionExpression(signalIds.list, exprPath.node)])
					else
						dynamicAttributeList[i] = exprPath.node;
				}

				// ***
				for (let i in dynamicChildrenList)
				{
					let exprPath = dynamicChildrenList[i];

					let signalIds = getSignalIdentifiers(exprPath);
					if (signalIds.length > 0 && !exprPath.node.isDynamicChild)
						dynamicChildrenList[i] = t.callExpression(this.context.id.expr, [t.arrayExpression(signalIds.names), t.arrowFunctionExpression(signalIds.list, exprPath.node)])
					else
						dynamicChildrenList[i] = exprPath.node;
				}

				let node = null;

				if (spreadAttributes.length)
					node = t.callExpression(_id, [ t.arrayExpression(dynamicAttributeList), t.arrayExpression(dynamicChildrenList), t.arrayExpression(spreadAttributes) ]);
				else
					node = t.callExpression(_id, [ t.arrayExpression(dynamicAttributeList), t.arrayExpression(dynamicChildrenList) ]);

				node.isDynamic = dynamicAttributeList.length != 0 || dynamicChildrenList.length != 0;
				node.isDynamicChild = true;
				path.replaceWith(node);
			}
		},

		CallExpression: function(path)
		{
			if (path.node.callee.type !== 'Identifier' || path.node.callee.name !== 'dyn')
				return;

			let signalIds = getSignalIdentifiers(path.get('arguments.0'));
			if (!signalIds.length) return;

			let node = t.callExpression(this.context.id.expr, [t.arrayExpression(signalIds.names), t.arrowFunctionExpression(signalIds.list, path.node.arguments[0])]);
			node.isDynamic = true;
			path.replaceWith(node);
		}
	};

	return {
		name: 'babel-plugin-riza',
		inherits: syntaxJsx,
		visitor: jsxTransformer
	};
};
