import syntaxJsx from '@babel/plugin-syntax-jsx';
export default function ({
  types: t
}) {
  const visitor = {
    JSXElement(path) {
      let tagName = path.node.openingElement.name.name;
      path.traverse(visitor);
      let attributes = path.node.openingElement.attributes;
      let children = path.node.children; // Optimize output when there are no attributes and no children.

      if (!attributes.length && !children.length) {
        if (path.scope.hasBinding(tagName)) {
          path.replaceWith(t.callExpression(t.stringLiteral(tagName), []));
        } else {
          path.replaceWith(t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createElement')), [t.stringLiteral(tagName)]));
        }

        return;
      } // Code to create the element.


      let code = [];

      if (path.scope.hasBinding(tagName)) {
        // Get the attributes.
        let props = [];

        for (let attr of attributes) {
          let attrName = t.stringLiteral(attr.name.name);
          let attrValue = attr.value.type === 'JSXExpressionContainer' ? attr.value.expression : attr.value; // Style attribute can be set using a string, object or an expression.

          if (attr.name.name.toLowerCase() === 'style') {
            if (t.isStringLiteral(attrValue)) {
              attrValue = t.stringLiteral(attrValue.value.split('\n').map(i => i.trim()).join(' ').trim());
            }
          }

          props.push(t.objectProperty(attrName, attrValue));
        }

        path.replaceWith(t.callExpression(t.identifier(tagName), [t.objectExpression(props)]));
        return;
      }

      code.push(t.variableDeclaration('let', [t.variableDeclarator(t.identifier('e'), t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createElement')), [t.stringLiteral(tagName)]))])); // Code to set the attributes.

      for (let attr of attributes) {
        let attrName = t.stringLiteral(attr.name.name);
        let attrValue = attr.value.type === 'JSXExpressionContainer' ? attr.value.expression : attr.value; // Style attribute can be set using a string, object or an expression.

        if (attr.name.name.toLowerCase() === 'style') {
          if (t.isStringLiteral(attrValue)) {
            attrValue = t.stringLiteral(attrValue.value.split('\n').map(i => i.trim()).join(' ').trim());
          } else {
            code.push(t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [t.memberExpression(t.identifier('e'), t.identifier('style')), attrValue])));
            attrValue = null;
          }
        }

        if (attrValue === null) continue;
        code.push(t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('e'), t.identifier('setAttribute')), [attrName, attrValue])));
      } // Set inner text or children elements.


      for (let ch of children) {
        let value = null;

        switch (ch.type) {
          case 'JSXExpressionContainer':
            value = t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createTextNode')), [ch.expression]);
            break;

          case 'StringLiteral':
            value = t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createTextNode')), [ch.value]);
            break;

          default:
            console.log(ch.type);
            break;
        }

        if (value === null) continue;
        code.push(t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('e'), t.identifier('appendChild')), [value])));
      } // Return the newly created element.


      code.push(t.returnStatement(t.identifier('e')));
      path.replaceWith(t.callExpression(t.parenthesizedExpression(t.functionExpression(null, [], t.blockStatement(code), false, false)), []), path.node);
    },

    JSXText(path) {
      let val = path.node.value.trim();
      if (val.length > 0) path.replaceWith(t.stringLiteral('@@' + val));else path.remove();
    },

    JSXFragment(path) {
      console.log('JSXFragment');
      path.traverse(visitor);
      path.replaceWith(t.arrayExpression(path.node.children));
    }

  };
  return {
    name: 'babel-plugin-riza',
    inherits: syntaxJsx,
    visitor
  };
}
;
