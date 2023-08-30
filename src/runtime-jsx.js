
import * as rizaSignal from 'riza-signal';

export const debugSignals = rizaSignal.debugSignals;
export const Signal = rizaSignal.Signal;
export const signal = rizaSignal.signal;
export const expr = rizaSignal.expr;
export const watch = rizaSignal.watch;

/**
 * Helper functions used by the JSX transformer.
 */
export const helpers =
{
    /**
     * Special object to tag dynamic attributes.
     */
    DYNAMIC: { },

    /**
     * Sets the value of a property inside an object.
     * @param {Element|Text} root
     * @param {string[]} path
     * @param {number} lastIndex
     * @param {object} value
     */
    setValue: function (root, path, lastIndex, value)
    {
        // Rename properties `class`, `classList` to `className`.
        if (path[0] === 'class' || path[0] === 'classList')
            path[0] = 'className';

        if (path.length > 1 && path[0] === 'trait')
        {
            switch (path[1])
            {
                case 'valueSignal':
                    root.onchange = (e) => value.set(e.currentTarget.value);
                    watch([value], (value) => root.value = value);
                    break;

                case 'inputSignal':
                    root.oninput = (e) => value.set(e.currentTarget.value);
                    watch([value], (value) => root.value = value);
                    break;

                default:
                    console.error('Unknown trait: ' + path[1]);
                    break;
            }

            return;
        }

        // Object used to set `style` or `class` attribute.
        if (path.length === 1 && typeof(value) === 'object')
        {
            switch (path[0])
            {
                case 'style':
                    for (let i in value)
                        watch([i, value[i]], (i, value) => root.style[i] = value);
                    return;

                case 'className':
                    if (value instanceof Array)
                    {
                        watch([value], (value) => {
                            root.className = '';
                            for (let i in value)
                                root.classList.add(value[i]);
                        });
                    }
                    else {
                        for (let i in value)
                            watch([i, value[i]], (i, value) => root.classList[value == true ? 'add' : 'remove'](i));
                    }
                    return;
            }
        }

        // Specific CSS class such as `class:hidden`.
        if (path.length === 2 && path[0] === 'className')
        {
            watch([path[1], value], (i, value) => root.classList[value == true ? 'add' : 'remove'](i));
            return;
        }

        // Any other attribute/property.
        for (let i = 0; i < lastIndex && root; i++)
            root = root[path[i]];

        if (root)
            watch([path[lastIndex], value], (name, value) => root[name] = value);
    },

    /**
     * Creates a setter for a specified path inside an object.
     * @param {string[]} path 
     * @returns {(root: Element|Text, value: object) => void}
     */
    createSetter: function (path)
    {
        const n = path.length-1;

        return function (root, value) {
            helpers.setValue(root, path, n, value);
        };
    },

    /**
     * Copies the event listeners and custom properties from `node` to `newNode`.
     * @param {Element} node
     * @param {Element} newNode
     * @returns {Element}
     */
    copyProps: function (node, newNode)
    {
        // Copy property event listeners.
        for (let propName in node)
        {
            if (!propName.startsWith('on') || propName.startsWith('onmoz') || !node[propName])
                continue;

            newNode[propName] = node[propName];
        }

        // Copy custom properties.
        for (let propName of Object.getOwnPropertyNames(node))
        {
            if (~~propName == propName) // Skip numeric properties.
                continue;

            newNode[propName] = node[propName];
        }

        return newNode;
    },

    /**
     * Clones an element node and ensures certain properties are copied over.
     * @param {Element} node
     * @param {boolean} [deep=false]
     */
    cloneNode: function (node, deep=false)
    {
        if (!deep && node.isCustom === true)
            throw new Error ('cloneNode only available as deep clone for custom elements.');

        if (deep && node.isCustom === true)
            return node.cloneNodeCustom();

        let newNode = node.cloneNode();

        if (deep) {
            for (let childNode of node.childNodes)
                newNode.appendChild(helpers.cloneNode(childNode, true));
        }

        // Copy handlers and properties.
        helpers.copyProps(node, newNode);

        // Execute `oncreated` handler.
        if ('oncreated' in newNode)
            newNode.oncreated(newNode);

        return newNode;
    },

    /**
     * Ensures the provided value is a node or a node-compatible (such as an array of nodes).
     * @param {Node|Array<Node|string>|string} value
     * @param {boolean} [cloneNode=false]
     * @returns {Node|Array<Node>}
     */
    ensureNode: function (value, cloneNode=false)
    {
        if (value instanceof Array) {
            for (let i = 0; i < value.length; i++)
                value[i] = helpers.ensureNode(value[i], cloneNode);
            return value;
        }

        if (!(value instanceof Node))
            return document.createTextNode(value);

        return cloneNode ? helpers.cloneNode(value, true) : value;
    },

    /**
     * Replaces the specified refNode by a newNode and returns the new reference node.
     * @param {Node} parent
     * @param {Node|Array<Node>} refNode
     * @param {Node|Array<Node>} newNode
     * @returns {Node|Array<Node>}
     */
    replaceNode: function (parent, refNode, newNode, appendChild=false)
    {
        // When refNode is an array, remove all those nodes but leave just one for reference.
        if (refNode instanceof Array)
        {
            while (refNode.length > 1) {
                let tmp = refNode.shift();
                if (tmp.parentElement === parent)
                    tmp.remove();
            }
            refNode = refNode.shift();
        }

        let newRefNode = newNode;
        let firstNode = newNode;

        // When newNode is an array, create a document fragment for faster append of all children.
        if (newNode instanceof Array)
        {
            let frag = document.createDocumentFragment();
            newRefNode = [];

            if (newNode.length == 0)
                newNode = [document.createTextNode('')];

            for (let i = 0; i < newNode.length; i++) {
                newRefNode.push(newNode[i]);
                frag.appendChild(newNode[i]);
            }

            firstNode = newNode[0];
            newNode = frag;
        }

        if (appendChild === false)
        {
            refNode.replaceWith(newNode);

            let tmpNode = document.createComment('');
            firstNode.parentElement.insertBefore(tmpNode, firstNode);

            if (!(newRefNode instanceof Array))
                newRefNode = [ newRefNode ];

            newRefNode.push(tmpNode);
        }
        else
            refNode.appendChild(newNode);

        return newRefNode;
    },

    /**
     * Creates a DOM node replacer.
     * @param {Element|Text|Array<Element|Text>} refNode
     * @returns {(root: Element|Text, newNode: any) => void}
     */
    createReplacer: function (refNode)
    {
        return function (root, newNode) {
            refNode = helpers.replaceNode(root, refNode, helpers.ensureNode(newNode));
        };
    },

    /**
     * Creates a function that builds an element.
     * @param {string} tagName - Tag of the element to create.
     * @param {array} attributes - Array of name-value pairs. When dynamic attributes are present use the helpers.DYNAMIC as value placeholder.
     * @param {Array<Element|Text|string|null>} children - When dynamic children are present use the placeholder `null`.
     * @returns { (runtimeAttributeValues: Array<string>, runtimeChildren: Array<Element|Text|Array<Element|Text>>) => HTMLElement }
     */
    create: function (tagName, attributes, children)
    {
        // Attach static attributes.
        let baseElement = document.createElement(tagName);
        let dynamicAttributes = [];

        for (let i = 0; i < attributes.length; i += 2)
        {
            let path = null;

            if (attributes[i].indexOf(':') !== -1)
                path = attributes[i].split(':');
            else
                path = [attributes[i]];

            if (attributes[i+1] !== helpers.DYNAMIC) {
                helpers.setValue(baseElement, path, path.length-1, attributes[i+1]);
                continue;
            }

            dynamicAttributes.push(helpers.createSetter(path));
        }

        // Attach static children.
        let dynamicChildrenIndices = [];
        let dynamicBuild = false;
        let firstBuild = true;

        // Get indices of dynamic children and detect if any child is a custom element.
        for (let i in children)
        {
            if (children[i].isCustom === true)
                dynamicBuild = true;

            if (children[i] === helpers.DYNAMIC)
                dynamicChildrenIndices.push(i);
        }

        // Create and return the element builder fuction.
        const N = dynamicAttributes.length;
        const M = dynamicChildrenIndices.length;

        return function (runtimeDynamicAttributes, runtimeChildren, spreadAttributes=null)
        {
            const getElement = (runtimeChildren, originalElement=null) =>
            {
                let elem = null;

                if (firstBuild || dynamicBuild)
                {
                    let target = dynamicBuild ? helpers.cloneNode(baseElement) : baseElement;

                    for (let i in children)
                    {
                        if (children[i] instanceof Array)
                            throw new Error('Document fragments not fully supported!');

                        helpers.replaceNode(target, target, helpers.ensureNode(children[i], true), true);
                    }

                    if (dynamicBuild) elem = target;
                    firstBuild = false;
                }

                if (elem === null)
                    elem = helpers.cloneNode(baseElement, true);

                const hadOnCreated = 'oncreated' in elem;
                const dynamicChildren = dynamicChildrenIndices.map(idx => helpers.createReplacer(elem.childNodes[idx]));

                for (let i = 0; i < N; i++)
                    dynamicAttributes[i](elem, runtimeDynamicAttributes[i]);

                for (let i = 0; i < M; i++)
                    watch([runtimeChildren[i], i], (val, i) => dynamicChildren[i](elem, val));

                if (spreadAttributes !== null)
                {
                    for (let attributes of spreadAttributes)
                    {
                        for (let i in attributes)
                        {
                            let path = null;
                            if (i.indexOf(':') !== -1)
                                path = i.split(':');
                            else
                                path = [ i ];

                            helpers.setValue(elem, path, path.length-1, attributes[i]);
                        }
                    }
                }

                if (originalElement !== null) {
                    helpers.copyProps(originalElement, elem);
                }

                if (!hadOnCreated && 'oncreated' in elem)
                    elem.oncreated(elem);

                elem.isCustom = true;

                elem.cloneNode = () => {
                    throw new Error ('Use of cloneNode is forbidden in custom elements, use cloneNodeCustom instead.');
                };

                elem.cloneNodeCustom = () => {
                    return getElement(runtimeChildren.map(e => e instanceof Node && e.isCustom === true ? e.cloneNodeCustom() : e), elem);
                };

                return elem;
            };

            return getElement(runtimeChildren);
        };
    }
};
