
/**
 * Node for a linked list.
 */
export function Node (value)
{
	this.value = null;
	this.next = null;
	this.prev = null;
	this.list = null;
}

/**
 * Creates a new node.
 * @param {any} value 
 * @returns {Node}
 */
Node.create = function (value)
{
	let node = new Node();
	node.value = value;
	return node;
}

/**
 * Unlinks and frees the node. Returns the node's value.
 * @returns {any}
 */
Node.prototype.free = function ()
{
	let value = this.value;
	this.unlink();

	this.next = this.prev = null;
	this.list = null;

	this.value = null;
	return value;
}

/**
 * Links the node after the given reference.
 * @param {Node} ref
 * @param {List} list
 * @returns {Node}
 */
Node.prototype.linkAfter = function (ref, list)
{
	this.next = ref !== null ? ref.next : null;
	this.prev = ref;
	this.list = list;

	if (ref !== null) {
		if (ref.next !== null) ref.next.prev = this;
		ref.next = this;
	}

	if (list.tail === ref)
		list.tail = this;

	if (list.head === null)
		list.head = this;

	list.length++;
	return this;
}

/**
 * Links the node before the given reference.
 * @param {Node} ref
 * @param {List} list
 * @returns {Node}
 */
Node.prototype.linkBefore = function (ref, list)
{
	this.prev = ref !== null ? ref.prev : null;
	this.next = ref;
	this.list = list;

	if (ref !== null) {
		if (ref.prev !== null) ref.prev.next = this;
		ref.prev = this;
	}

	if (list.head === ref)
		list.head = this;

	if (list.tail === null)
		list.tail = this;

	list.length++;
	return this;
}

/**
 * Unlinks the node by linking the `prev` and `next` nodes together (when available).
 * @returns {Node}
 */
Node.prototype.unlink = function ()
{
	if (this.prev) this.prev.next = this.next;
	if (this.next) this.next.prev = this.prev;

	if (this.list.head === this) this.list.head = this.next;
	if (this.list.tail === this) this.list.tail = this.prev;

	this.list.length--;
	return this;
}

/**
 * Doubly linked list.
 */
export function List ()
{
	this.head = null;
	this.tail = null;
	this.length = 0;
}

/**
 * Creates a new linked list.
 * @returns {List}
 */
List.create = function()
{
	return new List();
}

/**
 * Frees the list and removes all nodes.
 */
List.prototype.free = function()
{
	this.clear();
}

/**
 * Clears the list by freeing all nodes. Values are preserved.
 * @returns {List}
 */
List.prototype.reset = function()
{
	while (this.head !== null)
		this.head.free();

	return this;
}

/**
 * Clears the list by freeing all nodes and values.
 * @returns {List}
 */
List.prototype.clear = function()
{
	while (this.head !== null)
	{
		if (this.head.value !== null)
			this.head.value.free();

		this.head.free();
	}

	return this;
}

/**
 * Returns the value at the head of the list.
 * @returns {any}
 */
List.prototype.first = function ()
{
	return this.head !== null ? this.head.value : null;
}

/**
 * Returns the value at the tail of the list.
 * @returns {any}
 */
List.prototype.last = function ()
{
	return this.tail !== null ? this.tail.value : null;
}

/**
 * Finds an specific value and returns the node, or `null` if not found.
 * @returns {Node}
 */
List.prototype.find = function (value)
{
	for (let i = this.head; i !== null; i = i.next)
	{
		if (i.value === value)
			return i;
	}

	return null;
}

/**
 * Inserts a value at the head of the list.
 * @param {any} value
 * @returns {any}
 */
List.prototype.unshift = function (value)
{
	Node.create(value).linkBefore(this.head, this);
	return value;
}

/**
 * Removes a value from the head of the list, or `null` if the list is empty.
 * @returns {any}
 */
List.prototype.shift = function ()
{
	return this.head === null ? null : this.head.free();
}

/**
 * Inserts a value at the tail of the list.
 * @param {any} value
 * @returns {any}
 */
List.prototype.push = function (value)
{
	Node.create(value).linkAfter(this.tail, this);
	return value;
}

/**
 * Removes a value from the tail of the list.
 * @returns {any}
 */
List.prototype.pop = function ()
{
	return this.tail === null ? null : this.tail.free();
}
