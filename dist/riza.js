var $parcel$global=globalThis;function $parcel$interopDefault(t){return t&&t.__esModule?t.default:t}var $parcel$modules={},$parcel$inits={},parcelRequire=$parcel$global.parcelRequirefebd;null==parcelRequire&&((parcelRequire=function(t){if(t in $parcel$modules)return $parcel$modules[t].exports;if(t in $parcel$inits){var e=$parcel$inits[t];delete $parcel$inits[t];var n={id:t,exports:{}};return $parcel$modules[t]=n,e.call(n.exports,n,n.exports),n.exports}var s=Error("Cannot find module '"+t+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(t,e){$parcel$inits[t]=e},$parcel$global.parcelRequirefebd=parcelRequire);var parcelRegister=parcelRequire.register;parcelRegister("jNRwG",function(module,exports){function $parcel$export(t,e,n,s){Object.defineProperty(t,e,{get:n,set:s,enumerable:!0,configurable:!0})}$parcel$export(module.exports,"Rinn",()=>$9ffb7151b8b2d038$export$eefcfe56efaaa57d),$parcel$export(module.exports,"Class",()=>$9ffb7151b8b2d038$export$4c85e640eb41c31b),$parcel$export(module.exports,"Event",()=>$9ffb7151b8b2d038$export$d61e24a684f9e51),$parcel$export(module.exports,"EventDispatcher",()=>$9ffb7151b8b2d038$export$ec8b666c5fe2c75a),$parcel$export(module.exports,"Model",()=>$9ffb7151b8b2d038$export$a1edc412be3e1841),$parcel$export(module.exports,"ModelList",()=>$9ffb7151b8b2d038$export$59eced47f477f85a),$parcel$export(module.exports,"Schema",()=>$9ffb7151b8b2d038$export$19342e026b58ebb7),$parcel$export(module.exports,"Flattenable",()=>$9ffb7151b8b2d038$export$3a9581c9ade29768),$parcel$export(module.exports,"Collection",()=>$9ffb7151b8b2d038$export$fb8073518f34e6ec),$parcel$export(module.exports,"Template",()=>$9ffb7151b8b2d038$export$14416b8d99d47caa);var $parcel$global="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==$parcel$global?$parcel$global:{},$parcel$modules={},$parcel$inits={},parcelRequire=$parcel$global.parcelRequire25d2;null==parcelRequire&&((parcelRequire=function(t){if(t in $parcel$modules)return $parcel$modules[t].exports;if(t in $parcel$inits){var e=$parcel$inits[t];delete $parcel$inits[t];var n={id:t,exports:{}};return $parcel$modules[t]=n,e.call(n.exports,n,n.exports),n.exports}var s=Error("Cannot find module '"+t+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(t,e){$parcel$inits[t]=e},$parcel$global.parcelRequire25d2=parcelRequire),parcelRequire.register("4VREF",function(module,exports){$parcel$export(module.exports,"default",()=>$39761b0dd175036e$export$2e2bcd8739ae039);var $fMUO1=parcelRequire("fMUO1"),$cAEYe=parcelRequire("cAEYe"),/**
**	Map of model constraint handlers. Each function should accept parameters (in order): the model object (model), the constraint value (ctval),
**	the property name (name), the property value (value) and return the corrected value once verified or throw an exception if errors occur.
*/$39761b0dd175036e$export$2e2bcd8739ae039={_getref:function(value,obj){return"string"!=typeof value?value:("#"==value.substr(0,1)?value=obj.get(value.substr(1)):"@"==value.substr(0,1)&&(value=obj[value.substr(1)]),"string"==typeof value)?eval(value):value},/**
	**	Verifies that the new value is of the valid type before storing it on the property. When possible if the
	**	input is of compatible type it will be converted to the target type.
	*/type:function(t,e,n,s){switch(e){case"int":if(isNaN(s=parseInt(s)))throw Error(e);break;case"float":if(isNaN(s=parseFloat(s)))throw Error(e);break;case"string":s=null==s?"":s.toString();break;case"bit":if(!0===s||!1===s){s=s?1:0;break}if(isNaN(s=parseInt(s)))throw Error(e);s=s?1:0;break;case"array":if("array"==(0,$fMUO1.default).typeOf(s))break;if(null==s){s=[];break}throw Error(e);case"bool":if("true"===s||!0===s){s=!0;break}if("false"===s||!1===s){s=!1;break}throw Error(e)}return s},/**
	**	Verifies that the field is of the specified model type.
	*/model:function(t,e,n,s){var r=this._getref(e,t);if(!r)throw Error(e);return s?r.ensure(s):new r},/**
	**	Verifies that the field is of the specified class.
	*/cls:function(t,e,n,s){var r=this._getref(e,t);return s?(0,$fMUO1.default).ensureTypeOf(r,s):new r},/**
	**	Verifies that the array contents are of the specified class. Returns error if the class does not exist
	**	or if the field is not an array. Therefore a type:array constraint should be used before this one.
	*/arrayof:function(t,e,n,s){var r=this._getref(e,t);if(s||(s=[]),!r||"array"!=(0,$fMUO1.default).typeOf(s))throw Error(e);for(var a=0;a<s.length;a++)s[a]=(0,$fMUO1.default).ensureTypeOf(r,s[a]);return s},/**
	**	Verifies that the array contents are not null. Returns error if the field is not an array, therefore a
	**	type:array constraint should be used before this one.
	*/arraynull:function(t,e,n,s){var r=!1;if("object"==(0,$fMUO1.default).typeOf(e)&&(e.remove&&(r=e.remove),e=e.value),e)return s;if("array"!=(0,$fMUO1.default).typeOf(s))throw Error(e);for(var a=0;a<s.length;a++)if(null==s[a]){if(r)s.splice(a--,1);else throw Error(e)}return s},/**
	**	Verifies that the array contents are all compliant. Returns error if the field is not an array, therefore
	**	a type:array constraint should be used before this one.
	*/arraycompliant:function(t,e,n,s){var r=!1;if("object"==(0,$fMUO1.default).typeOf(e)&&(e.remove&&(r=e.remove),e=e.value),!e)return s;if("array"!=(0,$fMUO1.default).typeOf(s))throw Error(e);for(var a=0;a<s.length;a++)if(null!=s[a]&&!s[a].isCompliant()){if(r)s.splice(a--,1);else throw Error(e)}return s},/**
	**	Verifies the presense of the field.
	*/required:function(t,e,n,s){if(null==s)throw Error(e?"":"null");if("array"===(0,$fMUO1.default).typeOf(s)){if(0==s.length)throw Error(e?"":"null")}else if(0==s.toString().length)throw Error(e?"":"null");return s},/**
	**	Verifies the minimum length of the field.
	*/minlen:function(t,e,n,s){if(s.toString().length<e)throw Error(e);return s},/**
	**	Verifies the maximum length of the field.
	*/maxlen:function(t,e,n,s){if(s.toString().length>e)throw Error(e);return s},/**
	**	Verifies the minimum value of the field.
	*/minval:function(t,e,n,s){if(parseFloat(s)<e)throw Error(e);return s},/**
	**	Verifies the maximum value of the field.
	*/maxval:function(t,e,n,s){if(parseFloat(s)>e)throw Error(e);return s},/**
	**	Verifies the minimum number of items in the array.
	*/mincount:function(t,e,n,s){if("array"!=(0,$fMUO1.default).typeOf(s)||s.length<e)throw Error(e);return s},/**
	**	Verifies the maximum number of items in the array.
	*/maxcount:function(t,e,n,s){if("array"!=(0,$fMUO1.default).typeOf(s)||s.length>e)throw Error(e);return s},/**
	**	Verifies the format of the field using a regular expression. The constraint value should be the name of
	**	one of the Model.Regex regular expressions.
	*/pattern:function(t,e,n,s){if(!(0,$cAEYe.default)[e].test(s.toString()))throw Error(e);return s},/**
	**	Verifies that the field is inside the specified set of options. The set can be an array or a string with
	**	the options separated by vertical bar (|). The comparison is case-sensitive.
	*/inset:function(t,e,n,s){if("array"!=(0,$fMUO1.default).typeOf(e)){if(!RegExp("^("+e.toString()+")$").test(s.toString()))throw Error(e);return s}if(-1==e.indexOf(s.toString()))throw Error(e.join("|"));return s},/**
	**	Sets the field to upper case.
	*/upper:function(t,e,n,s){return e?s.toString().toUpperCase():s},/**
	**	Sets the field to lower case.
	*/lower:function(t,e,n,s){return e?s.toString().toLowerCase():s}}}),parcelRequire.register("fMUO1",function(t,e){$parcel$export(t.exports,"default",()=>s);let n={};var s=n;/*
**	Invokes the specified function 'fn' 10ms later.
**
**	>> void invokeLater (function fn);
*/n.invokeLater=function(t){t&&setTimeout(function(){t()},10)},/*
**	Waits for the specified amount of milliseconds. Returns a Promise.
**
**	>> Promise wait (int millis);
*/n.wait=function(t){return new Promise(function(e,n){setTimeout(e,t)})},/*
**	Returns the type of an element 'o', properly detects arrays and null types. The return string is always in lowercase.
**
**	>> string typeOf (any o);
*/n.typeOf=function(t){return t instanceof Array?"array":null===t?"null":(typeof t).toString().toLowerCase()},/*
**	Returns boolean indicating if the type of the element is an array or an object.
**
**	>> bool isArrayOrObject (any o);
*/n.isArrayOrObject=function(t){switch(n.typeOf(t)){case"array":case"object":return!0}return!1},/*
**	Creates a clone (deep copy) of the specified element. The element can be an array, an object or a primitive type.
**
**	>> T clone (T elem);
*/n.clone=function(t){let e=n.typeOf(t);if("array"===e){e=[];for(let s=0;s<t.length;s++)e.push(n.clone(t[s]))}else if("object"===e){if("clone"in t&&"function"==typeof t.clone)return t.clone();for(let s in e={},t)e[s]=n.clone(t[s])}else e=t;return e},/*
**	Merges all given elements into the first one, object fields are cloned.
**
**	>> T merge (T... elems)
*/n.merge=function(t,...e){if("array"==n.typeOf(t))for(let s=0;s<e.length;s++){let r=e[s];if("array"!=n.typeOf(r))t.push(r);else for(let e=0;e<r.length;e++)t.push(n.clone(r[e]))}else if("object"==n.typeOf(t))for(let s=0;s<e.length;s++){let r=e[s];if("object"==n.typeOf(r))for(let e in r)n.isArrayOrObject(r[e])?e in t?n.merge(t[e],r[e]):t[e]=n.clone(r[e]):t[e]=r[e]}return t},/*
**	Assigns all fields from the specified objects into the first one.
**
**	>> object override (object output, object... objs)
*/n.override=function(t,...e){for(let n=0;n<e.length;n++)for(let s in e[n])t[s]=e[n][s];return t},/*
**	Compares two objects and returns `true` if all properties in "partial" find a match in "full".
*/n.partialCompare=function(t,e){if(null==t||null==e)return!1;if(t===e)return!0;for(var n in e)if(t[n]!=e[n])return!1;return!0},/*
**	Performs a partial search for an object (o) in the specified array and returns its index or `false` if the
**	object was not found. When `getObject` is set to `true` the object will be returned instead of an index, or
**	`null` if not found.
*/n.arrayFind=function(t,e,n){for(var s=0;t&&s<t.length;s++)if(this.partialCompare(t[s],e))return n?t[s]:s;return!!n&&null},/*
**	Verifies if the specified object is of class `m`, returns boolean.
**
**	>> bool isTypeOf (object obj, class _class);
*/n.isInstanceOf=function(t,e){return!!t&&!!e&&"object"==typeof t&&(t instanceof e||"isInstanceOf"in t&&t.isInstanceOf(e))},/*
**	Traverses the given object attempting to find the index/key that does an identical match with the specified value,
**	if not found returns -1, otherwise the index/key where the value was found.
**
**	>> int indexOf (array container, T value)
**	>> string indexOf (object container, T value)
*/n.indexOf=function(t,e,n=!1){if(n){for(let n=0;n<t.length;n++)if(t[n]===e)return n;return -1}for(let n in t)if(t[n]===e)return n;return -1},/*
**	Escapes a string using HTML entities.
**
**	>> string escape (string str);
*/n.escape=function(t){return(t+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},/*
**	Verifies if the specified object is of class `m`, if not it will create a new instance of `m` passing `o` as parameter.
**
**	>> object ensureTypeOf (class m, object o);
*/n.ensureTypeOf=function(t,e){return!e||!t||e instanceof t||e.isInstanceOf&&t.prototype.className&&e.isInstanceOf(t.prototype.className)?e:new t(e)},/*
**	Serializes an object and returns its JSON string representation.
**
**	>> string serialize (object o);
*/n.serialize=function(t){return JSON.stringify(t)},/*
**	Deserializes a string in JSON format and returns the result.
**
**	>> any deserialize (string s);
*/n.deserialize=function(t){return JSON.parse(t)},/*
**	Chains a new function to an existing one on some object, such that invoking the function on the object will cause
**	both functions to run (order would be oldFunction then newFunction).
**
**	If the `conditional` flag is set to `true`, the second function will be run only if the first one returns non-false.
**	Returns an object with a single method 'unhook' which will revert the changes to leave only the original function.
**
**	>> object{function unhook} hook (Object object, String functionName, function newFunction, bool conditional=false);
*/n.hookAppend=function(t,e,n,s=!0){let r=t[e];return s?t[e]=function(...t){if(!1!==r.apply(this,t))return n.apply(this,t)}:t[e]=function(...t){return r.apply(this,t),n.apply(this,t)},{unhook:function(){t[e]=r}}},/*
**	Chains a new function to an existing one on some object, such that invoking the function on the object will cause
**	both functions to run (order would be oldFunction then newFunction).
**
**	If the `conditional` flag is set to `true`, the second function will be run only if the first one returns non-false.
**	Returns an object with a single method 'unhook' which will revert the changes to leave only the original function.
**
**	>> object{function unhook} hook (Object object, String functionName, function newFunction, bool conditional=false);
*/n.hookPrepend=function(t,e,n,s=!0){let r=t[e];return s?t[e]=function(...t){if(!1!==n.apply(this,t))return r.apply(this,t)}:t[e]=function(...t){return n.apply(this,t),r.apply(this,t)},{unhook:function(){t[e]=r}}}}),parcelRequire.register("cAEYe",function(t,e){$parcel$export(t.exports,"default",()=>n);/**
**	Common regular expressions for pattern validation.
*/var n={email:/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/i,url:/^[\w-]+:\/\/[\w-]+(\.\w+)+.*$/,urlNoProt:/^[\w-]+(\.\w+)+.*$/,name:/^[-A-Za-z0-9_.]+$/,uname:/^['\pL\pN ]+$/,text:/^[^&<>{}]*$/,utext:/^([\r\n\pL\pN\pS &!@#$%*\[\]()_+=;',.\/?:"~-]+)$/}});var $fMUO1=parcelRequire("fMUO1"),$fMUO1=parcelRequire("fMUO1");/**
 * Base class used to create other classes with complex prototype based multiple inheritance while at the
 * same time avoiding the prototype chain for faster access. Supports calling parent class methods.
 *///!class Class
let $2394d727dfd6a212$var$Class=function(){};/**
 * Reference to the class itself.
 */$2394d727dfd6a212$var$Class._class=$2394d727dfd6a212$var$Class,/**
 * Contains the methods of each of the super classes.
 */$2394d727dfd6a212$var$Class._super={},/**
 * Name of the class, if none specified the class will be considered "final" and will not be inheritable.
 * !readonly string className;
 */$2394d727dfd6a212$var$Class.prototype.className="Class",/**
 * Class constructor, should initialize the instance. Invoked when the `new` keyword is used with the class.
 * !constructor();
 */$2394d727dfd6a212$var$Class.prototype.__ctor=function(){},/**
 * Class destructor, should clear the instance and release any used resources, invoked when the global `dispose` function is called with an instance as parameter.
 * !__dtor() : void;
 */$2394d727dfd6a212$var$Class.prototype.__dtor=function(){},/**
 * Returns true if the object is an instance of the specified class, the parameter can be a class name (string), a constructor (function) or
 * a class instance (object), in any cases the appropriate checks will be done.
 * !isInstanceOf (className: string|function|object) : boolean;
 */$2394d727dfd6a212$var$Class.prototype.isInstanceOf=function(t){return null!==t&&("function"==typeof t?t=t.prototype.className:"string"!=typeof t&&(t=t.__proto__.className),this.className===t||this._super.hasOwnProperty(t))},/**
 * Returns true if the given object is an instance of the specified class, the parameter can be a class name (string), a constructor (function)
 * or a class instance (object), in any cases the appropriate checks will be done.
 * !instanceOf (object: object, className: string|function|object) : boolean;
 */$2394d727dfd6a212$var$Class.instanceOf=function(t,e){return null!==t&&null!==e&&t.isInstanceOf(e)},/**
 * Internal method to ensure the _super field of an instance has all functions properly bound to the instance.
 */$2394d727dfd6a212$var$Class.prototype._initSuperRefs=function(){let t=this.constructor._super,e={},n=this;for(let s in t){let r={},a=t[s].prototype;for(let t in a)"function"===(0,$fMUO1.default).typeOf(a[t])&&(r[t]=function(t){return function(e,s,r,a,o,l,h,u,c,d,f){return t.call(n,e,s,r,a,o,l,h,u,c,d,f)}}(a[t]));e[s]=r}this._super=e},/*
**	Extends the class with the specified prototype. The prototype can be a function (class constructor) or an object. Note that the
**	class will be modified (and returned) instead of creating a new class. Must be called at the class-level (**not** instance level).
**	When a class is provided all fields starting with uppercase at the class-level will not be inherited, this is used to create constants
**	on classes without having them to be copied to derived classes.
**
**	>> class inherit (constructor classConstructor);
**	>> class inherit (object obj);
*/$2394d727dfd6a212$var$Class.inherit=function(t){let e=this._class,n=e._super,s=e._class;if("function"===(0,$fMUO1.default).typeOf(t)){for(let n in t._class)/^[A-Z]/.test(n)||(e[n]=t._class[n]);// Combine methods and properties.
(0,$fMUO1.default).override(e.prototype,t._class.prototype),(0,$fMUO1.default).override(n,t._class._super),t._class.prototype.className&&(n[t._class.prototype.className]=t._class)}else(0,$fMUO1.default).override(e.prototype,t);return e._super=n,e._class=s,e},/**
 * Internal method used to extend a class with one or more prototypes.
 */$2394d727dfd6a212$var$Class.prototype._extend=function(t,e){if(0===e.length)return t;//VIOLET OPTIMIZE
let n=function(...t){this._initSuperRefs(),this.__ctor.apply(this,t)};n._class=n,n._super={},$2394d727dfd6a212$var$Class.inherit.call(n,t),delete n.prototype.className;for(let t=0;t<e.length;t++)n.inherit(e[t]);return delete n._super.Class,"classInit"in n.prototype&&n.prototype.classInit(),n.isInstance=function(t){return(0,$fMUO1.default).isInstanceOf(t,n)},n},/**
 * Creates a new class with the specified prototypes each of which can be a class constructor (function) or an object.
 */$2394d727dfd6a212$var$Class.extend=function(...t){return this._class.prototype._extend(this,t)},/**
 * Creates a new instance of a class resulting from extending the self class with the specified prototype.
 */$2394d727dfd6a212$var$Class.create=function(t){return new(this.extend(t))},/**
 * Mutates the host object to be an instance of the specified class.
 * !static mutate (classConstructor: object, host: object, override?: object) : object;
 */$2394d727dfd6a212$var$Class.mutate=function(t,e,n=null){let s=new t;// Copy all members from the class prototype.
for(let n in t.prototype)e.hasOwnProperty(n)||(e[n]=t.prototype[n]);// Copy all members from the zombie class instance.
for(let t in s)e.hasOwnProperty(t)||(e[t]=s[t]);// Rebind the super references.
if(e._super)for(let n in e._super)for(let s in e._super[n])e._super[n][s]=t.prototype.constructor._super[n].prototype[s].bind(e);// Copy override members.
if(null!==n)for(let t in n)e[t]=n[t];return e};var $2394d727dfd6a212$export$2e2bcd8739ae039=$2394d727dfd6a212$var$Class,$fMUO1=parcelRequire("fMUO1"),/**
**	Holds the information about a triggered event. It also provides a mechanism to allow asynchronous
**	event propagation to ensure the event chain order.
*/$13eda5a5dec8010f$export$2e2bcd8739ae039=$2394d727dfd6a212$export$2e2bcd8739ae039.extend({className:"Event",/**
	**	Source of the event.
	*/source:null,/**
	**	Name of the event.
	*/name:null,/**
	**	Arguments of the event.
	*/args:null,/**
	**	Indicates if the last event handler wants to use async mode.
	*/_async:!1,/**
	**	Queue of all handlers to invoke.
	*/list:null,/**
	**	Next event to be executed in the event chain.
	*/next:null,/**
	**	Return values from event handlers.
	*/ret:null,/**
	**	Original root event.
	*/original:null,/**
	**	Index of the current event handler.
	*/i:-1,/**
	**	Contructs an event object with the specified parameters. Source is the event-dispatcher object, list is
	**	an array with all the listeners to invoke. The eventName and eventArgs are the event information to be
	**	passed to each handler and if a callback is specified (cbHandler+cbContext) it will be executed once all
	**	the event handlers have been processed.
	**
	**	Event __ctor (source: EventDispatcher, list: Array, eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	*/__ctor:function(t,e,n,s,r,a){this.source=t,this.name=n,this.args=s,this.cbHandler=r,this.cbContext=a,this.list=e,this.reset()},/**
	**	Resets the event to its initial state. An event object can be reused by resetting it and then
	**	invoking the resume event.
	**
	**	Event reset ();
	*/reset:function(){return this.next=null,this.ret=[],this._async=!1,this.i=-1,this},/**
	**	Changes the source of the event.
	**
	**	Event setSource (object value);
	*/setSource:function(t){return this.source=t,this},/**
	**	Sets the internal asynchronous flag. Should be called before a handler returns. If a handler
	**	calls this method it should also call resume() when async operations are finished.
	**
	**	Event wait ();
	*/wait:function(){return this._async=!0,this},/**
	**	Resumes event propagation. Should be called manually by event handlers that also call wait().
	**
	**	Event resume ();
	*/resume:function(){for(this._async=!1;!this._async&&!(++this.i>=this.list.length);)if(!this.list[this.i].silent){if("string"==(0,$fMUO1.default).typeOf(this.list[this.i].handler)){if(this.list[this.i].context){if(!this.list[this.i].context[this.list[this.i].handler])continue;if(!1===this.list[this.i].context[this.list[this.i].handler](this,this.args,this.list[this.i].data))break}else if(!1===$parcel$global[this.list[this.i].handler].call(null,this,this.args,this.list[this.i].data))break}else if(!1===this.list[this.i].handler.call(this.list[this.i].context,this,this.args,this.list[this.i].data))break}return this._async||(this.i>=this.list.length&&this.next&&this.next.resume(),this.cbHandler&&this.cbHandler.call(this.cbContext)),this},/**
	**	Sets the "original" property of the event to indicate where the original event comes from.
	**
	**	Event from (event: Event);
	*/from:function(t){return this.original=t,this},/**
	**	Enqueues the specified event to be executed upon the current event process is finished. The "original"
	**	property of the chained event will be set to the current event.
	**
	**	Event enqueueEvent (event: Event);
	*/enqueue:function(t){var e;if(!t)return this;for(e=this;null!=e.next;e=e.next);return e.next=t,t.from(this),this}}),/**
**	Event dispatcher allows several event listeners to be attached, these will be invoked whenever the
**	event that is being listened to is triggered.
*/$c43adaf9cb6d6dd3$export$2e2bcd8739ae039=$2394d727dfd6a212$export$2e2bcd8739ae039.extend({className:"EventDispatcher",/**
	**	Listeners attached to this event dispatcher. Grouped by event name.
	*/listeners:null,/**
	**	Namespace for event dispatching. Defaults to null. Can be modified using setNamespace().
	*/namespace:null,/**
	**	Initializes the event dispatcher.
	**
	**	EventDispatcher __ctor ();
	*/__ctor:function(){this.listeners={}},/**
	**	Sets the event dispatching namespace. Used to force all events dispatched to have the specified namespace.
	**
	**	EventDispatcher setNamespace (value: string);
	*/setNamespace:function(t){return this.namespace=t,this},/**
	**	Adds an event listener for a specified event to the event dispatcher. The event name can have an optional
	**	namespace indicator which is added to the beginning of the event name and separated using a colon (:). This
	**	indicator can be used to later trigger or remove all handlers of an specific namespace.
	**
	**	EventDispatcher addEventListener (eventName: string, handler: function, context: object, data: object);
	*/addEventListener:function(t,e,n,s){var r=(t=t.split(":"))[t.length-1],a=t.length>1?t[0]:null;return this.listeners[r]||(this.listeners[r]=[]),this.listeners[r].push({ns:a,handler:e,context:n,data:s,silent:0}),this},/**
	**	Removes an event listener from the event dispatcher. If only the name is provided all handlers with the
	**	specified name will be removed. If a context is provided without a handler then any handler matching the
	**	context will be removed. Special event name "*" can be used to match all event names.
	**
	**	EventDispatcher removeEventListener (eventName: string, handler: function, context: object);
	*/removeEventListener:function(t,e,n){var s=(t=t.split(":"))[t.length-1],r=t.length>1?t[0]:null;if("*"==s)for(var a in this.listeners)for(var o=this.listeners[a],l=0;l<o.length;l++){var h=!0;e&&(h=h&&o[l].handler===e),n&&(h=h&&o[l].context===n),r&&(h=h&&o[l].ns==r),h&&o.splice(l--,1)}else{if(!this.listeners[s])return this;for(var o=this.listeners[s],l=0;l<o.length;l++){var h=!0;e&&(h=h&&o[l].handler===e),n&&(h=h&&o[l].context===n),r&&(h=h&&o[l].ns==r),h&&o.splice(l--,1)}}return this},/**
	**	Prepares an event with the specified parameters for its later usage. The event is started when
	**	the resume() method is called. If a callback is specified it will be executed once all event
	**	handlers have been processed.
	**
	**	Event prepareEvent (eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	**	Event prepareEvent (eventName: string, eventArgs: map);
	*/prepareEvent:function(t,e,n,s){var r=[],a=(t=t.split(":"))[t.length-1],o=t.length>1?t[0]:null;this.listeners[a]&&(r=r.concat(this.listeners[a])),this.listeners["*"]&&(r=r.concat(this.listeners["*"]));for(var l=0;l<r.length;l++)r[l].silent&&r.splice(l--,1);if(o)for(var l=0;l<r.length;l++)r[l].ns!=o&&r.splice(l--,1);return new $13eda5a5dec8010f$export$2e2bcd8739ae039(this,r,a,e,n,s)},/**
	**	Silences or unsilences all handlers attached to an event such that if the event fires the handler(s) will
	**	not be invoked. It is recommended to use a namespace to ensure other handlers will continue to be run.
	**
	**	EventDispatcher silence (eventName: string);
	*/silence:function(t,e){var n=(t=t.split(":"))[t.length-1],s=t.length>1?t[0]:null;if(e=!1===e?-1:1,"*"==n)for(var r in this.listeners)for(var a=this.listeners[r],o=0;o<a.length;o++)s&&a[o].ns!=s||(a[o].silent+=e);else{if(!this.listeners[n])return this;for(var a=this.listeners[n],o=0;o<a.length;o++)s&&a[o].ns!=s||(a[o].silent+=e)}return this},/**
	**	Dispatches an event to the respective listeners. If a callback is specified it will be executed once
	**	all event handlers have been processed.
	**
	**	Event dispatchEvent (eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	**	Event dispatchEvent (eventName: string, eventArgs: map);
	*/dispatchEvent:function(t,e,n,s){return this.prepareEvent(this.namespace?this.namespace+":"+t:t,e,n,s).resume()}}),$fMUO1=parcelRequire("fMUO1"),$4VREF=parcelRequire("4VREF");/**
**	A model is a high-integrity data object used to store properties and more importantly to provide event support to notify of any
**	kind of change that occurs to the model's properties. Integrity of the model is maintained by optionally using property constraints.
*/let $4dfa0622e14576ea$var$_Model=$c43adaf9cb6d6dd3$export$2e2bcd8739ae039.extend({className:"Model",/**
	**	Default properties for the model. Can be a map with the property name and its default value or a function
	**	returning a map with dynamic default values. This is used to reset the model to its initial state.
	*/defaults:null,/**
	**	Model property contraints. A map with the property name and an object specifying the constraints of the
	**	property. This is used to determine the type, format and behavior of each property in the model.
	*/constraints:null,/**
	**	Properties of the model.
	*/data:null,/**
	**	Array with the name of the properties that have changed. Populated prior modelChanged event.
	*/changedList:null,/**
	**	Silent mode indicator. While in silent mode events will not be dispatched.
	*/_silent:0,/**
	**	Current nesting level of the set() method. This is used to determine when all the property
	**	changes are done.
	*/_level:0,/**
	**	Initializes the model and sets the properties to the specified data object.
	**
	**	>> Model __ctor (object data);
	**	>> Model __ctor (object data, object defaults);
	*/__ctor:function(t,e){if(this._super.EventDispatcher.__ctor(),this.data={},null!=e)this.reset(e,!1);else{let t=null;if(!this.defaults&&this.constraints)for(let e in t={},this.constraints){let n=this.constraints[e];if(null===n.def||void 0===n.def){t[e]=null;continue}"function"==typeof n.def?t[e]=n.def():t[e]=n.def}this.reset(t)}this.init(),null!=t&&this.set(t,!0),this.constraints&&this.update(),this.ready()},/**
	**	Resets the model to its default state and triggers update events. If a map is provided the defaults of
	**	the model will be set to the specified map.
	**
	**	>> Model reset (object defaults, [bool nsilent=true]);
	**	>> Model reset ([bool nsilent=true]);
	*/reset:function(t,e){if(!this.defaults){if(!t||"object"!==(0,$fMUO1.default).typeOf(t)&&"function"!==(0,$fMUO1.default).typeOf(t))return this;this.defaults=t}return"function"===(0,$fMUO1.default).typeOf(this.defaults)?this.data=this.defaults():this.data=(0,$fMUO1.default).clone(this.defaults),!1===e||!1===t?this:this.update(null,!0)},/**
	**	Initializes the model. Called before the model properties are set.
	**
	**	>> void init ();
	*/init:function(){},/**
	**	Initialization epilogue. Called after initialization and after model properties are set.
	**
	**	>> void ready ();
	*/ready:function(){},/**
	**	Enables or disables silent mode. When the model is in silent mode events will not be dispatched.
	**
	**	>> Model silent (value: bool);
	*/silent:function(t){return this._silent+=t?1:-1,this},/**
	**	Validates a property name and value against the constraints defined in the model (if any). Returns the
	**	final value if successful or throws an empty exception if errors occur.
	**
	**	>> T _validate (string name, T value);
	*/_validate:function(t,e){if(!this.constraints||!this.constraints[t])return e;var n=this.constraints[t],s=e;for(var r in n)if($4dfa0622e14576ea$var$_Model.Constraints[r])try{s=$4dfa0622e14576ea$var$_Model.Constraints[r](this,n[r],t,s)}catch(e){if("null"==e.message)break;throw Error(`Constraint [${r}:${n[r]}] failed on property '${t}'.`)}return s},/**
	**	Sets the value of a property and returns the value set. This method is internally used to set properties
	**	one at a time. If constraints are present in the model for the specified property all constraints will be
	**	verified. When constraint errors occur the constraintError event will be raised and the property value
	**	will not be changed.
	**
	**	>> T _set (string name, T value);
	*/_set:function(t,e){if(!this.constraints||!this.constraints[t])return this.data[t]=e,e;var n=this.constraints[t];this.data[t];var s=e;for(var r in n)if($4dfa0622e14576ea$var$_Model.Constraints[r])try{s=$4dfa0622e14576ea$var$_Model.Constraints[r](this,n[r],t,s)}catch(n){if("null"==n.message)break;this._silent||this.dispatchEvent("constraintError",{constraint:r,message:n.message,name:t,value:e});break}return this.data[t]=s},/**
	**	Triggers property events to indicate a property is changing. First triggers "propertyChanging" and then
	**	"propertyChanged". If the first event returns false the second event will not be triggered.
	**
	**	>> void _propertyEvent (string name, T prev, T value, bool direct=false);
	*/_propertyEvent:function(t,e,n,s){var r={name:t,old:e,value:n,level:this._level},a=this.dispatchEvent("propertyChanging",r);s?this.data[t]=r.value:r.value=this._set(t,r.value),null!=a&&a.ret.length&&!1===a.ret[0]||(this.dispatchEvent("propertyChanged."+t,r),this.dispatchEvent("propertyChanged",r),this.changedList.push(t))},/**
	**	Sets one or more properties of the model. Possible arguments can be two strings or a map.
	**
	**	>> Model set (string name, T value, bool force=true);
	**	>> Model set (string name, T value, bool silent=false);
	**	>> Model set (string name, T value);
	**	>> Model set (object data);
	*/set:function(){var t=arguments.length,e=!1,n=!1;if((t>2||2==t&&"object"==(0,$fMUO1.default).typeOf(arguments[0]))&&"boolean"==(0,$fMUO1.default).typeOf(arguments[t-1])&&(e=arguments[--t],!1===e&&(n=!0)),0==this._level&&(this.changedList=[]),this._level++,2==t)(this.data[arguments[0]]!==arguments[1]||e)&&(this._silent||n?this._set(arguments[0],arguments[1]):this._propertyEvent(arguments[0],this.data[arguments[0]],this._validate(arguments[0],arguments[1])));else for(var s in arguments[0])(this.data[s]!==arguments[0][s]||e)&&(this._silent||n?this._set(s,arguments[0][s]):this._propertyEvent(s,this.data[s],this._validate(s,arguments[0][s])));return--this._level||!this.changedList.length||n||this._silent||this.dispatchEvent("modelChanged",{fields:this.changedList}),this},/**
	**	Returns true if the given key exists in the model.
	**
	**	>> boolean has (string name);
	*/has:function(t){return t in this.data},/**
	**	Returns the value of a property. If no name is specified the whole map of properties will be returned.
	**	If a boolean value of "true" is provided the properties map will be returned but first will be compacted
	**	using the default data to ensure only valid properties are present.
	**
	**	>> T get (string name);
	**	>> object get ();
	**	>> object get (true);
	**	>> object get (false);
	**	
	*/get:function(t,e){return 0==arguments.length||!1===t?this.data:1==arguments.length&&!0===t?this.flatten():2==arguments.length&&void 0===this.data[t]?e:this.data[t]},/**
	**	Returns the value of a property as an integer number.
	**
	**	>> int getInt (string name, [int def]);
	*/getInt:function(t,e){return 2==arguments.length&&void 0===this.data[t]?e:parseInt(this.data[t])},/**
	**	Returns the value of a property as a floating point number.
	**
	**	>> float getFloat (string name, [float def]);
	*/getFloat:function(t,e){return 2==arguments.length&&void 0===this.data[t]?e:parseFloat(this.data[t])},/**
	**	Returns the value of a property as a boolean value (true or false).
	**
	**	>> bool getBool (string name, [bool def]);
	**	
	*/getBool:function(t,e){return t=2==arguments.length&&void 0===this.data[t]?e:this.data[t],"true"===t||!0===t||"false"!==t&&!1!==t&&!!parseInt(t)},/**
	**	Returns a reference object for a model property. The resulting object contains two methods
	**	named "get" and "set" to modify the value of the property.
	**
	**	>> object getReference (string name);
	*/getReference:function(t){var e=this;return{get:function(){return e.get(t)},set:function(n){e.set(t,n)}}},/**
	**	Sets or returns a constraint given the property name. 
	**
	**	>> Model constraint (string field, string constraint, T value);
	**	>> Model constraint (string field, object constraint);
	**	>> Model constraint (object constraints);
	**	>> object constraint (string field);
	*/constraint:function(t,e,n){if(3==arguments.length||2==arguments.length||1==arguments.length&&"object"==(0,$fMUO1.default).typeOf(t)){switch(this.constraints===this.constructor.prototype.constraints&&(this.constraints=(0,$fMUO1.default).clone(this.constraints)),arguments.length){case 1:(0,$fMUO1.default).override(this.constraints,t);break;case 2:(0,$fMUO1.default).override(this.constraints[t],e);break;case 3:this.constraints[t][e]=n}return this}return t?this.constraints[t]:this},/**
	**	Returns a compact version of the model properties. That is, a map only with validated properties that are
	**	also present in the default data map. Returns null if the object is not compliant. If the "safe" parameter
	**	is set one last property named "class" will be attached, this specifies the original classPath of the object.
	**
	**	>> object flatten ([bool safe=false]);
	*/flatten:function(t,e){if(t){var n=this.flatten(!1,!0);return null==n?null:(n.class=this.classPath,n)}if(!this.constraints&&!this.defaults)return this.data;if(!this.isCompliant())return{};var s=this.constraints,r=this.defaults?"function"==(0,$fMUO1.default).typeOf(this.defaults)?this.defaults():this.defaults:this.constraints,n={};for(var a in this.data)if(a in r){if(s&&s[a]){var o=s[a];if(o.model){n[a]=this.data[a]?this.data[a].flatten(e):null;continue}if(o.arrayof){n[a]=[];for(var l=0;l<this.data[a].length;l++)n[a][l]=this.data[a][l]?this.data[a][l].flatten(e):null;continue}if(o.cls){n[a]=this.data[a]?this.data[a].flatten():null;continue}}n[a]=this.data[a]}return n},/**
	**	Removes a property or a list of properties.
	**
	**	>> void remove (string name, [bool nsilent=true]);
	**	>> void remove (array name, [bool nsilent=true]);
	*/remove:function(t,e){if("array"==(0,$fMUO1.default).typeOf(t)){for(var n=0;n<t.length;n++)delete this.data[t[n]];!1===e||this._silent||this.dispatchEvent("propertyRemoved",{fields:t})}else delete this.data[t],!1===e||this._silent||this.dispatchEvent("propertyRemoved",{fields:[t]})},/**
	**	Triggers data change events for one or more properties. Ensure that silent mode is not enabled or else
	**	this method will have no effect. If no parameters are provided a full update will be triggered on all of
	**	the model properties.
	**
	**	>> Model update (array fields);
	**	>> Model update (string name);
	**	>> Model update (bool forceModelChanged);
	**	>> Model update ();
	*/update:function(t,e){if(this._silent)return this;if(0==this._level&&(this.changedList=[]),this._level++,t&&"string"==(0,$fMUO1.default).typeOf(t))this._propertyEvent(t,this.data[t],this.data[t],e);else if(t&&"array"==(0,$fMUO1.default).typeOf(t))for(var n of t)this._propertyEvent(n,this.data[n],this.data[n],e);else for(var n in this.data)this._propertyEvent(n,this.data[n],this.data[n],e);return--this._level||this._silent||0==this.changedList.length&&!0!==t||this.dispatchEvent("modelChanged",{fields:this.changedList}),this},/**
	**	Validates one or mode model properties using the defined constraints. If no parameters are provided all of
	**	the properties in the model will be validated.
	**
	**	>> Model validate (array fields);
	**	>> Model validate (string name);
	**	>> Model validate ();
	*/validate:function(t){if(!this.constraints)return this;if(t&&"string"==(0,$fMUO1.default).typeOf(t))this._set(t,this.data[t]);else for(var e in this.data)t&&-1==(0,$fMUO1.default).indexOf(t,e)||this._set(e,this.data[e]);return this},/**
	**	Validates all the properties in the model and returns a boolean indicating if all of them comply with the
	**	constraints defined in the model.
	**
	**	>> bool isCompliant ();
	*/isCompliant:function(){if(!this.constraints)return!0;try{for(var t in this.data)this._validate(t,this.data[t]);return!0}catch(t){}return!1},/**
	**	Registers an event handler for changes in a specific property of the model.
	**
	**	>> void observe (string property, function handler, object context);
	*/observe:function(t,e,n){this.addEventListener("propertyChanged."+t,e,n)},/**
	**	Unregisters an event handler from changes in a specific property of the model.
	**
	**	>> void unobserve (string property, function handler, object context);
	*/unobserve:function(t,e,n){this.removeEventListener("propertyChanged."+t,e,n)},/**
	**	Adds a propertyChanged event handler for the given property. The property name can have an event namespace prepended and separated by colon.
	**
	**	>> void watch (string property, function handler);
	*/watch:function(t,e){1==(t=t.split(":")).length&&(t[1]=t[0],t[0]="watch"),this.addEventListener(t[0]+":propertyChanged."+t[1],function(t,n){e(n.value,n,t)})},/**
	**	Removes propertyChanged handlers related to the specified property. The property name can have an event namespace prepended and separated by colon.
	**
	**	>> void unwatch (string property);
	*/unwatch:function(t){1==(t=t.split(":")).length&&(t[1]=t[0],t[0]="watch"),this.removeEventListener(t[0]+":propertyChanged."+t[1])},/**
	 * Triggers a field change event. Even if the value of the field is the same as the model's, the event will still be triggered.
	 */trigger:function(t,e=null){return this.set(t,e,!0)},/**
	**	Serializes the model into a string.
	**
	**	string toString ();
	*/toString:function(){return(0,$fMUO1.default).serialize(this.get(!0))}});$4dfa0622e14576ea$var$_Model.Constraints=$4VREF.default;var $4dfa0622e14576ea$export$2e2bcd8739ae039=$4dfa0622e14576ea$var$_Model,$fMUO1=parcelRequire("fMUO1"),/**
**	Generic list for models.
*/$0890bed8a163f087$export$2e2bcd8739ae039=$4dfa0622e14576ea$export$2e2bcd8739ae039.extend({className:"ModelList",/**
	**	Class of the items in the list, can be overriden by child classes to impose a more strict constraint.
	*/itemt:$4dfa0622e14576ea$export$2e2bcd8739ae039,/**
	**	Mirror of data.contents
	*/contents:null,/**
	**	IDs of every item in the contents.
	*/itemId:null,/**
	**	Autoincremental ID for the next item to be added.
	*/nextId:null,/**
	**	Default properties of the model.
	*/defaults:{contents:null},/**
	**	Constraints of the model to ensure integrity.
	*/constraints:{contents:{type:"array",arrayof:"@itemt"}},/**
	**	Constructor.
	*/__ctor:function(...t){this.itemId=[],this.nextId=0,this._super.Model.__ctor(...t)},/**
	**	Initialization epilogue. Called after initialization and after model properties are set.
	*/ready:function(){this._eventGroup="ModelList_"+Date.now()+":modelChanged",this.contents=this.data.contents},/**
	**	Connects the event handlers to the item.
	**
	**	>> Model _bind (int iid, Model item);
	*/_bind:function(t,e){return e&&e.addEventListener&&e.addEventListener(this._eventGroup,this._onItemEvent,this,t),e},/**
	**	Disconnects the event handlers from the item.
	**
	**	>> Model _unbind (Model item);
	*/_unbind:function(t){return t&&t.removeEventListener&&t.removeEventListener(this._eventGroup),t},/**
	**	Handler for item events.
	**
	**	>> Model _onItemEvent (Event evt, object args, int iid);
	*/_onItemEvent:function(t,e,n){this.prepareEvent("itemChanged",{id:n,item:t.source}).from(t).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume()},/**
	**	Returns the number of items in the list.
	**
	**	>> int length ();
	*/length:function(){return this.data.contents.length},/**
	**	Clears the contents of the list.
	**
	**	>> void clear ();
	*/clear:function(){for(var t=0;t<this.data.contents;t++)this._unbind(this.data.contents[t]);return this.itemId=[],this.nextId=0,this.contents=this.data.contents=[],this.prepareEvent("itemsCleared").enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),this},/**
	**	Sets the contents of the list with the specified array. All items will be ensured to be of the same model
	**	type as the one specified in the list.
	**
	**	>> ModelList setData (array data);
	*/setData:function(t){if(this.clear(),!t)return this;for(var e=0;e<t.length;e++){var n=(0,$fMUO1.default).ensureTypeOf(this.itemt,t[e]);this.itemId.push(this.nextId++),this.data.contents.push(n),this._bind(this.nextId-1,n)}return this.prepareEvent("itemsChanged").enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),this},/**
	**	Returns the raw array contents of the list.
	**
	**	>> array getData ();
	*/getData:function(){return this.data.contents},/**
	**	Returns the item at the specified index or null if the index is out of bounds.
	**
	**	>> Model getAt (int index);
	*/getAt:function(t){return t<0||t>=this.data.contents.length?null:this.data.contents[t]},/**
	**	Removes and returns the item at the specified index. Returns null if the index is out of bounds.
	**
	**	>> Model removeAt (int index);
	*/removeAt:function(t){if(t<0||t>=this.data.contents.length)return null;let e=this.data.contents.splice(t,1)[0],n=this.itemId.splice(t,1)[0];return this._unbind(e),this.prepareEvent("itemRemoved",{id:n,item:e}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),e},/**
	**	Sets the item at the specified index. Returns false if the index is out of bounds, true otherwise. The
	**	item will be ensured to be of the model defined in the list.
	**
	**	>> bool setAt (int index, Model item);
	*/setAt:function(t,e){return!(t<0)&&!(t>=this.data.contents.length)&&(e=(0,$fMUO1.default).ensureTypeOf(this.itemt,e),this._unbind(this.data.contents[t]),this.data.contents[t]=e,this._bind(this.itemId[t],e),this.prepareEvent("itemChanged",{id:this.itemId[t],item:e}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),!0)},/**
	**	Notifies a change in the item at the specified index. Returns false if the index is out of bounds.
	**
	**	>> bool updateAt (int index);
	*/updateAt:function(t){return!(t<0)&&!(t>=this.data.contents.length)&&(this.prepareEvent("itemChanged",{id:this.itemId[t],item:this.data.contents[t]}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),!0)},/**
	**	Adds an item to the bottom of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model push (Model item);
	*/push:function(t){return t&&"object"!=(0,$fMUO1.default).typeOf(t)?null:(t=(0,$fMUO1.default).ensureTypeOf(this.itemt,t),this.itemId.push(this.nextId++),this.data.contents.push(t),this._bind(this.nextId-1,t),this.prepareEvent("itemAdded",{id:this.itemId[this.itemId.length-1],item:t,position:"tail"}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),t)},/**
	**	Removes and returns an item from the bottom of the list.
	**
	**	>> Model pop ();
	*/pop:function(){return this._unbind(this.data.contents.pop())},/**
	**	Adds an item to the top of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model unshift (Model item);
	*/unshift:function(t){return t&&"object"!=(0,$fMUO1.default).typeOf(t)?null:(t=(0,$fMUO1.default).ensureTypeOf(this.itemt,t),this.itemId.unshift(this.nextId++),this.data.contents.unshift(t),this._bind(this.nextId-1,t),this.prepareEvent("itemAdded",{id:this.itemId[0],item:t,position:"head"}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),t)},/**
	**	Removes and returns an item from the top of the list.
	**
	**	>> Model shift ();
	*/shift:function(){return this._unbind(this.data.contents.shift())},/**
	**	Searches for an item matching the specified partial definition and returns its index. Returns -1 if the
	**	item was not found. If retObject is set to true the object will be returned instead of its index and null
	**	will be returned when the item is not found.
	**
	**	int|object find (object data, bool retObject=false);
	*/find:function(t,e=!1){for(var n=this.data.contents,s=0;s<n.length;s++)if((0,$fMUO1.default).partialCompare(n[s].data,t))return e?n[s]:s;return e?null:-1}}),$fMUO1=parcelRequire("fMUO1");/**
 * The utility functions in this module allow to create a very strict serialization/deserialization schema
 * to ensure that all values are of the specific type when stored in string format.
 */let $2710795e2347ba2a$var$Schema={Type:function(t){let e={flatten:function(t,e){return t},unflatten:function(t,e){return t}};return t?(0,$fMUO1.default).override(e,t):e},String:function(){return $2710795e2347ba2a$var$Schema.Type({flatten:function(t,e){return null!=t?t.toString():null},unflatten:function(t,e){return null!=t?t.toString():null}})},Integer:function(){return $2710795e2347ba2a$var$Schema.Type({flatten:function(t,e){return~~t},unflatten:function(t,e){return~~t}})},Number:function(t){return $2710795e2347ba2a$var$Schema.Type({_precision:t,_round:!1,precision:function(t){return this._precision=~~t,this},flatten:function(t,e){return t=parseFloat(t),this._precision>0&&(t=~~(t*Math.pow(10,this._precision))/Math.pow(10,this._precision)),t},unflatten:function(t,e){return parseFloat(t)}})},Bool:function(t){return $2710795e2347ba2a$var$Schema.Type({_compact:t,compact:function(t){return this._compact=t,this},flatten:function(t,e){return t=~~t,this._compact?t>0?1:0:t>0},unflatten:function(t,e){return!!~~t}})},SharedString:function(){return $2710795e2347ba2a$var$Schema.Type({flatten:function(t,e){return null==t?0:(t=t.toString(),"strings"in e||(e.index={},e.strings=[]),t in e.index||(e.strings.push(t),e.index[t]=e.strings.length),e.index[t])},unflatten:function(t,e){return null==t||0==t?null:e.strings[~~t-1]}})},Array:function(t){return $2710795e2347ba2a$var$Schema.Type({itemType:t,_debug:!1,_filter:null,debug:function(t){return this._debug=t,this},of:function(t){return this.itemType=t,this},filter:function(t){return this._filter=t,this},flatten:function(t,e){if(null==t)return null;let n=[];for(let s=0;s<t.length;s++)(!this._filter||this._filter(t[s],s))&&n.push(this.itemType.flatten(t[s],e));return n},unflatten:async function(t,e){if(null==t)return null;let n=[];for(let s=0;s<t.length;s++)n.push(await this.itemType.unflatten(t[s],e));return n}})},Object:function(){return $2710795e2347ba2a$var$Schema.Type({properties:[],property:function(t,e,n=null){return this.properties.push({name:t,source:t,type:e,defvalue:n}),this},propertyAlias:function(t,e,n,s=null){return this.properties.push({name:t,source:e,type:n,defvalue:s}),this},flatten:function(t,e){let n;if(null==t)return null;if(!0===e.symbolic){n={};for(let s=0;s<this.properties.length;s++)this.properties[s].source in t?n[this.properties[s].name]=this.properties[s].type.flatten(t[this.properties[s].source],e):n[this.properties[s].name]=this.properties[s].type.flatten(this.properties[s].defvalue,e)}else{n=[];for(let s=0;s<this.properties.length;s++)this.properties[s].source in t?n.push(this.properties[s].type.flatten(t[this.properties[s].source],e)):n.push(this.properties[s].type.flatten(this.properties[s].defvalue,e))}return n},unflatten:async function(t,e){if(null==t)return null;let n={};if(!0===e.symbolic)for(let s=0;s<this.properties.length;s++)n[this.properties[s].name]=await this.properties[s].type.unflatten(this.properties[s].name in t?t[this.properties[s].name]:this.properties[s].defvalue,e);else for(let s=0;s<this.properties.length;s++)n[this.properties[s].name]=await this.properties[s].type.unflatten(s in t?t[s]:this.properties[s].defvalue,e);return n}})},Class:function(t){return $2710795e2347ba2a$var$Schema.Type({_constructor:t,constructor:function(t){return this._constructor=t,this},flatten:function(t,e){return null==t?null:t.flatten(e)},unflatten:async function(t,e){return null==t?null:await new this._constructor().unflatten(t,e)}})},/*
	**	Used when you want to specify just a single property.
	*/Property:function(t,e){return $2710795e2347ba2a$var$Schema.Type({property:t,type:e,name:function(t){return this.property=t,this},is:function(t){return this.type=t,this},flatten:function(t,e){let n;return null==t?null:(!0===e.symbolic?(n={})[this.property]=this.type.flatten(t[this.property],e):n=this.type.flatten(t[this.property],e),n)},unflatten:async function(t,e){if(null==t)return null;let n={};return!0===e.symbolic?n[this.property]=await this.type.unflatten(t[this.property],e):n[this.property]=await this.type.unflatten(t,e),n}})},Map:function(){return $2710795e2347ba2a$var$Schema.Type({flatten:function(t,e){if(null==t)return null;if(!0===e.symbolic)return t;let n=[];for(let e in t)n.push(e),n.push(t[e]);return n},unflatten:function(t,e){if(null==t)return null;if(!0===e.symbolic)return t;let n={};for(let e=0;e<t.length;e+=2)n[t[e]]=t[e+1];return n}})},Selector:function(){return $2710795e2347ba2a$var$Schema.Type({conditions:[],value:null,when:function(t,e){return this.conditions.push([e=>e===t,e]),this},with:function(t){return this.value=t,this},flatten:function(t,e){if(null==t)return null;for(let n of this.conditions)if(!0===n[0](this.value))return n[1].flatten(t,e);return null},unflatten:async function(t,e){if(null==t)return null;for(let n of this.conditions)if(!0===n[0](this.value))return await n[1].unflatten(t,e);return null}})}};var $2710795e2347ba2a$export$2e2bcd8739ae039=$2710795e2347ba2a$var$Schema,/**
**	Class used to add flattening and unflattening capabilities to any object. A "flat" object is an object composed
**	only of native types, that is: `null,` `boolean`, `integer`, `number`, `array` or `object`.
*/$32651d5f38a8a64c$export$2e2bcd8739ae039=$2394d727dfd6a212$export$2e2bcd8739ae039.extend({className:"Flattenable",/**
	**	Type schema used to flatten/unflatten the contents of this class. See Schema class for more information.
	*/typeSchema:null,/**
	**	Returns the flattened contents of the object.
	*/flatten:function(t){return this.typeSchema.flatten(this,t)},/**
	**	Unflattens the given object and overrides the local contents.
	*/unflatten:async function(t,e){return Object.assign(this,await this.typeSchema.unflatten(t,e)),await this.onUnflattened(),this},/*
	**	Executed when the unflatten() method is called on the object.
	*/onUnflattened:async function(){}}),$fMUO1=parcelRequire("fMUO1"),/**
**	Flattenable collection class, used to store items and manipulate them. The items should also be flattenable.
*/$2bcce06113365814$export$2e2bcd8739ae039=$32651d5f38a8a64c$export$2e2bcd8739ae039.extend({className:"Collection",/**
	**	Describes the type schema of the underlying items.
	*/itemTypeSchema:null,/**
	**	Array of items.
	*/items:null,/* Array *//**
	**	Constructs the collection.
	*/__ctor:function(t){t||(t=this.itemTypeSchema),t&&(this.typeSchema=$2710795e2347ba2a$export$2e2bcd8739ae039.Property("items").is($2710795e2347ba2a$export$2e2bcd8739ae039.Array().of(t))),this.reset()},/*
	**	Executed after the collection has been unflattened, re-adds the items to ensure onItemAdded() is called.
	*/onUnflattened:function(){let t=this.items;for(let e of(this.reset(),t))this.add(e)},/**
	 * 	Executed when the value in `items` is changed.
	 */itemsReferenceChanged:function(){},/*
	**	Resets the collection to empty. Note that onItemRemoved will not be called.
	*/reset:function(){return this.items=[],this.itemsReferenceChanged(),this},/*
	**	Clears the contents of the collection (removes each item manually, onItemRemoved will be called).
	*/clear:function(){var t=this.items;this.reset();for(var e=0;e<t.length;e++)this.onItemRemoved(t[e],0);return this},/*
	**	Sorts the collection. A comparison function should be provided, or the name of a property to sort by.
	**
	**	Object sort (fn: Function)
	**	Object sort (prop: string, [desc:bool=false])
	*/sort:function(t,e){return"function"!=typeof t?this.items.sort(function(n,s){return(n[t]<=s[t]?-1:1)*(!0===e?-1:1)}):this.items.sort(t),this},/*
	**	Searches for an item with the specified fields and returns it. The "inc" object is the "inclusive" map, meaning all fields must match
	**	and the optional "exc" is the exclusive map, meaning not even one field should match.
	**
	**	Object findItem (inc: Object, exc: Object);
	*/findItem:function(t,e){if(!this.items)return null;for(var n=0;n<this.items.length;n++)if(!(e&&(0,$fMUO1.default).partialCompare(this.items[n],e))&&(0,$fMUO1.default).partialCompare(this.items[n],t))return this.items[n];return null},/*
	**	Returns the container array.
	*/getItems:function(){return this.items},/*
	**	Returns the number of items in the collection.
	*/length:function(){return this.items.length},/*
	**	Returns true if the collection is empty.
	*/isEmpty:function(){return!this.items.length},/*
	**	Returns the index of the specified item, or -1 if not found.
	*/indexOf:function(t){return this.items.indexOf(t)},/*
	**	Returns the item at the specified index, or null if not found. When `relative` is true, negative offsets are allowed such that -1 refers to the last item.
	*/getAt:function(t,e=!1){return t<0&&!0==e&&(t+=this.items.length),t>=0&&t<this.items.length?this.items[t]:null},/*
	**	Returns the first item in the collection.
	*/first:function(){return this.getAt(0)},/*
	**	Returns the last item in the collection.
	*/last:function(){return this.getAt(-1,!0)},/*
	**	Adds an item at the specified index, effectively moving the remaining items to the right.
	*/addAt:function(t,e){if(!e||!this.onBeforeItemAdded(e))return this;if(t<0&&(t=0),t>this.items.length&&(t=this.items.length),0==t)this.items.unshift(e);else if(t==this.items.length)this.items.push(e);else{var n=this.items.splice(0,t);n.push(e),this.items=n.concat(this.items),this.itemsReferenceChanged()}return this.onItemAdded(e),this},/*
	**	Adds an item to the start of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/unshift:function(t){return this.addAt(0,t)},/*
	**	Adds an item to the end of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/push:function(t){return this.addAt(this.items.length,t)},/*
	**	Adds an item to the end of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/add:function(t){return this.push(t)},/*
	**	Removes the item at the specified index. When `relative` is true, negative offsets are allowed such that -1 refers to the last item.
	*/removeAt:function(t,e=!1){if(t<0&&!0==e&&(t+=this.items.length),t<0||t>=this.items.length)return null;var n=this.items[t];return this.items.splice(t,1),this.onItemRemoved(n,t),n},/*
	**	Removes an item from the end of the collection.
	*/pop:function(t){return this.removeAt(-1,!0)},/*
	**	Removes an item from the start of the collection.
	*/shift:function(t){return this.removeAt(0)},/*
	**	Removes the specified item from the collection.
	*/remove:function(t){return this.removeAt(this.indexOf(t))},/*
	**	Runs the specified callback for each of the items in the collection, if false is returned by the callback this function
	**	will exit immediately. Parameters to the callback are: (item, index, collection).
	*/forEach:function(t){if(this.isEmpty())return this;for(var e=0;e<this.items.length&&!1!==t(this.items[e],e,this);e++);return this},/*
	**	Executes a method call with the specified parameters on each of the items in the collection, if false is returned by the
	**	item's method this function will exit immediately.
	*/forEachCall:function(t,...e){if(this.isEmpty())return this;for(var n=0;n<this.items.length&&!1!==this.items[n][t](...e);n++);return this},/*
	**	Exactly the same as forEach but in reverse order.
	*/forEachRev:function(t){if(this.isEmpty())return this;for(var e=this.items.length-1;e>=0&&!1!==t(this.items[e],e,this);e--);return this},/*
	**	Exactly the same as forEachCall but in reverse order.
	*/forEachRevCall:function(t,...e){if(this.isEmpty())return this;for(var n=this.items.length-1;n>=0&&!1!==this.items[n][t](...e);n--);return this},/*
	**	Handler for the beforeItemAdded event. If returns false the item will not be added.
	*/onBeforeItemAdded:function(t){return!0},/*
	**	Handler for the itemAdded event.
	*/onItemAdded:function(t){},/*
	**	Handler for the itemRemoved event.
	*/onItemRemoved:function(t){}}),$fMUO1=parcelRequire("fMUO1");/**
**	Templating module. The template formats available are shown below, note that the sym-open and sym-close symbols are by
**	default the square brackets, however those can be modified since are just parameters.
**
**	HTML Escaped Output:			[data.value]					Escapes HTML characters from the output.
**	Raw Output:						[!data.value]					Does not escape HTML characters from the output (used to output direct HTML).
**	Double-Quoted Escaped Output:	[data.value]					Escapes HTML characters and surrounds with double quotes.
**	Immediate Reparse:				[<....] [@....] "..." '...'		Reparses the contents as if parseTemplate() was called again.
**	Immediate Output:				[:...]							Takes the contents and outputs exactly as-is without format and optionally surrounded by the
**																	sym-open and sym-close symbols when the first character is not '<', sym_open or space.
**	Filtered Output:				[functionName ... <expr> ...]	Runs a function call, 'expr' can be any of the allowed formats shown here (nested if desired),
**																	functionName should map to one of the available expression functions registered in the
**																	Rinn.Template.functions map, each of which have their own parameters.
*/let $d261ccdafdfe12a9$var$Template={strict:!1,/**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method.
	**
	**	>> array parseTemplate (string template, char sym_open, char sym_close, bool is_tpl=false);
	*/parseTemplate:function(t,e,n,s=!1,r=1){let a="string",o=null,l=0,h=0,u="",c=[],d=c,f=!1;function p(t){if("object"==typeof t){if(t instanceof Array)for(let e=0;e<t.length;e++)p(t[e]);else t.data=p(t.data);return t}for(let e=0;e<t.length;e++)if("\\"==t[e]){let n=t[e+1];switch(n){case"n":n="\n";break;case"r":n="\r";break;case"f":n="\f";break;case"v":n="\v";break;case"t":n="	";break;case"s":n="s";break;case'"':n='"';break;case"'":n="'"}t=t.substr(0,e)+n+t.substr(e+2)}return t}function m(t,s){if("template"==t?s=$d261ccdafdfe12a9$var$Template.parseTemplate(s,e,n,!0,0):"parse"==t?(s=$d261ccdafdfe12a9$var$Template.parseTemplate(s,e,n,!1,0),t="base-string","array"==(0,$fMUO1.default).typeOf(s)&&(t=s[0].type,s=s[0].data)):"parse-trim-merge"==t?s=$d261ccdafdfe12a9$var$Template.parseTemplate(s.trim().split("\n").map(t=>t.trim()).join("\n"),e,n,!1,0):"parse-merge"==t?s=$d261ccdafdfe12a9$var$Template.parseTemplate(s,e,n,!1,0):"parse-merge-alt"==t&&(s=$d261ccdafdfe12a9$var$Template.parseTemplate(s,"{","}",!1,0)),"parse-merge"==t||"parse-merge-alt"==t||"parse-trim-merge"==t)for(let t=0;t<s.length;t++)c.push(s[t]);else c.push({type:t,data:s});f&&(d.push(c=[]),f=!1)}!0===s&&(t=t.trim(),a="identifier",l=10,d.push(c=[])),t+="\x00";for(let s=0;s<t.length;s++){if("\\"==t[s]){u+="\\"+t[++s];continue}switch(l){case 0:"\x00"==t[s]?o="string":t[s]==e&&"<"==t[s+1]?(l=1,h=1,o="string",a="parse-merge"):t[s]==e&&"@"==t[s+1]?(l=1,h=1,o="string",a="parse-trim-merge",s++):t[s]==e&&":"==t[s+1]?(l=12,h=1,o="string",a="string",s++):t[s]==e?(l=1,h=1,o="string",a="template"):u+=t[s];break;case 1:if("\x00"==t[s])throw Error("Parse error: Unexpected end of template");if(t[s]==n){if(--h<0)throw Error("Parse error: Unmatched "+n);if(0==h){l=0,o=a;break}}else t[s]==e&&h++;u+=t[s];break;case 10:if("\x00"==t[s]){o=a;break}if("."==t[s]){m(a,u),m("access","."),a="identifier",u="";break}if(null!=t[s].match(/[\t\n\r\f\v ]/)){for(o=a,a="identifier",f=!0;null!=t[s].match(/[\t\n\r\f\v ]/);)s++;s--;break}if(t[s]==e&&"<"==t[s+1]){u&&(o=a),l=11,h=1,a="parse-merge";break}if(t[s]==e&&"@"==t[s+1]){u&&(o=a),l=11,h=1,a="parse-trim-merge",s++;break}if('"'==t[s]){u&&(o=a),l=14,h=1,a="parse-merge";break}if("'"==t[s]){u&&(o=a),l=15,h=1,a="parse-merge";break}else if("`"==t[s]){u&&(o=a),l=16,h=1,a="parse-merge-alt";break}else if(t[s]==e&&":"==t[s+1]){u&&(o=a),l=13,h=1,a="string",s++;break}else if(t[s]==e){u&&m(a,u),l=11,h=1,a="parse",u=""+t[s];break}"identifier"!=a&&(m(a,u),u="",a="identifier"),u+=t[s];break;case 11:if("\x00"==t[s])throw Error("Parse error: Unexpected end of template");if(t[s]==n){if(--h<0)throw Error("Parse error: Unmatched "+n);if(0==h&&(l=10,"parse-merge"==a||"parse-merge-alt"==a||"parse-trim-merge"==a))break}else t[s]==e&&h++;u+=t[s];break;case 12:if("\x00"==t[s])throw Error("Parse error: Unexpected end of template");if(t[s]==n){if(--h<0)throw Error("Parse error: Unmatched "+n);if(0==h){0==u.length||"<"==u[0]||"["==u[0]||" "==u[0]||(u=e+u+n),l=0,o=a;break}}else t[s]==e&&h++;u+=t[s];break;case 13:if("\x00"==t[s])throw Error("Parse error: Unexpected end of template");if(t[s]==n){if(--h<0)throw Error("Parse error: Unmatched "+n);if(0==h){"<"==u[0]||"["==u[0]||" "==u[0]||(u=e+u+n),l=10;break}}else t[s]==e&&h++;u+=t[s];break;case 14:if("\x00"==t[s])throw Error("Parse error: Unexpected end of template");if('"'==t[s]){if(--h<0)throw Error('Parse error: Unmatched "');if(0==h&&(l=10,"parse-merge"==a||"parse-merge-alt"==a||"parse-trim-merge"==a))break}u+=t[s];break;case 15:if("\x00"==t[s])throw Error("Parse error: Unexpected end of template");if("'"==t[s]){if(--h<0)throw Error("Parse error: Unmatched '");if(0==h&&(l=10,"parse-merge"==a||"parse-merge-alt"==a||"parse-trim-merge"==a))break}u+=t[s];break;case 16:if("\x00"==t[s])throw Error("Parse error: Unexpected end of template");if("`"==t[s]){if(--h<0)throw Error("Parse error: Unmatched `");if(0==h&&(l=10,"parse-merge"==a||"parse-merge-alt"==a||"parse-trim-merge"==a))break}u+=t[s]}o&&(m(o,u),o=u="")}if(!s){let t=0;for(;t<d.length;)if("string"==d[t].type&&""==d[t].data)d.splice(t,1);else break;for(t=d.length-1;t>0;)if("string"==d[t].type&&""==d[t].data)d.splice(t--,1);else break;0==d.length&&d.push({type:"string",data:""})}return r&&p(d),d},/**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method. This
	**	version assumes the sym_open and sym_close chars are [ and ] respectively.
	**
	**	>> array parse (string template);
	*/parse:function(t){return this.parseTemplate(t.trim(),"[","]",!1)},/**
	**	Removes all static parts from a parsed template.
	**
	**	>> array clean (array parts);
	*/clean:function(t){for(let e=0;e<t.length;e++)"template"!=t[e].type&&(t.splice(e,1),e--);return t},/**
	**	Expands a template using the given data object, ret can be set to 'text' or 'obj' allowing to expand the template as
	**	a string (text) or an array of objects (obj) respectively. If none provided it will be expanded as text.
	**
	**	>> string/array expand (array parts, object data, string ret='text', string mode='base-string');
	*/expand:function(t,e,n="text",s="base-string"){let r=[];// Expand variable parts.
if("var"==s){let n=!0,s=!1,a=e,o=null,l=!0,h="";for(let r=0;r<t.length&&null!=e;r++)switch(t[r].type){case"identifier":case"string":h+=t[r].data,o=null;break;case"template":h+="object"!=typeof(o=this.expand(t[r].data,a,"arg","template"))?o:"";break;case"base-string":h+=this.expand(t[r].data,a,"arg","base-string"),o=null;break;case"access":if(o&&"object"==typeof o)e=o;else{for(""==h&&(h="this");;)if("!"==h[0])h=h.substr(1),n=!1;else if("$"==h[0])h=h.substr(1),s=!0;else break;if("this"!=h&&null!=e){let t=e;null===(e=h in e?e[h]:null)&&l&&h in $d261ccdafdfe12a9$var$Template.functions&&(e=$d261ccdafdfe12a9$var$Template.functions[h](null,null,t)),l=!1}}h=""}for(;""!=h;)if("!"==h[0])h=h.substr(1),n=!1;else if("$"==h[0])h=h.substr(1),s=!0;else break;if("this"!=h){let n=!1;if(null!=e?h in e?e=e[h]:(n=!0,e=null):n=!0,n&&1==t.length&&!0==$d261ccdafdfe12a9$var$Template.strict)throw Error("Expression function `"+h+"` not found.")}"string"==typeof e&&(n&&(e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")),s&&(e='"'+e+'"')),r.push(e)}// Expand variable parts and returns a reference to it.
if("varref"==n){let n=e,s=null,r=!0,a="";for(let o=0;o<t.length&&null!=e;o++)switch(t[o].type){case"identifier":case"string":a+=t[o].data,s=null;break;case"template":a+="object"!=typeof(s=this.expand(t[o].data,n,"arg","template"))?s:"";break;case"base-string":a+=this.expand(t[o].data,n,"arg","base-string"),s=null;break;case"access":if(s&&"object"==typeof s)e=s;else{for(""==a&&(a="this");;)if("!"==a[0])a=a.substr(1);else if("$"==a[0])a=a.substr(1);else break;if("this"!=a&&null!=e){let t=e;null===(e=a in e?e[a]:null)&&r&&a in $d261ccdafdfe12a9$var$Template.functions&&(e=$d261ccdafdfe12a9$var$Template.functions[a](null,null,t)),r=!1}}a=""}for(;""!=a;)if("!"==a[0])a=a.substr(1);else if("$"==a[0])a=a.substr(1);else break;return"this"!=a?[e,a]:null}// Expand function parts.
if("fn"==s){var a=[];if(a.push($d261ccdafdfe12a9$var$Template.expand(t[0],e,"text","base-string")),"_"+a[0] in $d261ccdafdfe12a9$var$Template.functions&&(a[0]="_"+a[0]),!(a[0]in $d261ccdafdfe12a9$var$Template.functions)){if(!0==$d261ccdafdfe12a9$var$Template.strict)throw Error("Expression function `"+a[0]+"` not found.");return`(Unknown: ${a[0]})`}if("_"==a[0][0])return $d261ccdafdfe12a9$var$Template.functions[a[0]](t,e);for(let n=1;n<t.length;n++)a.push($d261ccdafdfe12a9$var$Template.expand(t[n],e,"arg","base-string"));r.push($d261ccdafdfe12a9$var$Template.functions[a[0]](a,t,e))}// Template mode.
if("template"==s){if(1==t.length){if(1==t[0].length&&"string"==t[0][0].type)return t[0][0].data;if(1==t[0].length&&"identifier"==t[0][0].type){let s=t[0][0].data;if(s in $d261ccdafdfe12a9$var$Template.functions||"_"+s in $d261ccdafdfe12a9$var$Template.functions)return $d261ccdafdfe12a9$var$Template.expand(t,e,n,"fn")}return $d261ccdafdfe12a9$var$Template.expand(t[0],e,n,"var")}return $d261ccdafdfe12a9$var$Template.expand(t,e,n,"fn")}// Expand parts.
if("base-string"==s){let s=-1;for(let a of t){let o=null;switch(s++,a.type){case"template":o=$d261ccdafdfe12a9$var$Template.expand(a.data,e,n,"template");break;case"string":case"identifier":o=a.data;break;case"base-string":o=$d261ccdafdfe12a9$var$Template.expand(a.data,e,n,"base-string")}"void"!=n&&("last"!=n||s==t.length-1)&&r.push(o)}}// Return types for direct objects.
if("obj"==n)return r;if("last"==n)return"Rose\\Arry"==typeOf(r)&&(r=r[0]),r;// When the output is not really needed.
if("void"==n)return null;// Return as argument ('object' if only one, or string if more than one), that is, the first item in the result.
if("arg"==n)return"array"==(0,$fMUO1.default).typeOf(r)?1!=r.length?r.join(""):r[0]:r;if("text"==n&&"array"==(0,$fMUO1.default).typeOf(r)){let t=e=>null!=e&&"object"==typeof e?"map"in e?e.map(t).join(""):"join"in e?e.join(""):e.toString():e;r=r.map(t).join("")}return r},/**
	**	Parses the given template and returns a function that when called with an object will expand the template.
	**
	**	>> object compile (string template);
	*/compile:function(t){return t=$d261ccdafdfe12a9$var$Template.parse(t),function(e=null,n="text"){return $d261ccdafdfe12a9$var$Template.expand(t,e||{},n)}},/**
	**	Parses and expands the given template immediately.
	**
	**	>> object eval (string template, object data, string mode='text');
	*/eval:function(t,e=null,n="text"){return t=$d261ccdafdfe12a9$var$Template.parse(t),$d261ccdafdfe12a9$var$Template.expand(t,e||{},n)},/**
	**	Expands the template as 'arg' and returns the result.
	**
	**	>> object value (string parts, object data);
	*/value:function(t,e=null){return"array"!=(0,$fMUO1.default).typeOf(t)?t:$d261ccdafdfe12a9$var$Template.expand(t,e||{},"arg")},/**
	**	Registers an expression function.
	**
	**	>> object register (string name, function fn);
	*/register:function(t,e){$d261ccdafdfe12a9$var$Template.functions[t]=e},/**
	**	Calls an expression function.
	**
	**	>> object call (string name, object args, object data);
	*/call:function(t,e,n=null){return t in $d261ccdafdfe12a9$var$Template.functions?$d261ccdafdfe12a9$var$Template.functions[t](e,null,n):null},/**
	**	Returns a map given a 'parts' array having values of the form "name: value" or ":name value".
	**
	**	>> Map getNamedValues (array parts, object data, int i=1, bool expanded=true);
	*/getNamedValues:function(t,e,n=1,s=!0){let r={},a=0;for(;n<t.length;n+=2){let o=$d261ccdafdfe12a9$var$Template.expand(t[n],e,"arg");a||(a=o.startsWith(":")?1:o.endsWith(":")?2:3),1==a?o=o.substr(1):2==a&&(o=o.substr(0,o.length-1)),s?r[o]=$d261ccdafdfe12a9$var$Template.expand(t[n+1],e,"arg"):r[o]=t[n+1]}return r}};/**
**	Template functions, functions that are used to format data. Each function takes three parameters (args, parts and data). By default the function arguments
**	are expanded and passed via 'args' for convenience, however if the function name starts with '_' the 'args' parameter will be skipped and only (parts, data)
**	will be available, each 'part' must be expanded manually by calling Template.expand.
*/$d261ccdafdfe12a9$var$Template.functions={global:function(t){return globalThis},null:function(t){return null},true:function(t){return!0},false:function(t){return!1},len:function(t){return t[1].toString().length},int:function(t){return~~t[1]},str:function(t){return t[1].toString()},float:function(t){return parseFloat(t[1])},chr:function(t){return String.fromCharCode(t[1])},ord:function(t){return t[1].toString().charCodeAt(0)},not:function(t){return!t[1]},neg:function(t){return-t[1]},abs:function(t){return Math.abs(t[1])},and:function(t){for(let e=1;e<t.length;e++)if(!t[e])return!1;return!0},or:function(t){for(let e=1;e<t.length;e++)if(~~t[e])return!0;return!1},eq:function(t){return t[1]==t[2]},ne:function(t){return t[1]!=t[2]},lt:function(t){return t[1]<t[2]},le:function(t){return t[1]<=t[2]},gt:function(t){return t[1]>t[2]},ge:function(t){return t[1]>=t[2]},isnotnull:function(t){return!!t[1]},isnull:function(t){return!t[1]},iszero:function(t){return 0==parseInt(t[1])},"eq?":function(t){return t[1]==t[2]},"ne?":function(t){return t[1]!=t[2]},"lt?":function(t){return t[1]<t[2]},"le?":function(t){return t[1]<=t[2]},"gt?":function(t){return t[1]>t[2]},"ge?":function(t){return t[1]>=t[2]},"notnull?":function(t){return!!t[1]},"null?":function(t){return!t[1]},"zero?":function(t){return 0==parseInt(t[1])},typeof:function(t){return(0,$fMUO1.default).typeOf(t[1])},"*":function(t){let e=t[1];for(let n=2;n<t.length;n++)e*=t[n];return e},"/":function(t){let e=t[1];for(let n=2;n<t.length;n++)e/=t[n];return e},"+":function(t){let e=t[1];for(let n=2;n<t.length;n++)e-=-t[n];return e},"-":function(t){let e=t[1];for(let n=2;n<t.length;n++)e-=t[n];return e},mul:function(t){let e=t[1];for(let n=2;n<t.length;n++)e*=t[n];return e},div:function(t){let e=t[1];for(let n=2;n<t.length;n++)e/=t[n];return e},sum:function(t){let e=t[1];for(let n=2;n<t.length;n++)e-=-t[n];return e},sub:function(t){let e=t[1];for(let n=2;n<t.length;n++)e-=t[n];return e},mod:function(t){let e=t[1];for(let n=2;n<t.length;n++)e%=t[n];return e},pow:function(t){let e=t[1];for(let n=2;n<t.length;n++)e=Math.pow(e,t[n]);return e},/**
	**	Returns the JSON representation of the expression.
	**
	**	dump <expr>
	*/dump:function(t){return JSON.stringify(t[1])},/**
	**	Sets one or more variables in the data context.
	**
	**	set <var-name> <expr> [<var-name> <expr>]*
	*/_set:function(t,e){for(let n=1;n+1<t.length;n+=2){let s=$d261ccdafdfe12a9$var$Template.value(t[n+1],e);if(t[n].length>1){let r=$d261ccdafdfe12a9$var$Template.expand(t[n],e,"varref");null!=r&&(r[0][r[1]]=s)}else e[$d261ccdafdfe12a9$var$Template.value(t[n],e)]=s}return""},/**
	**	Removes one or more variables from the data context.
	**
	**	unset <var-name> [<var-name>]*
	*/_unset:function(t,e){for(let n=1;n<t.length;n++)if(t[n].length>1){let s=$d261ccdafdfe12a9$var$Template.expand(t[n],e,"varref");null!=s&&delete s[0][s[1]]}else delete e[$d261ccdafdfe12a9$var$Template.value(t[n],e)];return null},/**
	**	Returns the expression without white-space on the left or right. The expression can be a string or an array.
	**
	**	trim <expr>
	*/trim:function(t){return t[1]?"object"==typeof t[1]?t[1].map(t=>t.trim()):t[1].trim():""},/**
	**	Returns the expression in uppercase. The expression can be a string or an array.
	**
	**	upper <expr>
	*/upper:function(t){return t[1]?"object"==typeof t[1]?t[1].map(t=>t.toUpperCase()):t[1].toUpperCase():""},/**
	**	Returns the expression in lower. The expression can be a string or an array.
	**
	**	lower <expr>
	*/lower:function(t){return t[1]?"object"==typeof t[1]?t[1].map(t=>t.toLowerCase()):t[1].toLowerCase():""},/**
	**	Returns a sub-string of the given string.
	**
	**	substr <start> <count> <string>
	**	substr <start> <string>
	*/substr:function(t){let e=t[t.length-1].toString(),n=0,s=null;return 4==t.length?(n=~~t[1],s=~~t[2]):(n=~~t[1],s=null),n<0&&(n+=e.length),s<0&&(s+=e.length),null===s&&(s=e.length-n),e.substr(n,s)},/**
	**	Replaces a matching string with the given replacement string in a given text.
	**
	**	replace <search> <replacement> <text>
	*/replace:function(t){return t[3].split(t[1]).join(t[2])},/**
	**	Converts all new-line chars in the expression to <br/>, the expression can be a string or an array.
	**
	**	nl2br <expr>
	*/nl2br:function(t){return t[1]?"object"==typeof t[1]?t[1].map(t=>t.replace(/\n/g,"<br/>")):t[1].replace(/\n/g,"<br/>"):""},/**
	**	Returns the expression inside an XML tag named 'tag-name', the expression can be a string or an array.
	**
	**	% <tag-name> <expr>
	*/"%":function(t){t.shift();var e=t.shift();let n="";for(let s=0;s<t.length;s++)if("array"==(0,$fMUO1.default).typeOf(t[s])){n+=`<${e}>`;for(let e=0;e<t[s].length;e++)n+=t[s][e];n+=`</${e}>`}else n+=`<${e}>${t[s]}</${e}>`;return n},/**
	**	Returns the expression inside an XML tag named 'tag-name', attributes are supported.
	**
	**	%% <tag-name> [<attr> <value>]* [<content>]
	*/"%%":function(t){t.shift();var e=t.shift();let n="",s="";for(let e=0;e<t.length;e+=2)e+1<t.length?n+=` ${t[e]}="${t[e+1]}"`:s=t[e];return s?`<${e}${n}>${s}</${e}>`:`<${e}${n}/>`},/**
	**	Joins the given array expression into a string. The provided string-expr will be used as separator.
	**
	**	join <string-expr> <array-expr>
	*/join:function(t){return t[2]&&"array"==(0,$fMUO1.default).typeOf(t[2])?t[2].join(t[1]):""},/**
	**	Splits the given expression by the specified string. Returns an array.
	**
	**	split <string-expr> <expr>
	*/split:function(t){return t[2]&&"string"==typeof t[2]?t[2].split(t[1]):[]},/**
	**	Returns an array with the keys of the given object-expr.
	**
	**	keys <object-expr>
	*/keys:function(t){return t[1]&&"object"==typeof t[1]?Object.keys(t[1]):[]},/**
	**	Returns an array with the values of the given object-expr.
	**
	**	values <object-expr>
	*/values:function(t){return t[1]&&"object"==typeof t[1]?Object.values(t[1]):[]},/**
	**	Constructs a string obtained by concatenating the expanded template for each of the items in the list-expr, the mandatory varname
	**	parameter (namely 'i') indicates the name of the variable that will contain the data of each item as the list-expr is
	**	traversed. Extra variables i# and i## (suffix '#' and '##') are introduced to denote the index/key and numeric index
	**	of the current item respectively, note that the later will always have a numeric value.
	**
	**	each <varname> <list-expr> <template>
	*/_each:function(t,e){let n=$d261ccdafdfe12a9$var$Template.expand(t[1],e,"arg"),s=$d261ccdafdfe12a9$var$Template.expand(t[2],e,"arg"),r="",a=0;if(!s)return r;for(let o in s)e[n]=s[o],e[n+"##"]=a++,e[n+"#"]=o,r+=$d261ccdafdfe12a9$var$Template.expand(t[3],e,"text");return delete e[n],delete e[n+"##"],delete e[n+"#"],r},/**
	**	Expands the given template for each of the items in the list-expr, the mandatory varname parameter (namely 'i') indicates the name of the variable
	**	that will contain the data of each item as the list-expr is traversed. Extra variables i# and i## (suffix '#' and '##') are introduced to denote
	**	the index/key and numeric index of the current item respectively, note that the later will always have a numeric value.
	**
	**	Does not produce any output (returns null).
	**
	**	foreach <varname> <list-expr> <template>
	*/_foreach:function(t,e){let n=$d261ccdafdfe12a9$var$Template.expand(t[1],e,"arg"),s=$d261ccdafdfe12a9$var$Template.expand(t[2],e,"arg"),r=0;if(!s)return null;for(let a in s)e[n]=s[a],e[n+"##"]=r++,e[n+"#"]=a,$d261ccdafdfe12a9$var$Template.expand(t[3],e,"text");return delete e[n],delete e[n+"##"],delete e[n+"#"],null},/**
	**	Returns the valueA if the expression is true otherwise valueB, this is a short version of the 'if' function with the
	**	difference that the result is 'obj' instead of text.
	**
	**	? <expr> <valueA> [<valueB>]
	*/"_?":function(t,e){return $d261ccdafdfe12a9$var$Template.expand(t[1],e,"arg")?$d261ccdafdfe12a9$var$Template.expand(t[2],e,"arg"):t.length>3?$d261ccdafdfe12a9$var$Template.expand(t[3],e,"arg"):""},/**
	**	Returns the valueA if it is not null (or empty or zero), otherwise returns valueB.
	**
	**	?? <valueA> <valueB>
	*/"_??":function(t,e){return $d261ccdafdfe12a9$var$Template.expand(t[1],e,"arg")||$d261ccdafdfe12a9$var$Template.expand(t[2],e,"arg")},/**
	**	Returns the value if the expression is true, supports 'elif' and 'else' as well. The result of this function is always text.
	**
	**	if <expr> <value> [elif <expr> <value>] [else <value>]
	*/_if:function(t,e){for(let n=0;n<t.length;n+=3){if("else"==$d261ccdafdfe12a9$var$Template.expand(t[n],e,"arg"))return $d261ccdafdfe12a9$var$Template.expand(t[n+1],e,"text");if($d261ccdafdfe12a9$var$Template.expand(t[n+1],e,"arg"))return $d261ccdafdfe12a9$var$Template.expand(t[n+2],e,"text")}return""},/**
	**	Loads the expression value and attempts to match one case.
	**
	**	switch <expr> <case1> <value1> ... <caseN> <valueN> default <defvalue> 
	*/_switch:function(t,e){let n=$d261ccdafdfe12a9$var$Template.expand(t[1],e,"arg");for(let s=2;s<t.length;s+=2){let r=$d261ccdafdfe12a9$var$Template.expand(t[s],e,"arg");if(r==n||"default"==r)return $d261ccdafdfe12a9$var$Template.expand(t[s+1],e,"text")}return""},/**
	**	Exits the current inner most loop.
	**
	**	break
	*/_break:function(t,e){throw Error("EXC_BREAK")},/**
	**	Skips execution and continues the next cycle of the current inner most loop.
	**
	**	continue
	*/_continue:function(t,e){throw Error("EXC_CONTINUE")},/**
	**	Constructs an array with the results of repeating the specified template for a number of times.
	**
	**	repeat <varname:i> [from <number>] [to <number>] [count <number>] [step <number>] <template>
	*/_repeat:function(t,e){if(t.length<3||(1&t.length)!=1)return"(`repeat`: Wrong number of parameters)";let n=$d261ccdafdfe12a9$var$Template.value(t[1],e),s=null,r=0,a=null,o=null;for(let n=2;n<t.length-1;n+=2)switch($d261ccdafdfe12a9$var$Template.value(t[n],e).toLowerCase()){case"from":r=parseFloat($d261ccdafdfe12a9$var$Template.value(t[n+1],e));break;case"to":a=parseFloat($d261ccdafdfe12a9$var$Template.value(t[n+1],e));break;case"count":s=parseFloat($d261ccdafdfe12a9$var$Template.value(t[n+1],e));break;case"step":o=parseFloat($d261ccdafdfe12a9$var$Template.value(t[n+1],e))}let l=t[t.length-1],h=[];if(null!==a){if(null===o&&(o=r>a?-1:1),o<0)for(let t=r;t>=a;t+=o)try{e[n]=t,h.push($d261ccdafdfe12a9$var$Template.value(l,e))}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}else for(let t=r;t<=a;t+=o)try{e[n]=t,h.push($d261ccdafdfe12a9$var$Template.value(l,e))}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}else if(null!==s){null===o&&(o=1);for(let t=r;s>0;s--,t+=o)try{e[n]=t,h.push($d261ccdafdfe12a9$var$Template.value(l,e))}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}else{null===o&&(o=1);for(let t=r;;t+=o)try{e[n]=t,h.push($d261ccdafdfe12a9$var$Template.value(l,e))}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}return delete e[n],h},/**
	**	Repeats the specified template for a number of times.
	**
	**	for <varname:i> [from <number>] [to <number>] [count <number>] [step <number>] <template>
	*/_for:function(t,e){if(t.length<3||(1&t.length)!=1)return"(`for`: Wrong number of parameters)";let n=$d261ccdafdfe12a9$var$Template.value(t[1],e),s=null,r=0;to=null;let a=null;for(let n=2;n<t.length-1;n+=2)switch((value=$d261ccdafdfe12a9$var$Template.value(t[n],e)).toLowerCase()){case"from":r=parseFloat($d261ccdafdfe12a9$var$Template.value(t[n+1],e));break;case"to":to=parseFloat($d261ccdafdfe12a9$var$Template.value(t[n+1],e));break;case"count":s=parseFloat($d261ccdafdfe12a9$var$Template.value(t[n+1],e));break;case"step":a=parseFloat($d261ccdafdfe12a9$var$Template.value(t[n+1],e))}let o=t[t.length-1];if(null!==to){if(null===a&&(a=r>to?-1:1),a<0)for(let t=r;t>=to;t+=a)try{e[n]=t,$d261ccdafdfe12a9$var$Template.value(o,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}else for(let t=r;t<=to;t+=a)try{e[n]=t,$d261ccdafdfe12a9$var$Template.value(o,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}else if(null!==s){null===a&&(a=1);for(let t=r;s>0;s--,t+=a)try{e[n]=t,$d261ccdafdfe12a9$var$Template.value(o,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}else{null===a&&(a=1);for(let t=r;;t+=a)try{e[n]=t,$d261ccdafdfe12a9$var$Template.value(o,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}return delete e[n],null},/**
	**	Repeats the specified template infinitely until a "break" is found.
	**
	**	loop <template>
	*/_loop:function(t,e){if(t.length<2)return"(`loop`: Wrong number of parameters)";let n=t[1];for(;;)try{$d261ccdafdfe12a9$var$Template.value(n,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}return null},/**
	**	Writes the specified arguments to the console.
	**
	**	echo <expr> [<expr>...]
	*/_echo:function(t,e){let n="";for(let s=1;s<t.length;s++)n+=$d261ccdafdfe12a9$var$Template.expand(t[s],e,"arg");return console.log(n),""},/**
	**	Constructs a list from the given arguments and returns it.
	**
	**	# <expr> [<expr>...]
	*/"_#":function(t,e){let n=[];for(let s=1;s<t.length;s++)n.push($d261ccdafdfe12a9$var$Template.expand(t[s],e,"arg"));return n},/**
	**	Constructs a non-expanded list from the given arguments and returns it.
	**
	**	## <expr> [<expr>...]
	*/"_##":function(t,e){let n=[];for(let e=1;e<t.length;e++)n.push(t[e]);return n},/**
	**	Constructs an associative array (dictionary) and returns it.
	**
	**	& <name>: <expr> [<name>: <expr>...]
	**	& :<name> <expr> [:<name> <expr>...]
	*/"_&":function(t,e){return $d261ccdafdfe12a9$var$Template.getNamedValues(t,e,1,!0)},/**
	**	Constructs a non-expanded associative array (dictionary) and returns it.
	**
	**	&& <name>: <expr> [<name>: <expr>...]
	**	&& :<name> <expr> [:<name> <expr>...]
	*/"_&&":function(t,e){return $d261ccdafdfe12a9$var$Template.getNamedValues(t,e,1,!1)},/**
	**	Returns true if the specified map contains all the specified keys. If it fails the global variable `err` will contain an error message.
	**
	**	contains <expr> <name> [<name>...]
	*/contains:function(t,e,n){let s=t[1];if("object"!=typeof s)return n.err="Argument is not a Map",!1;let r="";for(let e=2;e<t.length;e++)t[e]in s||(r+=", "+t[e]);return""==r||(n.err=r.substr(1),!1)},/**
	**	Returns true if the specified map has the specified key. Returns boolean.
	**
	**	has <name> <expr>
	*/has:function(t,e,n){let s=t[2];return"object"==(0,$fMUO1.default).typeOf(s)&&t[1]in s},/**
	**	Returns a new array/map contaning the transformed values of the array/map (evaluating the template). And just as in 'each', the i# and i## variables be available.
	**
	**	map <varname> <list-expr> <template>
	*/_map:function(t,e){let n=$d261ccdafdfe12a9$var$Template.expand(t[1],e,"arg"),s=$d261ccdafdfe12a9$var$Template.expand(t[2],e,"arg");if(!s)return s;let r="array"==(0,$fMUO1.default).typeOf(s),a=r?[]:{},o=0;for(let l in s)e[n]=s[l],e[n+"##"]=o++,e[n+"#"]=l,r?a.push($d261ccdafdfe12a9$var$Template.expand(t[3],e,"arg")):a[l]=$d261ccdafdfe12a9$var$Template.expand(t[3],e,"arg");return delete e[n],delete e[n+"##"],delete e[n+"#"],a},/**
	**	Returns a new array/map contaning the elements where the template evaluates to non-zero. Just as in 'each', the i# and i## variables be available.
	**
	**	filter <varname> <list-expr> <template>
	*/_filter:function(t,e){let n=$d261ccdafdfe12a9$var$Template.expand(t[1],e,"arg"),s=$d261ccdafdfe12a9$var$Template.expand(t[2],e,"arg");if(!s)return s;let r="array"==(0,$fMUO1.default).typeOf(s),a=r?[]:{},o=0;for(let l in s)e[n]=s[l],e[n+"##"]=o++,e[n+"#"]=l,~~$d261ccdafdfe12a9$var$Template.expand(t[3],e,"arg")&&(r?a.push(s[l]):a[l]=s[l]);return delete e[n],delete e[n+"##"],delete e[n+"#"],a},/**
	**	Expands the specified template string with the given data. The sym_open and sym_close will be '{' and '}' respectively.
	**	If no data is provided, current data parameter will be used.
	**
	**	expand <template> <data>
	*/expand:function(t,e,n){return $d261ccdafdfe12a9$var$Template.expand($d261ccdafdfe12a9$var$Template.parseTemplate(t[1],"{","}"),3==t.length?t[2]:n)},/**
	**	Calls a function described by the given parameter.
	**
	**	call <function> <args...>
	*/_call:function(t,e){let n=$d261ccdafdfe12a9$var$Template.expand(t[1],e,"varref");if(!n||"function"!=typeof n[0][n[1]])throw Error("Expression is not a function: "+$d261ccdafdfe12a9$var$Template.expand(t[1],e,"obj").map(t=>null==t?".":t).join(""));let s=[];for(let n=2;n<t.length;n++)s.push($d261ccdafdfe12a9$var$Template.value(t[n],e));return n[0][n[1]](...s)}};var $d261ccdafdfe12a9$export$2e2bcd8739ae039=$d261ccdafdfe12a9$var$Template;let $9ffb7151b8b2d038$export$eefcfe56efaaa57d=$fMUO1.default,$9ffb7151b8b2d038$export$4c85e640eb41c31b=$2394d727dfd6a212$export$2e2bcd8739ae039,$9ffb7151b8b2d038$export$d61e24a684f9e51=$13eda5a5dec8010f$export$2e2bcd8739ae039,$9ffb7151b8b2d038$export$ec8b666c5fe2c75a=$c43adaf9cb6d6dd3$export$2e2bcd8739ae039,$9ffb7151b8b2d038$export$a1edc412be3e1841=$4dfa0622e14576ea$export$2e2bcd8739ae039,$9ffb7151b8b2d038$export$59eced47f477f85a=$0890bed8a163f087$export$2e2bcd8739ae039,$9ffb7151b8b2d038$export$19342e026b58ebb7=$2710795e2347ba2a$export$2e2bcd8739ae039,$9ffb7151b8b2d038$export$3a9581c9ade29768=$32651d5f38a8a64c$export$2e2bcd8739ae039,$9ffb7151b8b2d038$export$fb8073518f34e6ec=$2bcce06113365814$export$2e2bcd8739ae039,$9ffb7151b8b2d038$export$14416b8d99d47caa=$d261ccdafdfe12a9$export$2e2bcd8739ae039;//# sourceMappingURL=rinn.m.js.map
}),parcelRegister("8AUAG",function(t,e){!function(n){// Detect free variables `exports`.
var s=e,r=t&&t.exports==s&&t,a="object"==typeof $parcel$global&&$parcel$global;(a.global===a||a.window===a)&&(n=a);/*--------------------------------------------------------------------------*/var o=function(t){this.message=t};o.prototype=Error(),o.prototype.name="InvalidCharacterError";var l=function(t){// Note: the error messages used throughout this file match those used by
// the native `atob`/`btoa` implementation in Chromium.
throw new o(t)},h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",u=/[\t\n\f\r ]/g,c={encode:function(t){t=String(t),/[^\0-\xFF]/.test(t)&&// matched, and the input is supposed to only contain ASCII anyway.
l("The string to be encoded contains characters outside of the Latin1 range.");for(var e,n,s,r=t.length%3,a="",o=-1,u=t.length-r;++o<u;)s=// Read three bytes, i.e. 24 bits.
(e=t.charCodeAt(o)<<16)+(n=t.charCodeAt(++o)<<8)+t.charCodeAt(++o),// Turn the 24 bits into four chunks of 6 bits each, and append the
// matching character for each of them to the output.
a+=h.charAt(s>>18&63)+h.charAt(s>>12&63)+h.charAt(s>>6&63)+h.charAt(63&s);return 2==r?(s=(e=t.charCodeAt(o)<<8)+(n=t.charCodeAt(++o)),a+=h.charAt(s>>10)+h.charAt(s>>4&63)+h.charAt(s<<2&63)+"="):1==r&&(s=t.charCodeAt(o),a+=h.charAt(s>>2)+h.charAt(s<<4&63)+"=="),a},decode:function(t){var e,n,s=(t=String(t).replace(u,"")).length;s%4==0&&(s=(t=t.replace(/==?$/,"")).length),(s%4==1||// http://whatwg.org/C#alphanumeric-ascii-characters
/[^+a-zA-Z0-9/]/.test(t))&&l("Invalid character: the string to be decoded is not correctly encoded.");for(var r=0,a="",o=-1;++o<s;)n=h.indexOf(t.charAt(o)),e=r%4?64*e+n:n,r++%4&&(a+=String.fromCharCode(255&e>>(-2*r&6)));return a},version:"1.0.0"};// Some AMD build optimizers, like r.js, check for specific condition patterns
// like the following:
if("function"==typeof define&&"object"==typeof define.amd&&define.amd)define(function(){return c});else if(s&&!s.nodeType){if(r)r.exports=c;else for(var d in c)c.hasOwnProperty(d)&&(s[d]=c[d])}else n.base64=c}(this)});var $jNRwG=parcelRequire("jNRwG");/*
**	The Router is a special module that detects local URL changes (when a hash-change occurs) and
**	forwards events to the appropriate handlers.
*/let $a60d7ab082450164$var$_Router={Route:(0,$jNRwG.EventDispatcher).extend({/*
		**	Regular expression for the route. This is generated from a simpler expression provided
		**	in the constructor.
		*/routeRegex:null,/*
		**	Original route string value.
		*/value:null,/*
		**	Map with the indices and the names of each paremeter obtained from the route expression.
		*/params:null,/*
		**	Arguments obtained from the current route (uses `params` to determine name of arguments).
		*/args:null,/*
		**	Arguments string obtained from the last route dispatch. Used to check if the arguments changed.
		*/s_args:null,/*
		**	Indicates if the route is active because of a past positive dispatch.
		*/active:!1,/*
		**	Indicates if the params have changed since last event. Transition from inactive to active route will always set this value to true.
		*/changed:!1,/*
		**	Constructor of the route, the specified argument is a route expression.
		**
		**	>> void __ctor (string route);
		*/__ctor:function(t){this._super.EventDispatcher.__ctor(),this._compileRoute(this.value=t)},/*
		**	Transforms the specified route expression into a regular expression and a set of parameter
		**	names and stores them in the 'param' array.
		**
		**	>> void _compileRoute (string route);
		*/_compileRoute:function(t){for(this.params=[],t=t.replace(/\/\*\//g,"/.+/");;){var e=/:([!@A-Za-z0-9_-]+)/.exec(t);if(!e)break;t=t.replace(e[0],"([^/]+)"),this.params.push(e[1])}this.routeRegex="^"+t.replace(/##/g,"")},/*
		**	Adds a handler to the route dispatcher. The handler can be removed later using removeHandler and
		**	specifying the same parameters. If unrouted boolean is specified the event to listen to will be
		**	the unrouted event (when the route changes and the route is not activated).
		**
		**	void addHandler (handler: function, unrouted: bool, context:object=null);
		*/addHandler:function(t,e=!1,n=null){this.addEventListener((!0===e?"un":"")+"routed",t,n)},/*
		**	Removes a handler from the route dispatcher.
		**
		**	void removeHandler (handler: function, unrouted: bool, context: object=null);
		*/removeHandler:function(t,e=!1,n=null){this.removeEventListener((!0===e?"un":"")+"routed",t,n)},/*
		**	Verifies if the specified route matches the internal route and if so dispatches a (depends on doUnroute parameter) "routed" or "unrouted" event with the
		**	parameters obtained from the location to all attached handlers.
		**
		**	void dispatch (route:string, doUnroute:bool);
		*/dispatch:function(t){var e=t.match(this.routeRegex);if(!e){this.s_args=null,this.active&&this.dispatchEvent("unrouted",{route:this}),this.active=!1;return}for(var n={route:this},s="",r=0;r<this.params.length;r++)n[this.params[r]]=e[r+1],s+="_"+e[r+1];this.changed=s!=this.s_args,this.s_args=s,this.dispatchEvent("routed",this.args=n),this.active=!0}}),/*
	**	Map with route objects. The key of the map is the route and the value a handler.
	*/routes:{},/*
	**	Sorted list of routes. Smaller routes are processed first than larger ones. This array stores
	**	only the keys to the Router.routes map.
	*/sortedRoutes:[],/*
	**	Indicates the number of times the onLocationChanged handler should ignore the hash change event.
	*/ignoreHashChangeEvent:0,/*
	**	Current relative location (everything after the location hash symbol).
	*/location:"",/*
	**	Current relative location as an array of elements (obtained by splitting the location by slash).
	*/args:[],/*
	**	Initializes the router module. Ensure to call `refresh` once to force a hashchange when the page loads.
	*/init:function(){!this.alreadyAttached&&(this.alreadyAttached=!0,"onhashchange"in globalThis&&(globalThis.onhashchange=this.onLocationChanged.bind(this)))},/*
	**	Refreshes the current route by forcing a hashchange event.
	*/refresh:function(){this.onLocationChanged()},/*
	**	Changes the current location and optionally prevents a trigger of the hashchange event.
	*/setRoute:function(t,e){var n=this.realLocation(t);n!=this.location&&(e&&this.ignoreHashChangeEvent++,globalThis.location.hash=n)},/*
	**	Adds the specified route to the routing map. When the specified route is detected, the `onRoute` handler will be called, and then
	**	when the route exits `onUnroute` will be called.
	*/addRoute:function(t,e,n=null){return this.routes[t]||(this.routes[t]=new this.Route(t),this.sortedRoutes.push(t),this.sortedRoutes.sort((t,e)=>this.routes[t].routeRegex.length-this.routes[e].routeRegex.length)),null!==n?(this.routes[t].addHandler(e,!1),this.routes[t].addHandler(n,!0)):this.routes[t].addHandler(e,!1),this.routes[t]},/*
	**	Returns the Route object for the specified route.
	*/getRoute:function(t){return this.routes[t]||(this.routes[t]=new this.Route(t),this.sortedRoutes.push(t),this.sortedRoutes.sort((t,e)=>this.routes[t].routeRegex.length-this.routes[e].routeRegex.length)),this.routes[t]},/*
	**	Adds the specified routes to the routing map. The routes map should contain the route expression
	**	in the key of the map and a handler function in the value.
	*/addRoutes:function(t){for(var e in t)this.routes[e]||(this.routes[e]=new this.Route(e),this.sortedRoutes.push(e)),this.routes[e].addHandler(t[e],!1);this.sortedRoutes.sort((t,e)=>this.routes[t].routeRegex.length-this.routes[e].routeRegex.length)},/*
	**	Removes the specified route from the routing map.
	*/removeRoute:function(t,e,n){this.routes[t]&&(void 0!==n?(this.routes[t].removeHandler(e,!1),this.routes[t].removeHandler(n,!0)):this.routes[t].removeHandler(e))},/*
	**	Removes the specified routes from the routing map. The routes map should contain the route
	**	expression in the key of the map and a handler function in the value.
	*/removeRoutes:function(t){for(var e in t)this.routes[e]&&this.routes[e].removeHandler(t[e])},/*
	**	Given a formatted location and a previous one it will return the correct real location.
	*/realLocation:function(t,e){e||(e=this.location),e||(e=" ");for(var n,s=0,r=0,a=0,o="";-1!=s&&r<t.length&&a<e.length;)switch(s){case 0:if("*"==t.substr(r++,1)){s=1;break}if(t.substr(r-1,1)!=e.substr(a++,1)){o+=t.substr(r-1),s=-1;break}o+=e.substr(a-1,1);break;case 1:if("*"==t.substr(r,1)){s=3,r++;break}s=2;break;case 2:if(-1==(n=e.indexOf(t.substr(r,1),a))){o+=e.substr(a)+t.substr(r),s=-1;break}o+=e.substr(a,n-a),s=0,a=n;break;case 3:if(-1==(n=e.lastIndexOf(t.substr(r,1)))){o+=t.substr(r),s=-1;break}o+=e.substr(a,n-a),s=0,a=n}return -1!=s&&(o+=t.substr(r)),o.trim()},/*
	**	Event handler called when the location hash changes.
	*/onLocationChanged:function(){var t=location.hash.substr(1),e=this.realLocation(t);if(t!=e){globalThis.location.replace("#"+e);return}if(this.location=t,this.args=this.location.split("/"),this.ignoreHashChangeEvent>0){this.ignoreHashChangeEvent--;return}for(var n=0;n<this.sortedRoutes.length;n++)this.routes[this.sortedRoutes[n]].dispatch(this.location)},/*
	**	Navigates to the given hash-based URL.
	*/navigate:function(t,e=!1){if(t=this.realLocation(t),globalThis.location.hash=="#"+t){this.refresh();return}e?globalThis.location.replace("#"+t):globalThis.location.hash=t}};$a60d7ab082450164$var$_Router.init();var $a60d7ab082450164$export$2e2bcd8739ae039=$a60d7ab082450164$var$_Router,$jNRwG=parcelRequire("jNRwG");/**
 * Map containing the original prototypes for all registered elements.
 */let $a5c21812244207c8$var$elementPrototypes={},$a5c21812244207c8$var$elementClasses={},$a5c21812244207c8$var$Element={/**
	 * Internal element ID. Added as namespace to model events. Ensures that certain model events are run locally only, not affecting other event handlers.
	 */eid:null,/**
	 * Indicates if the element is a root element, that is, the target element to attach child elements having `data-ref` attribute.
	 */isRoot:!0,/**
	 * Root element to which this element is attached (when applicable).
	 */root:null,/**
	 * Indicates ready-state of the element. Possible values are: 0: "Not ready", 1: "Children Initialized", and 2: "Parent Ready".
	 */isReady:0,readyReenter:0,readyLocked:0,/**
	 * Model type (class) for the element's model.
	 */modelt:$jNRwG.Model,/**
	 * Data model related to the element.
	 */model:null,/**
	 * Contents of the element. When set, the innerHTML will be set to this value.
	 */contents:null,/**
	 * 	Events map.
	 */events:{"mousedown [data-long-press]":function(t){if(t.continuePropagation=!0,t.source._long_press)return;let e=t.source;e._long_press=setTimeout(()=>{let t=e._pos_fx-e._pos_sx,n=e._pos_fy-e._pos_sy;e._long_press=null,5>Math.sqrt(t*t+n*n)&&(e._long_press=!1,this.dispatchOn(e,"long-press"))},500),e._pos_sx=t.clientX,e._pos_sy=t.clientY,e._pos_fx=t.clientX,e._pos_fy=t.clientY},"mousemove [data-long-press]":function(t){t.continuePropagation=!0,t.source._long_press&&(t.source._pos_fx=t.clientX,t.source._pos_fy=t.clientY)},"touchstart [data-long-press]":function(t){if(t.continuePropagation=!0,t.source._long_press)return;let e=t.source;e._long_press=setTimeout(()=>{let t=e._pos_fx-e._pos_sx,n=e._pos_fy-e._pos_sy;e._long_press=null,5>Math.sqrt(t*t+n*n)&&(e._long_press=!1,this.dispatchOn(e,"long-press"))},500),e._pos_sx=t.touches[0].clientX,e._pos_sy=t.touches[0].clientY,e._pos_fx=t.touches[0].clientX,e._pos_fy=t.touches[0].clientY},"touchmove [data-long-press]":function(t){t.continuePropagation=!0,t.source._long_press&&(t.source._pos_fx=t.touches[0].clientX,t.source._pos_fy=t.touches[0].clientY)},"mouseup [data-long-press]":function(t){!1!==t.source._long_press&&(t.source._long_press&&(clearTimeout(t.source._long_press),t.source._long_press=null),t.continuePropagation=!0)},"touchend [data-long-press]":function(t){!1!==t.source._long_press&&(t.source._long_press&&(clearTimeout(t.source._long_press),t.source._long_press=null),t.continuePropagation=!0)},"click [data-action]":function(t){if(!1===t.source._long_press)return;let e=t.source.dataset.action.split(" ");e[0]in this?this[e[0]]({...t.params,...t.source.dataset,...e,length:e.length},t):t.continuePropagation=!0},"long-press [data-long-press]":function(t){let e=t.source.dataset.longPress.split(" ");e[0]in this?this[e[0]]({...t.params,...t.source.dataset,...e,length:e.length},t):t.continuePropagation=!0},"keyup(13) input[data-enter]":function(t){let e=t.source.dataset.enter.split(" ");e[0]in this?this[e[0]]({...t.params,...t.source.dataset,...e,length:e.length},t):t.continuePropagation=!0}},/**
	 * Internal routes map, set by `bindRoutes`.
	 */routes:null,/**
	 * 	Element constructor.
	 */__ctor:function(){if(this._list_watch=[],this._list_visible=[],this._list_attr=[],this._list_property=[],"root"in this.dataset&&"false"==this.dataset.root&&(this.isRoot=!1),this.style.display="block",this.eid=Math.random().toString().substr(2),null!=this.model){let t=this.model;this.model=null,this.setModel(t,!1)}Object.keys(this._super).reverse().forEach(t=>{"init"in this._super[t]&&this._super[t].init()}),$a5c21812244207c8$var$Element.debug&&console.log(">> "+this.tagName+" INIT ON "+this.parentElement.tagName),this.init(),this.events&&this.bindEvents(this.events),this.contents&&this.setInnerHTML(this.contents),setTimeout(()=>{"r-dom-probe"!==this.tagName.toLowerCase()?this.appendChild(document.createElement("r-dom-probe")):this.markReady()},0)},/**
	 * 	Initializes the element. Called after construction of the instance.
	 */init:function(){},/**
	 * 	Executed when the children of the element are ready.
	 */ready:function(){},/**
	 * 	Executed after ready and after the root is also ready.
	 */rready:function(){},/**
	 * 	Marks the element as ready.
	 */markReady:function(t=null){if(this.readyLocked++,this.isReady)this.collectWatchers();else{// Set model is `model` property was set in the element.
if(this.isReady=1,"model"in this.dataset){let t=this.getFieldByPath(this.dataset.model);t&&this.setModel(t)}// Run ready methods in class hierarchy.
Object.keys(this._super).reverse().forEach(t=>{"ready"in this._super[t]&&this._super[t].ready()}),$a5c21812244207c8$var$Element.debug&&console.log(">> "+this.tagName+" READY"),this.ready(),this.onready&&this.onready(this),this.collectWatchers()}let e=this.findCustomParent(this);$a5c21812244207c8$var$Element.debug&&console.log(this.tagName+" ROOT IS "+(e?e.tagName:"NULL")),e&&0===e.isReady&&0!=this.isReady&&e.checkReady();let n=!1;if(e&&2===e.isReady&&2!==this.isReady&&(this.getRoot(),this.root&&this.dataset.ref&&($a5c21812244207c8$var$Element.debug&&console.log(this.tagName+" REF AS `"+this.dataset.ref+"` ON "+this.root.tagName),this.root[this.dataset.ref]=this,this.root.onRefAdded(this.dataset.ref,this)),n=!0),e||2===this.isReady||(n=!0),n){if(this.isReady=2,null!==t)for(let e of t)e.checkReady();$a5c21812244207c8$var$Element.debug&&console.log(">> "+this.tagName+" RREADY"),Object.keys(this._super).reverse().forEach(t=>{"rready"in this._super[t]&&this._super[t].rready()}),this.rready(),this.onrootready&&this.onrootready(this)}this.readyLocked--,this.readyReenter&&!this.readyLocked&&(this.readyReenter=!1,this.checkReady()),"r-dom-probe"===this.tagName.toLowerCase()&&this.remove()},/**
	 *	Checks if all children are ready and fires the appropriate function (`ready` and/or `rready`).
	 */checkReady:function(){if(0==this.childNodes.length)return;if(this.readyLocked){this.readyReenter=!0;return}let t=!0,e=[],n=document.evaluate(".//*[contains(name(),'-')]",this,null,XPathResult.ANY_TYPE,null);for($a5c21812244207c8$var$Element.debug&&console.log("# CHECKING "+this.tagName);;){let s=n.iterateNext();if(!s)break;s!==this&&this.findCustomParent(s)===this&&($a5c21812244207c8$var$Element.debug&&console.log("   "+s.tagName+" = "+s.isReady),s.isReady||(t=!1),e.push(s))}t&&this.markReady(e)},/**
	 * 	Returns the value of a field given its path. Starts from `global`, unless the first item in the path is `this`, in which case it will start from the element.
	 */getFieldByPath:function(t){if(!t)return null;if("string"!=typeof t)return t;let e=t.split("."),n=$parcel$global;for(e.length&&"this"==e[0]&&(n=this,e.shift()),e.length&&"root"==e[0]&&(n=this.getRoot(),e.shift());null!=n&&0!=e.length;)n=n[e.shift()];return n},/**
	 * 	Returns the root of the element (that is, the `root` property). If not set it will attempt to find the root first.
	 */getRoot:function(){return this.root?this.root:this.root=this.findRoot()},/**
	 * 	Sets the model of the element and executes the `modelChanged` event handler (unless `update` is set to false).
	 */setModel:function(t,e=!0){return t&&(t=(0,$jNRwG.Rinn).ensureTypeOf(this.modelt,t),this.model!==t&&(null!=this.model&&(this.model.removeEventListener(this.eid+":modelChanged",this.onModelPreChanged,this),this.model.removeEventListener(this.eid+":propertyChanging",this.onModelPropertyChanging,this),this.model.removeEventListener(this.eid+":propertyChanged",this.onModelPropertyPreChanged,this),this.model.removeEventListener(this.eid+":propertyRemoved",this.onModelPropertyRemoved,this)),this.model=t,this.model.addEventListener(this.eid+":modelChanged",this.onModelPreChanged,this),this.model.addEventListener(this.eid+":propertyChanging",this.onModelPropertyChanging,this),this.model.addEventListener(this.eid+":propertyChanged",this.onModelPropertyPreChanged,this),this.model.addEventListener(this.eid+":propertyRemoved",this.onModelPropertyRemoved,this)),!1!==e&&this.model.setNamespace(this.eid).update(!0).setNamespace(null)),this},/**
	 * 	Returns the model of the element. Added for symmetry only, exactly the same as accesing public property `model` of this class.
	 */getModel:function(){return this.model},/**
	 * 	Adds one or more CSS classes (separated by space) to the element.
	 */addClass:function(t){return t&&t.split(" ").forEach(t=>{(t=t.trim())&&("-"==t[0]||"+"==t[0]?this.classList["-"==t[0]?"remove":"add"](t.substr(1)):this.classList.add(t))}),this},/**
	 * 	Removes one or more CSS classes (separated by space) from the element.
	 */removeClass:function(t){return t&&t.split(" ").forEach(t=>{(t=t.trim())&&("-"==t[0]||"+"==t[0]?this.classList["-"==t[0]?"remove":"add"](t.substr(1)):this.classList.remove(t))}),this},/**
	 * 	Sets one or more style properties to the element (separated by semi-colon).
	 */setStyle:function(t){return t&&t.split(";").forEach(t=>{let e=(t=t.trim()).indexOf(":");if(-1==e)return;let n=t.substr(0,e).trim();for(let t=n.indexOf("-");-1!=t;t=n.indexOf("-"))n=n.substr(0,t)+n.substr(t+1,1).toUpperCase()+n.substr(t+2);this.style[n]=t.substr(e+1).trim()}),this},/**
	 * 	Returns the width of the specified element (or of itself it none provided), uses `getBoundingClientRect`.
	 */getWidth:function(t=null){return(t||this).getBoundingClientRect().width},/**
	 * 	Returns the height of the specified element (or of itself it none provided), uses `getBoundingClientRect`.
	 */getHeight:function(t=null){return(t||this).getBoundingClientRect().height},/**
	**	Binds all events in the specified map to the element, the events map can have one of the following forms:
	**
	**		"click .button": "doSomething",		(Delegated Event)
	**		"click .button": function() { },	(Delegated Event)
	**		"myevt &this": "...",				(Self Event)
	**		"myevt": "...",						(Element Event)
	**		"myevt @objName": "...",			(EventDispatcher Event)
	**		"#propname": "...",					(Property Changed Event)
	**		"keyup(10) .input": "..."			(Delegated Event with Parameters)
	**
	**	>> Element bindEvents (object events);
	*/bindEvents:function(t){for(let a in t){let o=t[a];"string"==(0,$jNRwG.Rinn).typeOf(o)&&(o=this[o]),o=o.bind(this);var e=a.indexOf(" "),n=-1==e?a:a.substr(0,e),s=-1==e?"":a.substr(e+1);let l=null;var r=n.indexOf("(");if(-1!=r&&(l=n.substr(r+1,n.length-r-2).split(","),n=n.substr(0,r)),"@"==s[0]){if("@this"!=s){this[s.substr(1)].addEventListener(n,o);continue}s=this}else"&"==s[0]&&(s="&this"!=s?"[data-ref='"+s.substr(1)+"']":this);if("#"==n.substr(0,1)){this.listen("propertyChanged."+n.substr(1),this,o);continue}if(null!=l)switch(n){case"keyup":case"keydown":this.listen(n,s,function(t){if(-1!=(0,$jNRwG.Rinn).indexOf(l,t.keyCode.toString()))return o(t,l);t.continuePropagation=!0});continue}this.listen(n,s,o)}return this},/**
	**	Binds all routes in the specified map to the Router object.
	**
	**		"route-path": "doSomething"						On-Route
	**		"route-path": function (evt, args) { }			On-Route
	**		"!route-path": "doSomething"					On-UnRoute
	**		"!route-path": function (evt, args) { }			On-UnRoute
	**
	**	>> Element bindRoutes ();
	*/bindRoutes:function(){if(this.routes)for(let t in this.routes){let e="!"===t[0]?$a60d7ab082450164$export$2e2bcd8739ae039.getRoute(t.substr(1)):$a60d7ab082450164$export$2e2bcd8739ae039.getRoute(t),n=this.routes[t];"string"===(0,$jNRwG.Rinn).typeOf(n)&&(n=this[n]),"!"===t[0]?e.addHandler(n,!0,this):e.addHandler(n,!1,this)}},/**
	 * Unbinds all routes added by bindRoutes.
	 */unbindRoutes:function(){if(this.routes)for(let t in this.routes){let e="!"===t[0]?$a60d7ab082450164$export$2e2bcd8739ae039.getRoute(t.substr(1)):$a60d7ab082450164$export$2e2bcd8739ae039.getRoute(t),n=this.routes[t];"string"===(0,$jNRwG.Rinn).typeOf(n)&&(n=this[n]),"!"===t[0]?e.removeHandler(n,!0,this):e.removeHandler(n,!1,this)}},/**
	**	Executes the underlying event handler given an event and a selector. Called internally by listen().
	**
	**	>> void _eventHandler (event evt, string selector, function handler);
	*/_eventHandler:function(t,e,n){if(!1!==t.continuePropagation){if(t.continuePropagation=!0,t.source=t.target,e&&e instanceof HTMLElement)t.source===e&&(t.continuePropagation=!1,!0===n.call(this,t,t.detail)&&(t.continuePropagation=!0));else if(e&&"*"!=e){let s=this.querySelectorAll(e);for(;t.source!==this;){if(-1!==(0,$jNRwG.Rinn).indexOf(s,t.source,!0)){t.continuePropagation=!1,!0===n.call(this,t,t.detail)&&(t.continuePropagation=!0);break}t.source=t.source.parentElement}}else t.continuePropagation=!1,!0===n.call(this,t,t.detail)&&(t.continuePropagation=!0);!1===t.continuePropagation&&(t.preventDefault(),t.stopPropagation())}},/**
	**	Listens for an event on elements matching the specified selector, returns an object with a single method `remove` used
	**	to remove the listener when it is no longer needed.
	**
	**	>> object listen (string eventName, string selector, function handler);
	**	>> object listen (string eventName, function handler);
	*/listen:function(t,e,n){let s=!1,r=!1;"function"==(0,$jNRwG.Rinn).typeOf(e)&&(n=e,e=null),"!"==t[t.length-1]&&(t=t.substr(0,t.length-1),s=!0),"!"==t[0]&&(t=t.substr(1),r=!0);let a=null,o=null,l=this;return this.addEventListener(t,a=t=>{!1!==t.continuePropagation&&(t.firstCapture||(t.firstCapture=this,t.firstCaptureCount=0,t.queue=[]),t.firstCapture===this&&t.firstCaptureCount++,!0==s&&t.queue.push([this,e,n]),!0==r&&this._eventHandler(t,e,n))},!0),this.addEventListener(t,o=t=>{if(!1!==t.continuePropagation&&(!0!=s&&!0!=r&&this._eventHandler(t,e,n),t.firstCapture===this&&!1!==t.continuePropagation&&0==--t.firstCaptureCount)){for(;t.queue.length;){let e=t.queue.pop();e[0]._eventHandler(t,e[1],e[2])}t.continuePropagation=!1}},!1),{removed:!1,remove:function(){this.removed||(this.removed=!0,l.removeEventListener(t,a,!0),l.removeEventListener(t,o,!1))}}},/**
	**	Creates an event object for later dispatch.
	*/createEventObject:function(t,e,n){return"click"==t?new MouseEvent(t,{bubbles:n,detail:e}):new CustomEvent(t,{bubbles:n,detail:e})},/**
	**	Dispatches a new event with the specified name and the given arguments.
	*/dispatch:function(t,e=null,n=!0){let s="on"+t.toLowerCase();if(s in this){this[s](e,this);return}this.dispatchEvent(this.createEventObject(t,e,n))},/**
	**	Dispatches a new event on the specified element with the given name and arguments (uses `CustomEvent`).
	*/dispatchOn:function(t,e,n=null,s=!0){t.dispatchEvent(this.createEventObject(e,n,s))},/**
	**	Sets the innerHTML property of the element and runs some post set-content tasks.
	**
	**	>> void setInnerHTML (value);
	*/setInnerHTML:function(t){this.readyLocked++,this.innerHTML=t,this.readyLocked--},/**
	**	Collects all watchers (data-watch, data-visible, data-attr, data-property), that depend on the model, should be invoked when the
    **  structure of the element changed (added/removed children). This is automatically called when the setInnerHTML method is called.
	**
	**	Note that for 3rd party libs that add children to this element (which could probably have a watcher) will possibly result in
	**	duplication of the added elements when compiling the innerHTML template. To prevent this add the 'pseudo' CSS class to any
	**	element that should not be added to the HTML template.
	**
	**	>> void collectWatchers ();
	*/collectWatchers:function(){let t,e=this,n=!1;if(!this.isRoot)return;let s=this._list_watch.length,r=this._list_visible.length,a=this._list_attr.length,o=this._list_property.length;/* *** */t=this.querySelectorAll("[data-watch]");for(let e=0;e<t.length;e++){for(let n of t[e].querySelectorAll(".pseudo"))n.remove();t[e]._template=(0,$jNRwG.Template).compile(t[e].innerHTML),t[e]._watch=RegExp("^("+t[e].dataset.watch+")$"),t[e].innerHTML="",t[e].removeAttribute("data-watch"),this._list_watch.push(t[e])}if("selfWatch"in this.dataset){for(let t of this.querySelectorAll(".pseudo"))t.remove();this._template=(0,$jNRwG.Template).compile(this.innerHTML),this._watch=RegExp("^("+this.dataset.selfWatch+")$"),this.innerHTML="",this.removeAttribute("data-self-watch"),this._list_watch.push(this)}/* *** */t=this.querySelectorAll("[data-visible]");for(let e=0;e<t.length;e++)t[e]._visible=(0,$jNRwG.Template).compile(t[e].dataset.visible),t[e].removeAttribute("data-visible"),this._list_visible.push(t[e]);"selfVisible"in this.dataset&&(this._visible=(0,$jNRwG.Template).compile(this.dataset.selfVisible),this.removeAttribute("data-self-visible"),this._list_visible.push(this)),/* *** */t=this.querySelectorAll("[data-attr]");for(let e=0;e<t.length;e++){for(let n of(t[e]._attr=[],t[e].dataset.attr.split(";")))2==(n=n.split(":")).length&&t[e]._attr.push({name:n[0].trim(),value:(0,$jNRwG.Template).compile(n[1].trim())});t[e].removeAttribute("data-attr"),this._list_attr.push(t[e])}if("selfAttr"in this.dataset){for(let t of(this._attr=[],this.dataset.selfAttr.split(";")))2==(t=t.split(":")).length&&this._attr.push({name:t[0].trim(),value:(0,$jNRwG.Template).compile(t[1].trim())});this.removeAttribute("data-self-attr"),this._list_attr.push(this)}/* *** */t=this.querySelectorAll("[data-property]");for(let n=0;n<t.length;n++)t[n].onchange=t[n].onblur=function(){switch(this.type){case"radio":this.checked&&e.getModel().set(this.name,this.value);break;case"checkbox":e.getModel().set(this.name,this.checked?"1":"0");break;case"field":e.getModel().set(this.name,this.getValue());break;default:e.getModel().set(this.name,this.value)}},"SELECT"==t[n].tagName&&(t[n].onmouseup=function(){e.getModel().set(this.name,this.value)}),t[n].name=t[n].dataset.property,t[n].removeAttribute("data-property"),this._list_property.push(t[n]);"selfProperty"in this.dataset&&(this.onchange=this.onblur=function(){switch(this.type){case"radio":this.checked&&e.getModel().set(this.name,this.value);break;case"checkbox":e.getModel().set(this.name,this.checked?"1":"0");break;case"field":e.getModel().set(this.name,this.getValue());break;default:e.getModel().set(this.name,this.value)}},"SELECT"==this.tagName&&(this.onmouseup=function(){e.getModel().set(this.name,this.value)}),this.name=this.dataset.selfProperty,this.removeAttribute("data-self-property"),this._list_property.push(this)),/* *** */this._list_watch=this._list_watch.filter(t=>null!=t.parentElement),s!=this._list_watch.length&&(n=!0),this._list_visible=this._list_visible.filter(t=>null!=t.parentElement),r!=this._list_visible.length&&(n=!0),this._list_attr=this._list_attr.filter(t=>null!=t.parentElement),a!=this._list_attr.length&&(n=!0),this._list_property=this._list_property.filter(t=>null!=t.parentElement),o!=this._list_property.length&&(n=!0),null!=this.model&&n&&this.model.setNamespace(this.eid).update(!0).setNamespace(null)},/**
	**	Executed when the element is created and yet not attached to the DOM tree.
	*/onCreated:function(){},/**
	 * Executed when the element is attached to the DOM tree.
	 */elementConnected:function(){this.bindRoutes(),this.onConnected()},/**
	 * Executed when the element is no longer a part of the DOM tree.
	 */elementDisconnected:function(){this.unbindRoutes()},/**
	**	Executed when the element is attached to the DOM tree.
	*/onConnected:function(){this.onconnected&&this.onconnected(this)},/**
	**	Executed when the element is no longer a part of the DOM tree.
	*/onDisconnected:function(){this.ondisconnected&&this.ondisconnected(this)},/**
	**	Executed on the root element when a child element has `data-ref` attribute and it was added to it.
	*/onRefAdded:function(t,e){},/**
	**	Executed on the root element when a child element has `data-ref` attribute and it was removed from it.
	*/onRefRemoved:function(t,e){},/**
	**	Event handler invoked when the model has changed, executed before onModelChanged() to update internal dependencies,
	**	should not be overriden or elements watching the model will not be updated.
	**
	**	>> void onModelPreChanged (evt, args);
	*/onModelPreChanged:function(t,e){let n=this.getModel().get();for(let t=0;t<this._list_watch.length;t++)for(let s of e.fields)if(this._list_watch[t]._watch.test(s)){this._list_watch[t].innerHTML=this._list_watch[t]._template(n);break}for(let t=0;t<this._list_visible.length;t++)this._list_visible[t]._visible(n,"arg")?this._list_visible[t].style.removeProperty("display"):this._list_visible[t].style.setProperty("display","none","important");for(let t=0;t<this._list_attr.length;t++)for(let e of this._list_attr[t]._attr)this._list_attr[t][e.name]=e.value(n,"arg");this.onModelChanged(t,e)},/**
	**	Event handler invoked when the model has changed.
	*/onModelChanged:function(t,e){},/**
	**	Event handler invoked when a property of the model is changing. Fields `name` and `value` can be found in the `args` object.
	*/onModelPropertyChanging:function(t,e){},/**
	**	Event handler invoked when a property of the model has changed, executed before onModelPropertyChanged() to update internal
	**	dependencies. Automatically triggers internal events named `propertyChanged.<propertyName>` and `propertyChanged`.
	**	Should not be overriden or elements depending on the property will not be updated.
	*/onModelPropertyPreChanged:function(t,e){for(let t=0;t<this._list_property.length;t++)if(this._list_property[t].name==e.name){let n=!0;switch(this._list_property[t].type){case"radio":if(this._list_property[t].value!=e.value){this._list_property[t].parentElement.classList.remove("active");continue}this._list_property[t].checked=!0,this._list_property[t].parentElement.classList.add("active");break;case"checkbox":~~e.value?(this._list_property[t].checked=!0,this._list_property[t].parentElement.classList.add("active")):(this._list_property[t].checked=!1,this._list_property[t].parentElement.classList.remove("active"));break;case"field":this._list_property[t].val=this._list_property[t].dataset.value=e.value,this._list_property[t].setValue(e.value),n=!1;break;default:this._list_property[t].value=e.value,this._list_property[t].val=this._list_property[t].dataset.value=e.value,this._list_property[t].value!=e.value&&(n=!1)}n&&this._list_property[t].onchange&&this._list_property[t].onchange()}this.dispatch("propertyChanged."+e.name,e,!1),this.dispatch("propertyChanged",e,!1),this.onModelPropertyChanged(t,e)},/**
	**	Event handler invoked when a property of the model has changed.
	*/onModelPropertyChanged:function(t,e){},/**
	**	Event handler invoked when a property of the model is removed. Field `name` can be found in the `args` object.
	*/onModelPropertyRemoved:function(t,e){},/*
	**	Runs the following preparation procedures on the specified prototype:
	**		- All functions named 'event <event-name> [event-selector]' will be moved to the 'events' map.
	**		- All functions named 'route <route-path>' will be moved to the 'routes' map.
	**
	**	>> void preparePrototype (object proto);
	*/preparePrototype:function(t){if(!0!==t.__prototypePrepared)for(let e in t.__prototypePrepared=!0,t.hasOwnProperty("events")&&t.events||(t.events={}),t.hasOwnProperty("routes")&&t.routes||(t.routes={}),t)e.startsWith("event ")?(t.events[e.substr(6)]=t[e],delete t[e]):e.startsWith("route ")&&(t.routes[e.substr(6)]=t[e],delete t[e])},/*
	**	Registers a new custom element with the specified name. Extra functionality can be added with one or more prototypes, by default
	**	all elements also get the `Element` prototype. Note that the final prototypes of all registered elements are stored, and if you want
	**	to inherit another element's prototype just provide its name (string) in the protos argument list.
	**
	**	>> class register (string name, ...(object|string) protos);
	*/register:function(t,...e){let n;let s=class extends HTMLElement{constructor(){for(let t of(super(),this.invokeConstructor=!0,$a5c21812244207c8$var$Element.debug&&console.log("CREATED "+this.tagName),this._super={},Object.entries(this.constructor.prototype._super)))for(let e of(this._super[t[0]]={},Object.entries(t[1])))this._super[t[0]][e[0]]=e[1].bind(this);this.onCreated()}findRoot(t){let e=t||this.parentElement;for(;null!=e;){if("isRoot"in e&&!0===e.isRoot)return e;e=e.parentElement}return null}findCustomParent(t){let e=t?t.parentElement:this.parentElement;for(;null!=e;){if(-1!==e.tagName.indexOf("-"))return e;e=e.parentElement}return null}connectReference(t=null,e=255){this.root||(1&e)!=1||(null==t&&(t=this.findRoot()),null==t||(this.dataset.ref&&(t[this.dataset.ref]=this),this.root=t))}connectedCallback(){this.connectReference(null,1),this.invokeConstructor&&(this.invokeConstructor=!1,this.__ctor()),this.connectReference(null,2),this.elementConnected(),this.dataset.xref&&(globalThis[this.dataset.xref]=this)}disconnectedCallback(){this.root&&(this.dataset.ref&&(this.root.onRefRemoved(this.dataset.ref,this),delete this.root[this.dataset.ref]),this.root=null),this.elementDisconnected(),this.dataset.xref&&delete globalThis[this.dataset.xref]}};(0,$jNRwG.Rinn).override(s.prototype,$a5c21812244207c8$var$Element);let r={},a={},o=(0,$jNRwG.Rinn).clone($a5c21812244207c8$var$Element.events),l=!0,h=!0,u=!0;for(let t=0;t<e.length;t++)if(e[t]){if("string"==(0,$jNRwG.Rinn).typeOf(e[t])){let s=e[t];if(e[t]=$a5c21812244207c8$var$elementPrototypes[s],!e[t])continue;for(let n in a[s]={},e[t])"function"==(0,$jNRwG.Rinn).typeOf(e[t][n])&&(a[s][n]=e[t][n]);l=!1,h=!1,u=!1,n=!1}else $a5c21812244207c8$var$Element.preparePrototype(e[t]),n=!0;"_super"in e[t]&&(0,$jNRwG.Rinn).override(a,e[t]._super),"events"in e[t]&&(0,$jNRwG.Rinn).override(o,e[t].events),(0,$jNRwG.Rinn).override(s.prototype,e[t]),(0,$jNRwG.Rinn).override(r,e[t]),n&&(!l&&"init"in e[t]&&(l=!0),!h&&"ready"in e[t]&&(h=!0),!u&&"rready"in e[t]&&(u=!0))}let c=function(){};return l||(s.prototype.init=c,r.init=c),h||(s.prototype.ready=c,r.ready=c),u||(s.prototype.rready=c,r.rready=c),s.prototype._super=a,s.prototype.events=o,r._super=a,r.events=o,customElements.define(t,s),$a5c21812244207c8$var$elementPrototypes[t]=r,$a5c21812244207c8$var$elementClasses[t]=s,s},/*
	**	Expands an already created custom element with the specified prototype(s).
	**
	**	>> void expand (string elementName, ...object protos);
	*/expand:function(t,...e){if(!(t in $a5c21812244207c8$var$elementPrototypes))return;let n=$a5c21812244207c8$var$elementPrototypes[t],s=$a5c21812244207c8$var$elementClasses[t],r=n._super,a=n.events;for(let t of e)$a5c21812244207c8$var$Element.preparePrototype(t),"_super"in t&&(0,$jNRwG.Rinn).override(r,t._super),"events"in t&&(0,$jNRwG.Rinn).override(a,t.events),(0,$jNRwG.Rinn).override(s.prototype,t),(0,$jNRwG.Rinn).override(n,t);s.prototype._super=r,s.prototype.events=a,n._super=r,n.events=a},/*
	**	Appends a hook to a function of a custom element.
	*/hookAppend:function(t,e,n){if(!(t in $a5c21812244207c8$var$elementPrototypes))return;let s=(0,$jNRwG.Rinn).hookAppend($a5c21812244207c8$var$elementPrototypes[t],e,n),r=(0,$jNRwG.Rinn).hookAppend($a5c21812244207c8$var$elementClasses[t].prototype,e,n);return{unhook:function(){s.unhook(),r.unhook()}}},/*
	**	Prepends a hook to a function of a custom element.
	*/hookPrepend:function(t,e,n){if(!(t in $a5c21812244207c8$var$elementPrototypes))return;let s=(0,$jNRwG.Rinn).hookPrepend($a5c21812244207c8$var$elementPrototypes[t],e,n),r=(0,$jNRwG.Rinn).hookPrepend($a5c21812244207c8$var$elementClasses[t].prototype,e,n);return{unhook:function(){s.unhook(),r.unhook()}}},/**
	**	Built-in action handlers.
	*//**
	**	:toggleClass <className> [<selector>]
	**
	**	Toggles a CSS class on the element.
	*/":toggleClass":function(t,e){let n=e.source;"2"in t&&(n=document.querySelector(t[2])),n&&(n.classList.contains(t[1])?n.classList.remove(t[1]):n.classList.add(t[1]))},/**
	**	:setClass <className> [<selector>]
	**
	**	Sets a CSS class on the element.
	*/":setClass":function(t,e){let n=e.source;"2"in t&&(n=document.querySelector(t[2])),n&&n.classList.add(t[1])},/**
	**	:volatileClass <className> [<selector>]
	**
	**	Adds the CSS class to the element and any click outside will cause it to be removed.
	*/":volatileClass":function(t,e){let n=e.source;if("2"in t&&(n=document.querySelector(t[2])),!n)return;n.classList.add(t[1]);let s=()=>{window.removeEventListener("click",s,!0),n.classList.remove(t[1])};window.addEventListener("click",s,!0)},/**
	**	:toggleClassUnique <className> <parentSelector> <childSelector>
	**
	**	Toggles a CSS class on the element and only one element in the selected parent can have the class.
	*/":toggleClassUnique":function(t,e){let n=e.source;n&&(n.classList.contains(t[1])?n.classList.remove(t[1]):(n.querySelectorParent(t[2]).querySelectorAll(t[3]).forEach(e=>e.classList.remove(t[1])),n.classList.add(t[1])))},/**
	**	:setClassUnique <className> <parentSelector> <childSelector>
	**
	**	Sets a CSS class on the element and only that element in the selected parent can have the class.
	*/":setClassUnique":function(t,e){let n=e.source;n&&(n.querySelectorParent(t[2]).querySelectorAll(t[3]).forEach(e=>e.classList.remove(t[1])),n.classList.add(t[1]))}};$a5c21812244207c8$var$Element.debug=!1,$a5c21812244207c8$var$Element.register("r-elem",{}),$a5c21812244207c8$var$Element.register("r-dom-probe",{}),/* ****************************************** *//**
 * Finds the parent element given a selector.
 */HTMLElement.prototype.querySelectorParent=function(t){let e=this;for(;null!=e&&!e.matches(t);)e=e.parentElement;return e};var $a5c21812244207c8$export$2e2bcd8739ae039=$a5c21812244207c8$var$Element,$8AUAG=parcelRequire("8AUAG");/**
 * API interface utility functions.
 */let $7a42222fdfbd696d$var$Api={/**
	 * Flags constants.
	 */REQUEST_PACKAGE_SUPPORTED:1,REQ64_SUPPORTED:2,JSON_RESPONSE_SUPPORTED:4,XML_RESPONSE_SUPPORTED:8,INCLUDE_CREDENTIALS:16,UNIQUE_STAMP:32,DISABLE_CORS:64,/**
	 * Target URL for all the API requests. Set by calling `setEndPoint`.
	 */apiUrl:"/api",/**
	 * Capabilities flag.
	 */flags:63,/**
	 * Indicates if all request data will be packed into a req64 parameter instead of individual fields.
	 */useReq64:!1,/**
	 * Number of retries to execute each API call before giving up and invoking error handlers.
	 */retries:0,/**
	 * Headers for the request.
	 */headers:{},/**
	 * Level of the current request. Used to detect nested requests.
	 */_requestLevel:0,/**
	 * Indicates if all API calls should be bundled in a request package. Activated by calling the packageBegin() function and finished with packageEnd().
	 */_requestPackage:0,/**
	 * When in package-mode, this contains the package data to be sent upon a call to packageEnd().
	 */_packageData:[],/**
	 * Sets the API end-point URL address.
	 */setEndPoint:function(t,e=null){return this.apiUrl=t,this.flags=e??this.flags,this},/**
	 * Overridable filter that processes the response from the server and returns true if it was successful. The `res` parameter indicates the response data, and `req` the request data.
	 */responseFilter:function(t,e){return!0},/**
	 * Starts "package-mode" (using the `rpkg` field). Any API calls after this will be bundled together.
	 */packageBegin:function(){this.flags&$7a42222fdfbd696d$var$Api.REQUEST_PACKAGE_SUPPORTED&&this._requestPackage++},/**
	 * Finishes "package-mode" and a single API request with the currently constructed package will be sent.
	 */packageEnd:function(t){this.flags&$7a42222fdfbd696d$var$Api.REQUEST_PACKAGE_SUPPORTED&&this._requestPackage&&(--this._requestPackage||this.packageSend(t))},/**
	 * Starts package-mode, executes the callback and finishes package-mode. Therefore any requests made by the callback will be packed together.
	 */batch:function(t,e=null){if(!(this.flags&$7a42222fdfbd696d$var$Api.REQUEST_PACKAGE_SUPPORTED)){t(),e&&e();return}this.packageBegin(),t(),this.packageEnd(e)},/**
	 * Sends a single API request with the currently constructed package and maintains package-mode.
	 */packageSend:function(t){if(!(this.flags&$7a42222fdfbd696d$var$Api.REQUEST_PACKAGE_SUPPORTED)||!this._packageData.length)return;let e=this._packageData;this._packageData=[];for(var n="",s=0;s<e.length;s++)n+="r"+s+","+/*@__PURE__*/$parcel$interopDefault($8AUAG).encode(this.encodeParams(e[s][2]))+";";this._showProgress(),this.apiCall({rpkg:n},(n,s)=>{this._hideProgress();for(let t=0;t<e.length;t++)try{var r=n["r"+t];if(!r){null!=e[t][1]&&e[t][1](e[t][2]);continue}null!=e[t][0]&&this.responseFilter(r,e[t][2])&&e[t][0](r,e[t][2])}catch(t){}t&&t()},t=>{this._hideProgress();for(let t=0;t<e.length;t++)null!=e[t][1]&&e[t][1](e[t][2])})},/**
	 * Adds CSS class 'busy' to the HTML root element, works only if running inside a browser.
	 */_showProgress:function(){"document"in $parcel$global&&(this._requestLevel++,this._requestLevel>0&&$parcel$global.document.documentElement.classList.add("busy"))},/**
	 * Removes the 'busy' CSS class from the HTML element.
	 */_hideProgress:function(){"document"in $parcel$global&&(this._requestLevel--,this._requestLevel||setTimeout(()=>{0===this._requestLevel&&$parcel$global.document.documentElement.classList.remove("busy")},250))},/**
	 * Sets an HTTP header.
	 */header:function(t,e){return null===e?delete this.headers[t]:this.headers[t]=e,this},/**
	 * Returns a parameter string for a GET request given an object with fields.
	 */encodeParams:function(t){let e=[];if(t instanceof FormData)for(let n of t.entries())e.push(encodeURIComponent(n[0])+"="+encodeURIComponent(n[1]));else for(let n in t)e.push(encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e.join("&")},/**
	 * Returns a URL given a relative or absolute URL.
	 */getUrl:function(t){return -1!==t.indexOf("//")?t:this.apiUrl+t},/**
	 * Appends a parameter to the URL.
	 */appendParam:function(t,e){return t+(-1==t.indexOf("?")?"?":"&")+e},/**
	 * Executes an API call to the URL stored in the `apiUrl` property. By default `httpMethod` is "auto", which will determine the best depending on the data to
	 * be sent. Any connection error will be reported to the `failure` callback, and similarly any success to the `success` callback. The `params` object can be
	 * a FormData object or just a regular object.
	 */apiCall:function(t,e,n,s=null,r=null,a=""){let o=this.getUrl(a);if(this.flags&$7a42222fdfbd696d$var$Api.UNIQUE_STAMP&&(o=this.appendParam(o,"_="+Date.now())),"GET"!=(s=s?s.toUpperCase():null)&&"POST"!=s&&(s="auto"),null===r&&(r=this.retries),this._requestPackage&&this.flags&$7a42222fdfbd696d$var$Api.REQUEST_PACKAGE_SUPPORTED){t instanceof FormData||(t={...t}),this._packageData.push([e,n,t]);return}this._showProgress();let l=t,h={mode:this.flags&$7a42222fdfbd696d$var$Api.DISABLE_CORS?"no-cors":"cors",headers:{Accept:"text/html,application/xhtml+xml,application/xml,application/json;q=0.9",...this.headers},method:s,body:null,multipart:!1};if(this.flags&$7a42222fdfbd696d$var$Api.INCLUDE_CREDENTIALS&&(h.credentials="include"),"string"==typeof l||l instanceof Blob)"string"==typeof l?"<"===l[0]?l.endsWith("</soap:Envelope>")?h.headers["Content-Type"]="application/soap+xml":h.headers["Content-Type"]="application/xml":"{"===l[0]||"["===l[0]?h.headers["Content-Type"]="application/json":h.headers["Content-Type"]="application/octet-stream":h.headers["Content-Type"]=l.type,h.method="POST",h.body=l;else{if(!(l instanceof FormData))for(let e in l=new FormData,t)t[e]instanceof File||t[e]instanceof Blob?l.append(e,t[e],t[e].name):l.append(e,t[e]);for(let t of l.entries())if(t[1]instanceof File||t[1]instanceof Blob){h.method="POST",h.multipart=!0;break}if(this.useReq64&&this.flags&$7a42222fdfbd696d$var$Api.REQ64_SUPPORTED&&!h.multipart){let t=new FormData;t.append("req64",/*@__PURE__*/$parcel$interopDefault($8AUAG).encode(this.encodeParams(l))),l=t}if("auto"==h.method){let t=0;for(let e of(h.method="GET",l.entries()))if((t+=e[0].length+e[1].length+2)>960){h.method="POST";break}}"GET"==h.method?o=this.appendParam(o,this.encodeParams(l)):h.multipart?h.body=l:(h.headers["Content-Type"]="application/x-www-form-urlencoded",h.body=this.encodeParams(l))}$parcel$global.fetch(o,h).then(t=>this.decodeResult(t)).then(n=>{if(this._hideProgress(),e&&this.responseFilter(n,t))try{e(n,t)}catch(t){}}).catch(o=>{this._hideProgress(),0==r?n&&n(o,t):this.apiCall(l,e,n,s,r-1,a)})},/**
	 * Decodes a result obtained using fetch into a usable object.
	 */decodeResult:function(t){let e=t.headers.get("content-type").split(";")[0].toLowerCase();return this.flags&$7a42222fdfbd696d$var$Api.JSON_RESPONSE_SUPPORTED&&-1!==e.indexOf("json")?t.json():this.flags&$7a42222fdfbd696d$var$Api.XML_RESPONSE_SUPPORTED&&-1!==e.indexOf("xml")?new Promise((e,n)=>{t.text().then(t=>{e(t=(new DOMParser).parseFromString(t,"text/xml"))}).catch(n)}):t.blob()},/**
	 * Makes a blob with the specified data and type.
	 */getBlob:function(t,e){return new Blob([t],{type:e})},/**
	 * Provided access to the base64 module to encode/decode data.
	 */base64:{encode:function(t){return /*@__PURE__*/$parcel$interopDefault($8AUAG).encode(t)},decode:function(t){return /*@__PURE__*/$parcel$interopDefault($8AUAG).decode(t)}},/**
	 * Executes an API request, returns a promise.
	 */request:function(t,e,n=null){return null===n&&"string"!=typeof e&&(n=e,e=""),new Promise((s,r)=>{this.apiCall(n,s,r,null,t,e)})},/**
	 * Executes a POST API call.
	 */post:function(t,e=null,n=null){return this.apiCall(t,e,n,"POST")},/**
	 * Executes a GET API call.
	 */get:function(t,e=null,n=null){return this.apiCall(t,e,n,"GET")},/**
	 * Executes an automatic API call, returns a promise.
	 */fetch:function(t,e=null){return null===e&&"string"!=typeof t&&(e=t,t=""),new Promise((n,s)=>{this.apiCall(e,n,s,null,null,t)})},/**
	 * Builds a URL from the given data.
	 */makeUrl:function(t,e=null){return null===e&&"string"!=typeof t&&(e=t,t=""),this.appendParam(this.getUrl(t),this.encodeParams(e))}};var $7a42222fdfbd696d$export$2e2bcd8739ae039=$7a42222fdfbd696d$var$Api,$jNRwG=parcelRequire("jNRwG"),/*
**	Provides several methods to quickly interface with a remote data-source as defined by Wind.
*/$80620d99b03812be$export$2e2bcd8739ae039=(0,$jNRwG.EventDispatcher).extend({className:"DataSource",debounceDelay:250,request:null,includeCount:!1,includeEnum:!1,includeList:!0,eid:null,count:0,list:null,enum:null,/*
	**	Constructs the data source with the specified optional `config` parameters, any of the properties of this object can be specified
	**	in the config. Uses the given basePath as prefix for the `f` parameter for subsequent API operations, a basePath of `candies` will
	**	result in calls to `candies.list`, `candies.count`, etc.
	*/__ctor:function(t,e){this._super.EventDispatcher.__ctor(),this.basePath=t,e&&Object.assign(this,e),this.request=new $jNRwG.Model(this.request),this.eid=Math.random().toString().substr(2),this.count=0,this.list=new $jNRwG.ModelList,this.list.dataSource=this,this.enum=new $jNRwG.ModelList,this.enum.dataSource=this,this.request.addEventListener(this.eid+":propertyChanged",this.forwardRequestEvent,this),this.list.addEventListener(this.eid+":itemsCleared",this.forwardListEvent,this),this.list.addEventListener(this.eid+":itemsChanged",this.forwardListEvent,this),this.list.addEventListener(this.eid+":itemRemoved",this.forwardListEvent,this),this.list.addEventListener(this.eid+":itemChanged",this.forwardListEvent,this),this.list.addEventListener(this.eid+":itemAdded",this.forwardListEvent,this),this.enum.addEventListener(this.eid+":itemsCleared",this.forwardEnumEvent,this),this.enum.addEventListener(this.eid+":itemsChanged",this.forwardEnumEvent,this),this.enum.addEventListener(this.eid+":itemRemoved",this.forwardEnumEvent,this),this.enum.addEventListener(this.eid+":itemChanged",this.forwardEnumEvent,this),this.enum.addEventListener(this.eid+":itemAdded",this.forwardEnumEvent,this)},forwardRequestEvent:function(t,e){this.prepareEvent("request"+t.name[0].toUpperCase()+t.name.substr(1),e).setSource(t.source).resume()},forwardListEvent:function(t,e){this.prepareEvent("list"+t.name[0].toUpperCase()+t.name.substr(1),e).setSource(t.source).resume()},forwardEnumEvent:function(t,e){this.prepareEvent("enum"+t.name[0].toUpperCase()+t.name.substr(1),e).setSource(t.source).resume()},/*
	**	Executes one or more API functions (depending on `includeCount`, `includeEnum` and `includeList` properties) to retrieve the
	**	required data (uses debounce to prevent too-quick refreshes).
	**
	**	Refresh mode can be: order, filter, range, enum or full. Setting `mode` to `true` will cause a full refresh without debouncing.
	*/refresh:function(t="full",e=null){"function"==typeof t&&(e=t,t="full"),this._timeout&&(clearTimeout(this._timeout),this._timeout=null);let n=()=>{this._timeout=null,$7a42222fdfbd696d$export$2e2bcd8739ae039.packageBegin(),this.includeCount&&("full"===t||"filter"===t)&&this.fetchCount(),this.includeEnum&&("full"===t||"enum"===t)&&this.fetchEnum(),this.includeList&&"enum"!==t&&this.fetchList(),$7a42222fdfbd696d$export$2e2bcd8739ae039.packageEnd(e)};!0===t?(t="full",n()):this._timeout=setTimeout(n,this.debounceDelay)},/*
	**	Searches for the item in `list` that matches the specified `fields` and sends it to the callback. If no item is found (or if `forced` is true),
	**	a call to API function `.get` will be executed with the fields as request parameters. Returns a promise.
	*/fetch:function(t,e=!1){return new Promise((n,s)=>{let r=!0==e?null:this.list.find(t,!0);r?n(r.get()):this.fetchOne(t,t=>{t&&200==t.response&&t.data.length>0?n(t.data[0]):s(t)})})},/*
	**	Removes an item from the remote data source by executing the `.delete` API function, passes the given `fields` as request
	**	parameters. Returns a promise.
	*/delete:function(t){return new Promise((e,n)=>{this.fetchDelete(t,t=>{200==t.response?e(t):n(t.error)})})},fetchList:function(){let t={...this.request.get()};t.f=this.basePath+".list",this.dispatchEvent("listLoading"),$7a42222fdfbd696d$export$2e2bcd8739ae039.fetch(t).then(t=>{this.list.setData(200==t.response?t.data:null),this.dispatchEvent("listLoaded"),this.dispatchEvent("listChanged")})},fetchEnum:function(){let t={...this.request.get()};t.f=this.basePath+".enum",this.dispatchEvent("enumLoading"),$7a42222fdfbd696d$export$2e2bcd8739ae039.fetch(t).then(t=>{this.enum.setData(200==t.response?t.data:null),this.dispatchEvent("enumLoaded"),this.dispatchEvent("enumChanged")})},fetchCount:function(){let t={...this.request.get()};t.f=this.basePath+".count",this.dispatchEvent("countLoading"),$7a42222fdfbd696d$export$2e2bcd8739ae039.fetch(t).then(t=>{this.count=200==t.response?t.count:0,this.dispatchEvent("countLoaded"),this.dispatchEvent("countChanged")})},fetchOne:function(t,e){let n={...this.request.get(),...t};n.f=this.basePath+".get",$7a42222fdfbd696d$export$2e2bcd8739ae039.fetch(n).then(t=>{e(t)})},fetchDelete:function(t,e){let n={...this.request.get(),...t};n.f=this.basePath+".delete",$7a42222fdfbd696d$export$2e2bcd8739ae039.fetch(n).then(t=>{e(t)})},fetchData:function(t){let e={...this.request.get(),...t};return"."==e.f[0]&&(e.f=this.basePath+e.f),$7a42222fdfbd696d$export$2e2bcd8739ae039.fetch(e)},makeUrl:function(t){let e={...this.request.get(),...t};return"."==e.f[0]&&(e.f=this.basePath+e.f),$7a42222fdfbd696d$export$2e2bcd8739ae039.makeUrl(e)}}),$jNRwG=parcelRequire("jNRwG"),/*
**	Provides an interface to connect with a listing API function.
*/$dae0bbca73793b94$export$2e2bcd8739ae039=(0,$jNRwG.ModelList).extend({className:"DataList",debounceDelay:250,request:null,eid:null,/*
	**	Constructs the data list with the specified optional `config` parameters, any of the properties of this object can be specified
	**	in the config. The given `f` parameter is passed directly as a request parameter to the API.
	*/__ctor:function(t,e=null){this._super.ModelList.__ctor(),null!==e&&Object.assign(this,e),this.request||(this.request={}),this.request.f=t,this.request=new $jNRwG.Model(this.request),this.eid=Math.random().toString().substr(2),this.dataList=this,this.request.addEventListener(this.eid+":propertyChanged",this.forwardRequestEvent,this)},forwardRequestEvent:function(t,e){this.prepareEvent("request"+t.name[0].toUpperCase()+t.name.substr(1),e).setSource(t.source).resume()},/*
	**	Executes a request to retrieve the data for the list (uses debounce to prevent too-quick refreshes).
	*/refresh:function(t=null,e=null){if(this._timeout&&(clearTimeout(this._timeout),this._timeout=null),!0===t){this.dispatchEvent("listLoading"),$7a42222fdfbd696d$export$2e2bcd8739ae039.fetch(this.request.get()).then(t=>{this.setData(200==t.response?t.data:null),this.dispatchEvent("listLoaded"),this.dispatchEvent("listChanged"),null!==e&&e()});return}let n=()=>{this.refresh(!0,t)};this._timeout=setTimeout(n,this.debounceDelay)}});/**
**	Collection of useful easing functions (imported from Cherry source code).
*/let $34149b5e20a7ad4b$var$Easing={/**
	**	Interpolates numeric values between two objects (`src` and `dst`) using the specified `duration` (in seconds) and `easing` function. Note
	**	that all four parameters `src`, `dst`, `duration` and `easing` must be objects having the same number of values.
	*/interpolate:function(t,e,n,s,r/* function(data, isFinished) */){let a={},o={},l=0;for(let e in t)a[e]=0,o[e]=t[e],l++;let h=Date.now()/1e3,u=0,c=function(){let d=Date.now()/1e3;for(let r in u=d-h,h=d,a){if(a[r]==n[r])continue;a[r]+=u,a[r]>=n[r]&&(a[r]=n[r],l--);let h=s[r](a[r]/n[r]);o[r]=(1-h)*t[r]+h*e[r]}r(o,0==l),0!=l&&requestAnimationFrame(c)};c()},/* ******************************************** */Linear:{IN:function(t){return t},OUT:function(t){return t},IN_OUT:function(t){return t}},/* ******************************************** */Back:{k:1.70158,IN:function(t,e){return void 0===e&&(e=$34149b5e20a7ad4b$var$Easing.Back.k),t*t*((e+1)*t-e)},OUT:function(t,e){return 1-$34149b5e20a7ad4b$var$Easing.Back.IN(1-t,e)},IN_OUT:function(t,e){return t<.5?$34149b5e20a7ad4b$var$Easing.Back.IN(2*t,e)/2:$34149b5e20a7ad4b$var$Easing.Back.OUT((t-.5)*2,e)/2+.5}},/* ******************************************** */Bounce:{getConst:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},IN:function(t){return 1-$34149b5e20a7ad4b$var$Easing.Bounce.getConst(1-t)},OUT:function(t){return $34149b5e20a7ad4b$var$Easing.Bounce.getConst(t)},IN_OUT:function(t){return t<.5?(1-$34149b5e20a7ad4b$var$Easing.Bounce.getConst(1-2*t))/2:$34149b5e20a7ad4b$var$Easing.Bounce.getConst((t-.5)*2)/2+.5}},/* ******************************************** */Circ:{IN:function(t){return 1-Math.sqrt(1-t*t)},OUT:function(t){return 1-$34149b5e20a7ad4b$var$Easing.Circ.IN(1-t)},IN_OUT:function(t){return t<.5?$34149b5e20a7ad4b$var$Easing.Circ.IN(2*t)/2:$34149b5e20a7ad4b$var$Easing.Circ.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Cubic:{IN:function(t){return t*t*t},OUT:function(t){return 1-$34149b5e20a7ad4b$var$Easing.Cubic.IN(1-t)},IN_OUT:function(t){return t<.5?$34149b5e20a7ad4b$var$Easing.Cubic.IN(2*t)/2:$34149b5e20a7ad4b$var$Easing.Cubic.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Expo:{IN:function(t){return Math.pow(2,12*(t-1))},OUT:function(t){return-Math.pow(2,-12*t)+1},IN_OUT:function(t){return(t*=2)<1?Math.pow(2,12*(t-1))/2:(-Math.pow(2,-12*(t-1))+2)/2}},/* ******************************************** */Power:{p:12,IN:function(t){return Math.pow(t,$34149b5e20a7ad4b$var$Easing.Power.p)},OUT:function(t){return 1-$34149b5e20a7ad4b$var$Easing.Power.IN(1-t)},IN_OUT:function(t){return t<.5?$34149b5e20a7ad4b$var$Easing.Power.IN(2*t)/2:$34149b5e20a7ad4b$var$Easing.Power.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Quad:{IN:function(t){return t*t},OUT:function(t){return 1-$34149b5e20a7ad4b$var$Easing.Quad.IN(1-t)},IN_OUT:function(t){return t<.5?$34149b5e20a7ad4b$var$Easing.Quad.IN(2*t)/2:$34149b5e20a7ad4b$var$Easing.Quad.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Quartic:{IN:function(t){return t*t*t*t},OUT:function(t){return 1-$34149b5e20a7ad4b$var$Easing.Quartic.IN(1-t)},IN_OUT:function(t){return t<.5?$34149b5e20a7ad4b$var$Easing.Quartic.IN(2*t)/2:$34149b5e20a7ad4b$var$Easing.Quartic.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Quintic:{IN:function(t){return t*t*t*t*t},OUT:function(t){return 1-$34149b5e20a7ad4b$var$Easing.Quintic.IN(1-t)},IN_OUT:function(t){return t<.5?$34149b5e20a7ad4b$var$Easing.Quintic.IN(2*t)/2:$34149b5e20a7ad4b$var$Easing.Quintic.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Sine:{IN:function(t){return 1-Math.sin(1.5708*(1-t))},OUT:function(t){return Math.sin(1.5708*t)},IN_OUT:function(t){return-((Math.cos(3.1416*t)-1)/2)}},/* ******************************************** */Step:{IN:function(t){return 1!=t?0:1},OUT:function(t){return 1!=t?0:1},IN_OUT:function(t){return 1!=t?0:1}}};var $34149b5e20a7ad4b$export$2e2bcd8739ae039=$34149b5e20a7ad4b$var$Easing,$jNRwG=parcelRequire("jNRwG");/**
**	Class to animate properties using rules (imported from Cherry source code).
*/let $b77ee20098523c74$var$Anim=(0,$jNRwG.Class).extend({list:null,initialData:null,data:null,stack:null,block:null,timeScale:1,time:0,blockTime:0,index:0,paused:!1,finished:!1,onFinishedCallback:null,onUpdatedCallback:null,__ctor:function(){this.list=[],this.initialData={},this.data={},this.stack=[],this.block=this.list,this.reset()},__dtor:function(){},clone:function(){let t=new $b77ee20098523c74$var$Anim;return t.list=this.list,t.initialData=this.initialData,t.reset()},onFinished:function(t){return this.onFinishedCallback=t,this},onUpdated:function(t){return this.onUpdatedCallback=t,this},// Resets the animation to its initial state.
reset:function(){for(let t in this.stack.length=0,this.blockTime=0,this.time=0,this.index=0,this.block=this.list,this.paused=!0,this.finished=!1,this.handle=null,this.initialData)this.data[t]=this.initialData[t];return this},// Sets the initial data.
initial:function(t){return this.initialData=t,this.reset()},// Sets the time scale (animation speed).
speed:function(t){return this.timeScale=t>0?t:1,this},// Sets the output data object.
setOutput:function(t){return this.data=t,this},// Pauses the animation.
pause:function(){this.paused||(clearInterval(this.handle),this.paused=!0)},// Resumes the animation.
resume:function(){if(!this.paused)return;let t=Date.now()/1e3;this.handle=setInterval(()=>{let e=Date.now()/1e3,n=e-t;t=e,this.update(n),this.onUpdatedCallback&&this.onUpdatedCallback(this.data,this)},16),this.onUpdatedCallback&&this.onUpdatedCallback(this.data,this),this.paused=!1},// Updates the animation by the specified delta time (seconds).
update:function(t){let e,n,s;if(this.paused)return!1;if(this.index>=this.block.length)return!0;let r=0;for(this.time+=t*this.timeScale;this.index<this.block.length;){let a,o=this.block[this.index];switch(o.op){case"parallel":if(!1==o.started)for(r=0,o.blocks.length=0,o.started=!0;r<o.block.length;r++)o.blocks.push([o.block[r]]),o.indices[r]=0,o.blockTimes[r]=this.blockTime;e=this.block,n=this.index;let l=0,h=s=this.blockTime;for(r=0;r<o.blocks.length;r++)this.block=o.blocks[r],this.index=o.indices[r],this.blockTime=o.blockTimes[r],!0===this.update(0)&&l++,this.blockTime>h&&(h=this.blockTime),o.blockTimes[r]=this.blockTime,o.blocks[r]=this.block,o.indices[r]=this.index;if(this.block=e,this.index=n,this.blockTime=s,o.fn&&o.fn.call(this),l!=o.blocks.length)return!1;o.started=!1,this.blockTime=h,this.index++;break;case"serial":if(!1==o.started&&(o._block=o.block,o._index=0,o._blockTime=this.blockTime,o.started=!0),e=this.block,n=this.index,s=this.blockTime,this.block=o._block,this.index=o._index,this.blockTime=o._blockTime,r=this.update(0),o._block=this.block,o._index=this.index,o._blockTime=this.blockTime,this.block=e,this.index=n,this.blockTime=s,o.fn&&o.fn.call(this),!0!==r)return!1;o.started=!1,this.blockTime=o._blockTime,this.index++;break;case"repeat":if(!1==o.started&&(o._block=o.block,o._index=0,o._blockTime=this.blockTime,o._count=o.count,o.started=!0),e=this.block,n=this.index,s=this.blockTime,this.block=o._block,this.index=o._index,this.blockTime=o._blockTime,r=this.update(0),o._block=this.block,o._index=this.index,o._blockTime=this.blockTime,this.block=e,this.index=n,this.blockTime=s,o.fn&&o.fn.call(this),!0!==r)return!1;if(o._count<=1)return o.started=!1,this.blockTime=o._blockTime,this.index++,!1;return o._index=0,o._count--,!1;case"set":this.data[o.field]=o.value,this.index++;break;case"restart":this.index=0;break;case"wait":if(a="string"==(0,$jNRwG.Rinn).typeOf(o.duration)?this.data[o.duration]:o.duration,this.time<this.blockTime+a)return!1;this.blockTime+=a,this.index++;break;case"range":if(!1==o.started&&(null===o.startValue?o._startValue=this.data[o.field]:o._startValue=o.startValue,o._endValue=o.endValue,o.started=!0),a="string"==(0,$jNRwG.Rinn).typeOf(o.duration)?this.data[o.duration]:o.duration,t=this.time<this.blockTime+a?(this.time-this.blockTime)/a:1,o.easing&&1!=t?this.data[o.field]=o.easing(t)*(o._endValue-o._startValue)+o._startValue:this.data[o.field]=t*(o._endValue-o._startValue)+o._startValue,1!=t)return!1;o.started=!1,this.blockTime+=a,this.index++;break;case"rand":if(!1==o.started&&(o.started=!0,o.last=null),a="string"==(0,$jNRwG.Rinn).typeOf(o.duration)?this.data[o.duration]:o.duration,t=this.time<this.blockTime+a?(this.time-this.blockTime)/a:1,o.easing&&1!=t?o.cur=~~(o.easing(t)*o.count):o.cur=~~(t*o.count),o.cur!=o.last){for(;(r=~~(Math.random()*(o.endValue-o.startValue+1))+o.startValue)==this.data[o.field];);this.data[o.field]=r,o.last=o.cur}if(1!=t)return!1;o.started=!1,this.blockTime+=a,this.index++;break;case"randt":if(a="string"==(0,$jNRwG.Rinn).typeOf(o.duration)?this.data[o.duration]:o.duration,t=this.time<this.blockTime+a?(this.time-this.blockTime)/a:1,r=o.easing&&1!=t?o.easing(t)*(o.count-1):t*(o.count-1),this.data[o.field]=o.table[~~((r+o.count)%o.count)],1!=t)return!1;this.blockTime+=a,this.index++;break;case"play":o.snd.play(),this.index++;break;case"exec":o.fn.call(this,this),this.index++}}return this.block==this.list&&(this.finished||null==this.onFinishedCallback||this.onFinishedCallback(),this.pause(),this.finished=!0),!0},// Runs the subsequent commands in parallel. Should end the parallel block by calling end().
parallel:function(){let t=[];return this.block.push({op:"parallel",started:!1,block:t,blocks:[],indices:[],blockTimes:[]}),this.stack.push(this.block),this.block=t,this},// Runs the subsequent commands in series. Should end the serial block by calling end().
serial:function(){let t=[];return this.block.push({op:"serial",started:!1,block:t}),this.stack.push(this.block),this.block=t,this},// Repeats a block the specified number of times.
repeat:function(t){let e=[];return this.block.push({op:"repeat",started:!1,block:e,count:t}),this.stack.push(this.block),this.block=e,this},// Sets the callback of the current block.
callback:function(t){let e=this.stack[this.stack.length-1];return e[e.length-1].fn=t,this},// Ends a parallel(), serial() or repeat() block.
end:function(){return this.block=this.stack.pop(),this},// Sets the value of a variable.
set:function(t,e){return this.block.push({op:"set",field:t,value:e}),this},// Restarts the current block.
restart:function(t){return this.block.push({op:"restart"}),this},// Waits for the specified duration.
wait:function(t){return this.block.push({op:"wait",duration:t}),this},// Sets the range of a variable.
range:function(t,e,n,s,r){return this.block.push({op:"range",started:!1,field:t,duration:e,startValue:n,endValue:s,easing:r||null}),this},// Generates a certain amount of random numbers in the given range (inclusive).
rand:function(t,e,n,s,r,a){return this.block.push({op:"rand",started:!1,field:t,duration:e,count:n,startValue:s,endValue:r,easing:a||null}),this},// Generates a certain amount of random numbers in the given range (inclusive). This uses a static random table to determine the next values.
randt:function(t,e,n,s,r,a){let o=[];for(let t=0;t<n;t++)o.push(t%(r-s+1)+s);for(let t=n>>2;t>0;t--){let t=~~(Math.random()*n),e=~~(Math.random()*n),s=o[e];o[e]=o[t],o[t]=s}return this.block.push({op:"randt",field:t,duration:e,count:n,startValue:s,endValue:r,table:o,easing:a||null}),this},// Plays a sound.
play:function(t){return this.block.push({op:"play",snd:t}),this},// Executes a function.
exec:function(t){return this.block.push({op:"exec",fn:t}),this}});var $b77ee20098523c74$export$2e2bcd8739ae039=$b77ee20098523c74$var$Anim,$f7bcc5a668e0670f$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-tabs",{/**
     * Container element for tab content.
     */container:null,/**
     * Active tab name.
     */activeTab:null,/**
    **	Element events.
    */"event click [data-name]":function(t){if(t.continuePropagation=!0,this.dataset.baseRoute){location="#"+$a60d7ab082450164$export$2e2bcd8739ae039.realLocation(this.dataset.baseRoute.replace("@",t.source.dataset.name));return}this.selectTab(t.source.dataset.name)},/**
    **	Initializes the Tabs element.
    */init:function(){this._routeHandler=(t,e)=>{""!=$a60d7ab082450164$export$2e2bcd8739ae039.location&&this.querySelectorAll("[href]").forEach(t=>{t.href&&($a60d7ab082450164$export$2e2bcd8739ae039.location.startsWith(t.href.substr(t.href.indexOf("#")+1))?(t.classList.add("is-active"),t.classList.remove("is-inactive")):(t.classList.add("is-inactive"),t.classList.remove("is-active")),t.classList.remove("anim-ended"),t.onanimationend=()=>{t.onanimationend=null,t.classList.add("anim-ended")})}),e.route.changed&&this.showTab(e.tabName)}},/**
    **	Executed when the children of the element are ready.
    */ready:function(){"container"in this.dataset?":previousElement"==this.dataset.container?this.container=this.previousElementSibling:":nextElement"==this.dataset.container?this.container=this.nextElementSibling:":none"==this.dataset.container?this.container=null:this.container=document.querySelector(this.dataset.container):this.container=this.nextElementSibling,this._hideTabsExcept(this.dataset.initial)},/**
    **	Adds a handler to Router if the data-base-route attribute was set.
    */onConnected:function(){this.dataset.baseRoute&&$a60d7ab082450164$export$2e2bcd8739ae039.addRoute(this.dataset.baseRoute.replace("@",":tabName"),this._routeHandler)},/**
    **	Removes a handler previously added to Router if the data-base-route attribute was set.
    */onDisconnected:function(){this.dataset.baseRoute&&$a60d7ab082450164$export$2e2bcd8739ae039.removeRoute(this.dataset.baseRoute.replace("@",":tabName"),this._routeHandler)},/**
    **	Hides all tabs except the one with the specified exceptName, if none specified then all tabs will be hidden (adds `.is-hidden` CSS class),
    **	additionally the respective link item in the tab definition will have class `.is-active`.
    */_hideTabsExcept:function(t){t||(t=""),null!=this.container&&this.container.querySelectorAll(":scope > [data-name]").forEach(e=>{e.dataset.name===t?(e.classList.remove("is-hidden"),this.dispatch("tabShown",{name:e.dataset.name,el:e})):(e.classList.add("is-hidden"),this.dispatch("tabHidden",{name:e.dataset.name,el:e}))}),this.querySelectorAll("[data-name]").forEach(e=>{e.dataset.name===t?(e.classList.add("is-active"),e.classList.remove("is-inactive")):(e.classList.add("is-inactive"),e.classList.remove("is-active")),e.classList.remove("anim-ended"),e.onanimationend=()=>{e.onanimationend=null,e.classList.add("anim-ended")}}),this.activeTab=t,this.dispatch("tabChanged",{name:t,el:this})},/**
    **	Shows the tab with the specified name, ignores `data-base-route` and current route as well.
    */showTab:function(t){return this._hideTabsExcept(t)},/**
    **	Shows a tab given its name. The route will be changed automatically if `data-base-route` is enabled.
    */selectTab:function(t){if(this.dataset.baseRoute){let e="#"+$a60d7ab082450164$export$2e2bcd8739ae039.realLocation(this.dataset.baseRoute.replace("@",t));if(location.hash!=e){location=e;return}}this.showTab(t)}}),$jNRwG=parcelRequire("jNRwG"),$fc9b87eb8eb33755$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-form",{/**
    **	Element events.
    */events:{"change [data-field]":"_fieldChanged","click input[type=reset]":"reset","click .reset":"reset","click input[type=submit]":"submit","click button[type=submit]":"submit","click .submit":"submit","submit form":"submit"},/*
    **	Initial form model.
    */model:{},/**
    **	Executed when the children of the element are ready.
    */ready:function(){let t=document.createElement("form");t.append(...this.childNodes),this.append(t);let e={},n=this.model.get();for(let t in this.querySelectorAll("[data-field]").forEach(t=>{t.name=t.dataset.field,n[t.name]=t.type;let s=t.dataset.default;if(void 0==s)switch(t.type){case"radio":if(!t.checked)return;s=t.value;break;case"checkbox":s=t.checked?"1":"0";break;case"field":s=t.getValue();break;default:s=""}e[t.dataset.field]=s}),n)t in e?n[t]=e[t]:n[t]="";e=n,this.model.defaults=e,this.model.reset(),this.clearMarkers()},/*
    **	Transforms an string returned by the server to a local representation.
    */filterString:function(t,e){return t&&"messages"in $parcel$global&&t.startsWith("@messages.")&&t.substr(10) in $parcel$global.messages&&(t=(0,$jNRwG.Template).eval($parcel$global.messages[t.substr(10)],e)),t},_change:function(t){if("createEvent"in document){let e=document.createEvent("HTMLEvents");e.initEvent("change",!1,!0),t.dispatchEvent(e)}else t.fireEvent("onchange")},_setField:function(t,e,n){if(t)for(t of this.querySelectorAll('[data-field="'+t+'"]'))switch(t.type||t.tagName.toLowerCase()){case"select":t.val=t.dataset.value=t.multiple&&e?e.split(","):e,t.value=t.val=t.dataset.value,!0!==n&&this._change(t);break;case"checkbox":t.checked=!!parseInt(e);break;case"radio":t.checked=e==t.value;break;case"field":t.val=t.dataset.value=e,t.setValue(e);break;case"file":e instanceof File||e instanceof Blob?(t.val=e,t.dataset.value=e):e instanceof FileList?(t.val=e,t.dataset.value=e):(t.val=t.dataset.value="",t.value="");break;default:t.val=t.dataset.value=e,t.value=e,!0!==n&&this._change(t)}},_getField:function(t,e=null,n=!1){if(!t)return null;if("string"!=typeof t){let s=null==t.value?t.val:t.value;switch(null===s&&(s=e),t.type||t.tagName.toLowerCase()){case"select":e=t.multiple&&s?s.join(","):s;break;case"checkbox":e=t.checked?"1":"0";break;case"radio":t.checked&&(e=t.value);break;case"field":e=t.getValue();break;case"file":e=n?t.files&&t.files.length?t.multiple?t.files:t.files[0]:null:t.val;break;default:e=s}return null===e?"":e}for(t of(e=null,this.querySelectorAll('[data-field="'+t+'"]')))e=this._getField(t,e);return null===e?"":e},getField:function(t){return this._getField(t)},clearMarkers:function(){this.classList.remove("busy"),this.querySelectorAll(".message").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll("span.field-error").forEach(t=>t.remove()),this.querySelectorAll(".field-error").forEach(t=>{t.classList.remove("field-error"),t.classList.remove("is-invalid")}),this.querySelectorAll(".field-passed").forEach(t=>t.classList.remove("field-passed"))},_fieldChanged:function(t){let e=t.source;"file"==e.type?this.model.set(e.dataset.field,this._getField(e,null,!0),!0):this.model.set(e.dataset.field,this._getField(e)),t.continuePropagation=!0},onModelPropertyChanged:function(t,e){this._setField(e.name,e.value)},_onSuccess:function(t){let e;this.classList.remove("busy"),this.clearMarkers(),this.dispatch("formSuccess",t),t.message&&null!=(e=this.querySelector(".message.success"))&&(e.innerHTML=this.filterString(t.message,t).replace(/\n/g,"<br/>"),e.classList.remove("is-hidden"),e.onanimationend=()=>e.classList.add("is-hidden"))},_onFailure:function(t){let e;if(this.classList.remove("busy"),this.clearMarkers(),this.dispatch("formError",t),t.fields){for(let e in t.fields){let n=this.querySelector('[data-field-container="'+e+'"]');if(!n&&!(n=this.querySelector('[data-field="'+e+'"]')))continue;let s=document.createElement("span");s.classList.add("field-error"),s.innerHTML=this.filterString(t.fields[e],t).replace(/\n/g,"<br/>"),n.classList.add("field-error"),n.classList.add("is-invalid"),"bottom"==this.dataset.errorsAt?n.parentElement.append(s):"top"==this.dataset.errorsAt?n.parentElement.prepend(s):n.parentElement.insertBefore(s,n.nextElementSibling),setTimeout(function(t){return function(){t.classList.add("active")}}(s),25)}t.error&&null!=(e=this.querySelector(".message.error"))&&(e.innerHTML=this.filterString(t.error,t).replace(/\n/g,"<br/>"),e.classList.remove("is-hidden"),e.onanimationend=()=>e.classList.add("is-hidden"))}else null!=(e=this.querySelector(".message.error"))&&(e.innerHTML=this.filterString(t.error,t).replace(/\n/g,"<br/>")||"Error: "+t.response,e.classList.remove("is-hidden"),e.onanimationend=()=>e.classList.add("is-hidden"))},reset:function(t){if(this.model.reset(t),this.clearMarkers(),!1===t)for(var e in this.model.data)this._setField(e,this.model.data[e],!0);return!1},submit:function(){if(this.classList.contains("busy"))return;let t={};"false"==this.dataset.strict&&Object.assign(t,this.model.get());let e={};this.querySelectorAll("[data-field]").forEach(t=>e[t.dataset.field]=!0),Object.keys(e).forEach(e=>t[e]=this._getField(e)),this.dispatch("beforeSubmit",t),this.model.set(t);let n=this.dataset.formAction||this.formAction;n&&(this.classList.add("busy"),"function"!=typeof n?(t.f=n,$7a42222fdfbd696d$export$2e2bcd8739ae039.apiCall(t,t=>this[200==t.response?"_onSuccess":"_onFailure"](t),t=>this._onFailure({error:"Unable to execute request."}),this.dataset.method??"POST")):n(t,t=>this[200==t.response?"_onSuccess":"_onFailure"](t)))}}),$0a5950960712be2b$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-panel",{/**
     * Route object used by this element.
     */route:null,/**
     * Initializes the element.
     */init:function(){this.style.display="",// Executed then the panel route is activated.
this._onActivate=(t,e)=>{e.route.changed&&this.show(!0)},// Executed then the panel route is deactivated.
this._onDeactivate=(t,e)=>{this.hide()},this.hide()},/**
     * Adds a handler to Router if the data-route attribute was set.
     */onConnected:function(){this.dataset.route?(this.route=$a60d7ab082450164$export$2e2bcd8739ae039.addRoute(this.dataset.route,this._onActivate,this._onDeactivate),this.classList.remove("is-active"),this.classList.add("is-inactive")):(this.classList.add("is-active"),this.classList.remove("is-inactive")),this.classList.add("anim-ended")},/**
     * Removes a handler previously added to Router if the data-route attribute was set.
     */onDisconnected:function(){this.dataset.route&&$a60d7ab082450164$export$2e2bcd8739ae039.removeRoute(this.dataset.route,this._onActivate,this._onDeactivate)},/**
     * Hides the panel by removing the `is-active` and adding `is-inactive` class to the element. Fires `panelHidden` event.
     */hide:function(){this.dispatch("panelHidden",this.route?this.route.args:{}),this.classList.remove("anim-ended"),this.classList.remove("is-active"),this.classList.add("is-inactive"),this.onanimationend=()=>{this.classList.add("anim-ended"),this.onanimationend=null}},/**
     * Shows the panel visible by adding `is-active` and removing `is-inactive` class from the element. If `silent` is true and `data-route` enabled,
     * the current route will not be updated. Fires `panelShown` event.
     * @param {boolean} silent 
     */show:function(t=!1){if(this.dataset.route&&!t){let t="#"+this.dataset.route;if(window.location.hash.substr(0,t.length)!=t){window.location=t;return}}this.dispatch("panelShown",this.route?this.route.args:{}),this.classList.remove("anim-ended"),this.classList.remove("is-inactive"),this.classList.add("is-active"),this.onanimationend=()=>{this.classList.add("anim-ended"),this.onanimationend=null}},/**
     * Toggles the visibility of the panel. If `silent` is true and `data-route` enabled, the current route will not be updated.
     */toggleVisibility:function(t=!1){this.classList.contains("is-active")?this.hide():this.show(t)}}),$jNRwG=parcelRequire("jNRwG"),/*
**	Connects to a ModelList and renders its contents using a template. When using "dynamic" template, the contents can be other custom elements, and
**	the model of each item can be accessed by using data-model=":list-item", which will cause the item model to be added to the element.
**
**	Additionally root attribute data-wrap can be set to 'true' to wrap the template contents inside a div with a data-iid representing the ID of the
**	item, this will cause any changes to items to affect only the specific item in question.
*/$aa6a6e90ef8dc4c8$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-list",{list:null,container:null,template:null,isEmpty:!1,isDynamicTemplate:!1,/**
    **	Executed when the children of the element are ready.
    */ready:function(){this.container=this.querySelector(this.dataset.container||".x-data"),this.container||(this.container=document.createElement("div"),this.container.className="x-data",this.appendChild(this.container));let t=this.template_elem=this.querySelector("template");t?("dynamic"!=t.dataset.mode?this.template=(0,$jNRwG.Template).compile(t.innerHTML):(this.template=()=>t.innerHTML,this.isDynamicTemplate=!0),t.remove()):this.template=()=>"",this.container.textContent=" ",this.setEmpty(null),this.setLoading(null)},/**
    **	Executed when the children of the element are ready.
    */rready:function(){let t=this.dataList??this.getFieldByPath(this.dataset.list);if(!t){this.dataset.list&&console.error("data-list not found: "+this.dataset.list);return}this.setList(t)},/*
    **	Indicates if the list is empty. Elements having x-empty, x-not-empty and x-empty-null will be updated.
    */setEmpty:function(t){this.isEmpty!==t&&(!0===t?(this.querySelectorAll(".x-empty").forEach(t=>t.classList.remove("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-empty-null").forEach(t=>t.classList.add("is-hidden"))):!1===t?(this.querySelectorAll(".x-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.remove("is-hidden")),this.querySelectorAll(".x-empty-null").forEach(t=>t.classList.add("is-hidden"))):(this.querySelectorAll(".x-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-empty-null").forEach(t=>t.classList.remove("is-hidden"))),this.isEmpty=t)},/*
    **	Indicates if the list is loading. Elements having is-loading will be updated.
    */setLoading:function(t){!0===t?this.querySelectorAll(".is-loading").forEach(t=>t.classList.remove("is-hidden")):this.querySelectorAll(".is-loading").forEach(t=>t.classList.add("is-hidden"))},/**
    **	Sets the list model-list of the element.
    */setList:function(t){t&&(0,$jNRwG.Rinn).isInstanceOf(t,$jNRwG.ModelList)&&this.list!==t&&(null!=this.list&&(this.list.dataSource&&this.list.dataSource.removeEventListener(this.eid+":*"),this.list.dataList&&this.list.dataList.removeEventListener(this.eid+":*"),this.list.removeEventListener(this.eid+":*")),this.list=t,this.list.dataSource&&(this.list.dataSource.addEventListener(this.eid+":listLoading",this.onLoading,this),this.list.dataSource.addEventListener(this.eid+":listLoaded",this.onLoaded,this)),this.list.dataList&&(this.list.dataList.addEventListener(this.eid+":listLoading",this.onLoading,this),this.list.dataList.addEventListener(this.eid+":listLoaded",this.onLoaded,this)),this.list.addEventListener(this.eid+":itemsCleared",this.onItemsCleared,this),this.list.addEventListener(this.eid+":itemsChanged",this.onItemsChanged,this),this.list.addEventListener(this.eid+":itemRemoved",this.onItemRemoved,this),this.list.addEventListener(this.eid+":itemChanged",this.onItemChanged,this),this.list.addEventListener(this.eid+":itemAdded",this.onItemAdded,this))},/*
    **	Builds an item (inside a div) to be added to the container.
    */buildItem:function(t,e,n=!1){if(this.content){let n=this.content(e.get(),e);return n.dataset.iid=t,n}if(this.container.content){let n=this.container.content(e.get(),e);return n.dataset.iid=t,n}let s=this.template(e.get());if(n)return s;let r=document.createElement("div");for(let n of(r.dataset.iid=t,r.innerHTML=s,r.querySelectorAll('[data-model=":list-item"]').forEach(t=>{t.model=e,t.dataset.model="this.model"}),this.template_elem.attributes))n.nodeName.startsWith("data-_")||"data-mode"==n.nodeName||r.setAttribute(n.nodeName,n.nodeValue);return r},/*
    **	Executed when the list is loading.
    */onLoading:function(){this.setLoading(!0)},/*
    **	Executed when the list finished loading.
    */onLoaded:function(){this.setLoading(!1)},/*
    **	Executed when the list is cleared.
    */onItemsCleared:function(){this.container._timeout=setTimeout(()=>{this.setEmpty(!0),this.container._timeout=null,this.container.textContent=""},300)},/*
    **	Executed when the items of the list changed.
    */onItemsChanged:function(){if(0==this.list.length())return;this.container._timeout&&clearTimeout(this.container._timeout),this.container._timeout=null,this.container.textContent="";let t=0;for(let e of this.list.getData())"false"!=this.dataset.wrap?this.container.append(this.buildItem(this.list.itemId[t++],e)):this.container.innerHTML+=this.buildItem(this.list.itemId[t++],e,!0);this.setEmpty(0==t)},/*
    **	Executed when an item is removed from the list.
    */onItemRemoved:function(t,e){if("false"==this.dataset.wrap){this.onItemsChanged();return}let n=this.container.querySelector('[data-iid="'+e.id+'"]');n&&(n.remove(),this.setEmpty(0==this.list.length()))},/*
    **	Executed when an item changes.
    */onItemChanged:function(t,e){if(this.isDynamicTemplate)return;if("false"==this.dataset.wrap){this.onItemsChanged();return}let n=this.container.querySelector('[data-iid="'+e.id+'"]');n&&(n.innerHTML=this.template(e.item))},/*
    **	Executed when an item is added to the list.
    */onItemAdded:function(t,e){"head"==e.position?"false"!=this.dataset.wrap?this.container.prepend(this.buildItem(e.id,e.item)):this.container.innerHTML=this.buildItem(e.id,e.item,!0)+this.container.innerHTML:"false"!=this.dataset.wrap?this.container.append(this.buildItem(e.id,e.item)):this.container.innerHTML+=this.buildItem(e.id,e.item,!0),this.setEmpty(!1)},/**
     * 	Forces re-rendering of the element.
     */refresh:function(){this.onItemsChanged()}}),$6ebf9e92cac4cb5e$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-item",{/**
    **	Initializes the element.
    */init:function(){},/**
    **	Executed when the children and root are ready.
    */rready:function(){let t=this.dataModel??this.getFieldByPath(this.dataset.model);t||(t={}),this.setModel(t)}}),$jNRwG=parcelRequire("jNRwG"),/*
**	Connects to a data source to provide pagination features.
*/$9fd4b08f8abedc01$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-paginator",{source:null,template:null,/**
    **	Initializes the element.
    */init:function(){this.setModel({offsetStart:0,offsetEnd:0,count:0,offset:0,currentPageSize:this.dataset.pageSize||25,pageSize:this.dataset.pageSize||25}),this.listen("propertyChanged.pageSize",(t,e)=>{this.model.get("currentPageSize")!=e.value&&(this.model.set("currentPageSize",e.value),this.updateOffset("range"))})},rready:function(){let t=this.dataSource??this.getFieldByPath(this.dataset.source);if(!t){this.dataset.source&&console.error("data-source not found: "+this.dataset.source);return}this.setSource(t)},/**
    **	Sets the source model-list of the paginator.
    */setSource:function(t){t&&(0,$jNRwG.Rinn).isInstanceOf(t,$80620d99b03812be$export$2e2bcd8739ae039)&&this.source!==t&&(null!=this.source&&(this.source.removeEventListener(this.eid+":*"),this.source.includeCount=!1),this.source=t,this.source.includeCount=!0,this.updateOffset(),this.source.addEventListener(this.eid+":requestPropertyChanged",this.onRequestPropertyChanged,this),this.source.addEventListener(this.eid+":countChanged",this.onCountChanged,this),this.source.addEventListener(this.eid+":listItemRemoved",this.onItemRemoved,this),this.source.addEventListener(this.eid+":listItemAdded",this.onItemAdded,this),this.source.setNamespace(this.eid),this.source.request.update(!0),this.source.setNamespace(null))},/*
    **	Updates several offset related fields in the paginator model. Optionally refreshes the data source with the specified mode.
    */updateOffset:function(t=null){this.model.set("offsetStart",0!=this.model.get("count")?this.model.get("offset")+1:0),this.model.set("offsetEnd",Math.min(this.model.get("count"),this.model.get("offsetStart")+this.model.getInt("pageSize")-1)),this.model.update("count");let e=this.source.request.get("count"),n=this.source.request.get("offset");this.source.request.set("count",this.model.getInt("pageSize")),this.source.request.set("offset",this.model.get("offset")),t&&(e!=this.source.request.get("count")||n!=this.source.request.get("offset"))&&this.source.refresh(t)},/*
    **	Event handler invoked when a property of the source request changes. The property is copied to the local model.
    */onRequestPropertyChanged:function(t,e){"count"!=e.name&&"offset"!=e.name&&this.model.set(e.name,e.value)},/*
    **	Event handler invoked when a property of the model has changed. The property is copied to the data source request model.
    */onModelPropertyChanged:function(t,e){-1==["offsetStart","offsetEnd","count","offset","currentPageSize","pageSize"].indexOf(e.name)&&this.source.request.get(e.name)!=e.value&&(this.source.request.set(e.name,e.value),this.source.refresh("filter"))},/*
    **	Executed when the remote count changes.
    */onCountChanged:function(t,e){this.model.set("count",t.source.count,!1),this.updateOffset()},/*
    **	Executed when an item is removed from the list.
    */onItemRemoved:function(t,e){this.model.set("count",this.model.getInt("count")-1,!1),this.updateOffset()},/*
    **	Executed when an item is added to the list.
    */onItemAdded:function(t,e){this.model.set("count",this.model.getInt("count")+1,!1),this.updateOffset()},/*
    **	Moves to the previous page.
    */prevPage:function(){if(0>=this.model.get("offset"))return;let t=this.model.get("offset")-this.model.getInt("pageSize");t<0&&(t=0),this.model.set("offset",t),this.updateOffset("range")},/*
    **	Moves to the next page.
    */nextPage:function(){let t=this.model.get("offset")+this.model.getInt("pageSize");t>=this.model.get("count")||(this.model.set("offset",t),this.updateOffset("range"))},/*
    **	Moves to the first page.
    */firstPage:function(){this.model.set("offset",0),this.updateOffset("range")},/*
    **	Moves to the last page.
    */lastPage:function(){let t=this.model.get("count")-this.model.getInt("pageSize");t<0&&(t=0),this.model.set("offset",t),this.updateOffset("range")},/*
    **	Refreshes the data source.
    */refresh:function(){this.source.refresh("full")},/*
    **	Clears (set to empty) the specified fields from the data source's request parameters.
    */clear:function(t){for(let e=0;e<t.length;e++)this.model.set(t[e],"")}}),$jNRwG=parcelRequire("jNRwG"),/*
**	Connects to a DataSource and renders its contents as a table.
*/$0eddb6c9ad6478b4$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-table",{source:null,template:null,container:null,isEmpty:null,/**
    **	Initializes the element.
    */init:function(){this.setModel({})},/**
    **	Executed when the children of the element are ready.
    */ready:function(){if(this.container=this.querySelector(this.dataset.container||"tbody.x-data"),!this.container)throw Error("r-table requires a container");"dynamic"!=this.container.dataset.mode?this.template=(0,$jNRwG.Template).compile(this.container.innerHTML):this.template=()=>this.container.innerHTML,this.temporalBody=document.createElement("tbody"),this.container.textContent=" ",this.setEmpty(!0)},/**
    **	Executed when the children and root elements are ready.
    */rready:function(){let t=this.dataSource??this.getFieldByPath(this.dataset.source);if(!t){this.dataset.source&&console.error("data-source not found: "+this.dataset.source);return}this.setSource(t)},/*
    **	Indicates if the table is empty. Elements having .x-not-empty will be hidden.
    */setEmpty:function(t){this.isEmpty!==t&&(t?(this.querySelectorAll(".x-empty").forEach(t=>t.classList.remove("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.add("is-hidden"))):(this.querySelectorAll(".x-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.remove("is-hidden"))),this.isEmpty=t)},/**
    **	Sets the data source of the element.
    */setSource:function(t){t&&(0,$jNRwG.Rinn).isInstanceOf(t,$80620d99b03812be$export$2e2bcd8739ae039)&&this.source!==t&&(null!=this.source&&this.source.removeEventListener(this.eid+":*"),this.source=t,this.source.addEventListener(this.eid+":requestPropertyChanged",this.onRequestPropertyChanged,this),this.source.addEventListener(this.eid+":listItemsCleared",this.onItemsCleared,this),this.source.addEventListener(this.eid+":listItemsChanged",this.onItemsChanged,this),this.source.addEventListener(this.eid+":listItemRemoved",this.onItemRemoved,this),this.source.addEventListener(this.eid+":listItemChanged",this.onItemChanged,this),this.source.addEventListener(this.eid+":listItemAdded",this.onItemAdded,this),this.source.setNamespace(this.eid),this.source.request.update(!0),this.source.setNamespace(null))},/*
    **	Event handler invoked when a property of the source request changes. The property is copied to the local model.
    */onRequestPropertyChanged:function(t,e){if(this.model.set(e.name,e.value),"sort"==e.name)this.querySelectorAll("thead [data-sort]").forEach(t=>t.dataset.order="");else if("order"==e.name){let n=this.querySelector('thead [data-sort="'+t.source.get("sort")+'"]');n&&(n.dataset.order=e.value)}},/*
    **	Event handler invoked when a property of the model has changed. The property is copied to the data source request model.
    */onModelPropertyChanged:function(t,e){this.source.request.get(e.name)!=e.value&&(this.source.request.set(e.name,e.value),-1==["count","offset"].indexOf(e.name)&&this.source.refresh("filter"))},/*
    **	Event handler invoked when a property of the model is removed.
    */onModelPropertyRemoved:function(t,e){"string"==typeof e.fields?this.source.request.remove(i):e.fields.forEach(t=>this.source.request.remove(t)),this.source.refresh("filter")},/*
    **	Builds an item to be added to the container.
    */buildItem:function(t,e){if(this.container.content){let n=this.container.content(e.get(),e);return n.dataset.iid=t,n}let n=this.temporalBody;return n.innerHTML=this.template(e.get()),n.querySelectorAll('[data-model=":list-item"]').forEach(t=>{t.model=e,t.dataset.model="this.model"}),(n=n.firstElementChild).dataset.iid=t,n},/*
    **	Executed when the list is cleared.
    */onItemsCleared:function(t,e){this.container._timeout=setTimeout(()=>{this.setEmpty(!0),this.container._timeout=null,this.container.textContent=""},300)},/*
    **	Executed when the items of the list changed.
    */onItemsChanged:function(t,e){if(0==this.source.list.length())return;this.container._timeout&&clearTimeout(this.container._timeout),this.container._timeout=null,this.container.textContent="";let n=0;for(let t of this.source.list.getData())this.container.append(this.buildItem(this.source.list.itemId[n++],t));this.setEmpty(0==n)},/*
    **	Executed when an item is removed from the list.
    */onItemRemoved:function(t,e){let n=this.container.querySelector('[data-iid="'+e.id+'"]');n&&(n.remove(),this.setEmpty(0==this.source.list.length()))},/*
    **	Executed when an item changes.
    */onItemChanged:function(t,e){let n=this.container.querySelector('[data-iid="'+e.id+'"]');if(!n)return;let s=this.buildItem(e.id,e.item);this.container.replaceChild(s,n)},/*
    **	Executed when an item is added to the list.
    */onItemAdded:function(t,e){"head"==e.position?this.container.prepend(this.buildItem(e.id,e.item)):this.container.append(this.buildItem(e.id,e.item)),this.setEmpty(!1)},/*
    **	Handles clicks to data-sort elements.
    */"event click thead [data-sort]":function(t,e){this.source.request.get("sort")==t.source.dataset.sort?this.source.request.set("order","asc"==this.source.request.get("order")?"desc":"asc"):(this.source.request.set("sort",t.source.dataset.sort),this.source.request.set("order","asc",!0)),this.source.refresh("order")},/*
    **	Refreshes the data source.
    */refresh:function(){this.source.refresh("full")},/*
    **	Clears (set to empty) the specified fields from the data source's request parameters.
    */clear:function(t){for(let e=0;e<t.length;e++)this.model.set(t[e],"")}}),$jNRwG=parcelRequire("jNRwG"),/*
**	Connects to a ModelList and renders its contents as a <select> element.
*/$b31b5ad1048f6f9a$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-select",{list:null,container:null,value:"",/**
    **	Initializes the element.
    */init:function(){this.container=document.createElement("select"),this.parentElement.insertBefore(this.container,this);let t=[];for(let e of this.attributes)e.nodeName.startsWith("data-_")||"data-list"==e.nodeName||"data-blank"==e.nodeName||(this.container.setAttribute(e.nodeName,e.nodeValue),t.push(e.nodeName));this.disabled&&(this.container.disabled=this.disabled),t.forEach(t=>this.removeAttribute(t)),this.textContent=" ",this.style.display="none"},/**
    **	Executed when the children and parent of the element are ready.
    */rready:function(){let t=this.dataList??this.getFieldByPath(this.dataset.list);if(!t){this.dataset.list&&console.error("data-list not found: "+this.dataset.list);return}this.setList(t),this.parentElement.lastElementChild!==this&&this.parentElement.append(this)},/**
    **	Sets the list model-list of the element.
    */setList:function(t){t&&(0,$jNRwG.Rinn).isInstanceOf(t,$jNRwG.ModelList)&&this.list!==t&&(null!=this.list&&this.list.removeEventListener(this.eid+":*"),this.list=t,this.list.dataSource&&(this.list.dataSource.includeEnum=!0),this.list.addEventListener(this.eid+":itemsCleared",this.onItemsCleared,this),this.list.addEventListener(this.eid+":itemsChanged",this.onItemsChanged,this),this.list.addEventListener(this.eid+":itemRemoved",this.onItemsChanged,this),this.list.addEventListener(this.eid+":itemChanged",this.onItemsChanged,this),this.list.addEventListener(this.eid+":itemAdded",this.onItemsChanged,this),this.onItemsChanged())},/*
    **	Executed when the list is cleared.
    */onItemsCleared:function(t,e){this.container.textContent=""},/*
    **	Executed when the items of the list changed.
    */onItemsChanged:function(t,e){if(0==this.list.length())return;let n=this.list.getData(),s,r,a="";if(n[0].has("value")?s="value":n[0].has("id")&&(s="id"),n[0].has("label")?r="label":n[0].has("name")&&(r="name"),"blank"in this.dataset&&(a+='<option value="">'+this.dataset.blank+"</option>"),n[0].has("group")){let t={};for(let e in n.forEach(e=>t[e.get("group")]=null),t)t[e]={name:e,list:[]};n.forEach(e=>t[e.get("group")].list.push(e)),(t=Object.values(t)).forEach(t=>{a+='<optgroup label="'+t.name+'">',t.list.forEach(t=>a+='<option value="'+t.get(s)+'">'+t.get(r)+"</option>"),a+="</optgroup>"})}else n.forEach(t=>a+='<option value="'+t.get(s)+'">'+t.get(r)+"</option>");this.container.innerHTML=a,this.container.value=this.container.dataset.value},/**
     * 	Forces re-rendering of the element.
     */refresh:function(){this.onItemsChanged()}});/*
    <r-image-cropper>
    </r-image-cropper>
*/let $56b80282f7eea6ac$var$Utils={/**
     * Forces the browser to show a download dialog.
     * @param {string} filename
     * @param {string} url
     */showDownload:function(t,e){let n=document.createElement("a");n.href=e,n.style.display="none",n.download=t,n.target="_blank",document.body.appendChild(n),n.click(),document.body.removeChild(n)},/**
     * Forces the browser to show a file selection dialog.
     * @param {boolean} allowMultiple
     * @param {string} accept 
     * @param {function(File[])} callback 
     */showFilePicker:function(t,e,n){let s=document.createElement("input");s.type="file",s.accept=e,s.style.display="none",s.multiple=t,document.body.appendChild(s),s.onchange=function(){n(s.files)},document.body.onfocus=function(){document.body.onfocus=null,document.body.removeChild(s)},s.click()},/**
     * Loads a file or blob and returns the content as a dataURL.
     * @param {File|Blob} file
     * @param {function(string)} callback
     */loadAsDataUrl:function(t,e){let n=new FileReader;n.onload=function(t){e(t.target.result,null)},n.onerror=function(t){e(null,t)},n.readAsDataURL(t)},/**
     * Loads a file or blob and returns the content as text.
     * @param {File|Blob} file
     * @param {function(string)} callback
     */loadAsText:function(t,e){let n=new FileReader;n.onload=function(t){e(t.target.result)},n.readAsText(t)},/**
     * Loads a file or blob and returns the content as array buffer.
     * @param {File|Blob} file
     * @param {function(ArrayBuffer)} callback
     */loadAsArrayBuffer:function(t,e){let n=new FileReader;n.onload=function(t){e(t.target.result)},n.readAsArrayBuffer(t)},/**
     * Loads a list of files or blobs and returns the content as dataURLs.
     * @param {Array<File|Blob>} fileList
     * @param {function([{ name:string, size:number, url:string }])} callback
     */loadAllAsDataUrl:function(t,e){let n=[];if(!t||!t.length){e(n);return}let s=function(r){if(r==t.length){e(n);return}$56b80282f7eea6ac$var$Utils.loadAsDataUrl(t[r],function(e,a){a||n.push({name:t[r].name,size:t[r].size,url:e}),s(r+1)})};s(0)},/**
     * Loads an image from a url and returns it as an Image object.
     * @param {string} url
     * @param {function(Image)} callback
     */loadImageFromUrl:function(t,e){let n=new Image;n.onload=()=>e(n),n.onerror=()=>e(null),n.src=t}};var $56b80282f7eea6ac$export$2e2bcd8739ae039=$56b80282f7eea6ac$var$Utils,$518ecafe6bac0ac2$export$2e2bcd8739ae039=$a5c21812244207c8$export$2e2bcd8739ae039.register("r-image-cropper",{/*
    **	Default aspect ratio.
    */aspectRatio:1,/*
    **	Current image scale.
    */imageScale0:0,imageScale:1,/*
    **	Image translation offsets.
    */imageOffsX:0,imageOffsY:0,/*
    **	Pointer contexts.
    */pointerA:null,pointerB:null,/*
    **	Client bounding box.
    */bounds:null,/*
    **	Initializes the element.
    */init:function(){this.canvas=document.createElement("canvas"),this.appendChild(this.canvas),this.g=this.canvas.getContext("2d"),this.pointerA={id:null,active:!1,sx:0,sy:0,cx:0,cy:0,ix:0,iy:0},this.pointerB={id:null,active:!1,sx:0,sy:0,cx:0,cy:0,ix:0,iy:0},this.log=document.createElement("div"),this.appendChild(this.log)},/*
    **	Sets the image for the cropper from an image URL.
    */setImageUrl:function(t){$56b80282f7eea6ac$export$2e2bcd8739ae039.loadImageFromUrl(t,t=>{this.setImage(t)})},/*
    **	Sets the image for the cropper from an HTML File object.
    */setImageFile:function(t){$56b80282f7eea6ac$export$2e2bcd8739ae039.loadAsDataUrl(t,t=>{$56b80282f7eea6ac$export$2e2bcd8739ae039.loadImageFromUrl(t,t=>{this.setImage(t)})})},/*
    **	Sets the cropper image from an HTML Image element.
    */setImage:function(t){this.image=t,this.reset(),this.imageScale=Math.max(this.canvas.width/this.image.width,this.canvas.height/this.image.height),this.imageOffsX=(this.canvas.width-this.imageScale*this.image.width)*.5,this.imageOffsY=(this.canvas.height-this.imageScale*this.image.height)*.5,this.render()},/*
    **	Returns the blob and URL representing the current canvas state.
    */getBlobAndUrl:function(t,e="image/png",n=.9){this.canvas.toBlob(e=>{t(e,URL.createObjectURL(e))},e,n)},/*
    **	Auto-resizes the canvas to ensure the aspect ratio is maintained.
    */reset:function(){this.bounds=this.getBoundingClientRect(),this.canvas.width=this.bounds.width,this.canvas.height=this.bounds.width/this.aspectRatio},/*
    **	Auto-resizes the canvas to ensure the aspect ratio is maintained and renders the image.
    */render:function(){this.canvas.width=this.canvas.width,this.g.fillStyle="#000",this.g.beginPath(),this.g.rect(0,0,this.canvas.width,this.canvas.height),this.g.fill(),this.g.translate(this.imageOffsX,this.imageOffsY),this.g.scale(this.imageScale,this.imageScale),this.g.drawImage(this.image,0,0)},/*
    **	Translates the image by the given offsets.
    */translateImage:function(t,e){this.imageOffsX+=t,this.imageOffsY+=e,this.render(!0)},/*
    **	Handle mouse events on the canvas.
    */"event mousemove canvas":function(t){this.pointerA.active&&(this.pointerA.cx=t.clientX,this.pointerA.cy=t.clientY,this.translateImage(this.pointerA.cx-this.pointerA.sx,this.pointerA.cy-this.pointerA.sy),this.pointerA.sx=this.pointerA.cx,this.pointerA.sy=this.pointerA.cy),this.pointerA.ix=(t.clientX-this.bounds.left-this.imageOffsX)/this.imageScale,this.pointerA.iy=(t.clientY-this.bounds.top-this.imageOffsY)/this.imageScale},"event mousedown canvas":function(t){this.pointerA.active=!0,this.pointerA.sx=t.clientX,this.pointerA.sy=t.clientY},"event mouseup canvas":function(t){this.pointerA.active=!1},"event wheel canvas":function(t){t.deltaY>0?this.imageScale-=.045:this.imageScale+=.045,this.imageScale<.1&&(this.imageScale=.1),this.imageOffsX+=-this.pointerA.ix*this.imageScale+(t.clientX-this.bounds.left)-this.imageOffsX,this.imageOffsY+=-this.pointerA.iy*this.imageScale+(t.clientY-this.bounds.top)-this.imageOffsY,this.render()},/*
    **	Handle touch events on the canvas.
    */"event touchmove canvas":function(t){for(let e of t.changedTouches)this.pointerA.id==e.identifier?(this.pointerA.cx=e.clientX,this.pointerA.cy=e.clientY):this.pointerB.id==e.identifier&&(this.pointerB.cx=e.clientX,this.pointerB.cy=e.clientY);if(this.pointerA.active&&this.pointerB.active){let t=Math.sqrt(Math.pow(this.pointerA.sx-this.pointerB.sx,2)+Math.pow(this.pointerA.sy-this.pointerB.sy,2)),e=Math.sqrt(Math.pow(this.pointerA.cx-this.pointerB.cx,2)+Math.pow(this.pointerA.cy-this.pointerB.cy,2))-t;this.imageScale+=e/10*.025,this.imageScale<.1&&(this.imageScale=.1),this.imageOffsX+=-this.pointerA.ix*this.imageScale+(this.pointerA.cx-this.bounds.left)-this.imageOffsX,this.imageOffsY+=-this.pointerA.iy*this.imageScale+(this.pointerA.cy-this.bounds.top)-this.imageOffsY,this.pointerA.sx=this.pointerA.cx,this.pointerA.sy=this.pointerA.cy,this.pointerB.sx=this.pointerB.cx,this.pointerB.sy=this.pointerB.cy,this.render()}else{let t=this.pointerA.active?this.pointerA:this.pointerB.active?this.pointerB:null;if(!t)return;this.translateImage(t.cx-t.sx,t.cy-t.sy),t.sx=t.cx,t.sy=t.cy}},"event touchstart canvas":function(t){for(let e of(this.imageScale0=this.imageScale,t.changedTouches))null===this.pointerA.id?(this.pointerA.id=e.identifier,this.pointerA.active=!0,this.pointerA.sx=e.clientX,this.pointerA.sy=e.clientY,this.pointerA.ix=(e.clientX-this.bounds.left-this.imageOffsX)/this.imageScale,this.pointerA.iy=(e.clientY-this.bounds.top-this.imageOffsY)/this.imageScale):null===this.pointerB.id&&(this.pointerB.id=e.identifier,this.pointerB.active=!0,this.pointerB.sx=e.clientX,this.pointerB.sy=e.clientY,this.pointerB.ix=(e.clientX-this.bounds.left-this.imageOffsX)/this.imageScale,this.pointerB.iy=(e.clientY-this.bounds.top-this.imageOffsY)/this.imageScale)},"event touchend canvas":function(t){for(let e of t.changedTouches)this.pointerA.id==e.identifier?(this.pointerA.id=null,this.pointerA.active=!1):this.pointerB.id==e.identifier&&(this.pointerB.id=null,this.pointerB.active=!1)},"event touchcancel canvas":function(t){for(let e of t.changedTouches)this.pointerA.id==e.identifier?(this.pointerA.id=null,this.pointerA.active=!1):this.pointerB.id==e.identifier&&(this.pointerB.id=null,this.pointerB.active=!1)}}),$71bc70b9c4af45f1$export$2e2bcd8739ae039={Tabs:$f7bcc5a668e0670f$export$2e2bcd8739ae039,Form:$fc9b87eb8eb33755$export$2e2bcd8739ae039,Panel:$0a5950960712be2b$export$2e2bcd8739ae039,List:$aa6a6e90ef8dc4c8$export$2e2bcd8739ae039,Item:$6ebf9e92cac4cb5e$export$2e2bcd8739ae039,Paginator:$9fd4b08f8abedc01$export$2e2bcd8739ae039,Table:$0eddb6c9ad6478b4$export$2e2bcd8739ae039,Select:$b31b5ad1048f6f9a$export$2e2bcd8739ae039,ImageCropper:$518ecafe6bac0ac2$export$2e2bcd8739ae039},$jNRwG=parcelRequire("jNRwG"),$2adc75ff92895237$export$2e2bcd8739ae039//!/class
={/**
	 * Database connection.
	 */db:null,/**
	 * Initializes the database connection.
	 * @param {string} dbName
	 * @param {number} version
	 * @param {(db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void} upgradeCallback
	 * @returns {Promise<void>}
	 * !static init (dbName: string, version: number, upgradeCallback: (db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void) : Promise<void>;
	 */init:function(t,e,n){return new Promise((s,r)=>{if(!$parcel$global.indexedDB){r("IndexedDB is not available in your system.");return}let a=indexedDB.open(t,e);a.onerror=t=>{let e=t.target.error+"";-1!==e.indexOf("AbortError")&&(e="\n"+a.message),r("Unable to open database: "+e)},a.onupgradeneeded=async t=>{try{let e=t.target.result,s=t.target.transaction;t.oldVersion<1&&e.createObjectStore("system",{keyPath:["name"]}),await n(e,s,t.oldVersion)}catch(t){a.message=t.message,a.transaction.abort()}},a.onsuccess=async t=>{this.db=t.target.result,s()}})},/**
	 * Ensures the database is ready to be used, or throws an exception.
	 */ensureConnected:function(){this.db||alert("Error: Database not initialized.")},/**
	 * Returns an index object for later use with methods that accept an IDBIndex in the `storeName` parameter.
	 * @param {string} storeName
	 * @param {string} indexName
	 * @returns {IDBIndex}
	 * !static index (storeName: string, indexName: string) : IDBIndex;
	 */index:function(t,e){this.ensureConnected();let n=this.db.transaction(t,"readwrite").objectStore(t).index(e);if(!n)throw Error("Unable to find index `"+e+"` in store "+t);return n},/**
	 * Runs a callback for each record in a data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string} id
	 * @param { (value:object, cursor:IDBCursor) => Promise<boolean> } callback
	 * @returns {Promise<void>}
	 * !static forEach (storeName: string|IDBIndex|IDBObjectStore, id: string, callback: (value:object, cursor:IDBCursor) => Promise<boolean>) : Promise<void>;
	 */forEach:function(t,e,n){return this.ensureConnected(),"function"==typeof e&&(n=e,e=null),new Promise(async(s,r)=>{let a,o;o="string"==typeof t?this.db.transaction(t,"readwrite").objectStore(t):t,(a=null===e?o.openCursor():o.openCursor(e)).onsuccess=async t=>{let e=t.target.result;if(!e||!1===await n(e.value,e)){s();return}e.continue()},a.onerror=t=>{r(t.target.error)}})},/**
	 * Returns the count of all records from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @returns {Promise<number>}
	 * !static count (storeName: string|IDBIndex|IDBObjectStore) : Promise<number>;
	 */count:function(t){return this.ensureConnected(),new Promise((e,n)=>{let s;let r=(s="string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).count();r.onsuccess=t=>{e(t.target.result)},r.onerror=t=>{n(t.target.error)}})},/**
	 * Returns all records from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<object>>}
	 * !static getAll (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;
	 */getAll:function(t,e=null){return this.ensureConnected(),new Promise((n,s)=>{let r;let a=(r="string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).getAll(e);a.onsuccess=t=>{n(t.target.result)},a.onerror=t=>{s(t.target.error)}})},/**
	 * Returns all keys from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<string|number|Array<string|number>>>}
	 * !static getAllKeys (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;
	 */getAllKeys:function(t,e=null){return this.ensureConnected(),new Promise((n,s)=>{let r;let a=(r="string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).getAllKeys(e);a.onsuccess=t=>{n(t.target.result)},a.onerror=t=>{s(t.target.error)}})},/**
	 * Loads a list of records having unique values from the specified data store and returns the entire object or just the specified field.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string} [field]
	 * @returns {Promise<Array<number|string|object>>}
	 * !static getAllUnique (storeName: string|IDBIndex|IDBObjectStore) : Promise<Array<number|string|object>>;
	 */getAllUnique:function(t,e=null){return this.ensureConnected(),new Promise((n,s)=>{let r;let a=(r="string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).openCursor(null,"nextunique"),o=[];a.onsuccess=t=>{let s=t.target.result;if(!s){n(o);return}o.push(e?s.value[e]:s.value),s.continue()},a.onerror=t=>{s(t.target.error)}})},/**
	 * Returns a single record from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<object>}
	 * !static get (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<object>;
	 */get:function(t,e){return this.ensureConnected(),new Promise((n,s)=>{let r;let a=(r="string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).get(e);a.onsuccess=t=>{n(t.target.result||null)},a.onerror=t=>{s(t.target.error)}})},/**
	 * Adds or overwrites a record in the specified data store (data must include the primary key).
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 * !static put (storeName: string, data: object) : Promise<void>;
	 */put:function(t,e){return this.ensureConnected(),new Promise((n,s)=>{let r=this.db.transaction(t,"readwrite").objectStore(t).put(e);r.onsuccess=t=>{n()},r.onerror=t=>{s(t.target.error)}})},/**
	 * Returns a variable from the system table.
	 * @param {string} name - Name of the property to read.
	 * @param {boolean} full - When `true` the entire object will be returned.
	 * @returns {any}
	 * !static sysGet (name: string, full?: boolean) : any;
	 */sysGet:async function(t,e=!1){let n=await this.get("system",[t]);return n?e?n:n.value:null},/**
	 * Writes a variable to the system table.
	 * @param {string} name - Name of the property to write.
	 * @param {any} value - Value to write.
	 * @param {boolean} full - When `true` the entire value will be written as-is.
	 * @returns {void}
	 * !static sysPut (name: string, value: any, full?: boolean) : void;
	 */sysPut:async function(t,e,n=!1){n?(e.name=t,await this.put("system",e)):await this.put("system",{name:t,value:e})},/**
	 * Returns a single record from the specified data store that matches the `partial` object and does NOT match the `notPartial` object.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {object} [partial]
	 * @param {object} [notPartial]
	 * @returns {Promise<object>}
	 * !static findOne (storeName: string|IDBIndex|IDBObjectStore, partial?: object, notPartial?: object) : Promise<object>;
	 */findOne:function(t,e=null,n=null){return this.ensureConnected(),new Promise((s,r)=>{let a;let o=(a="string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).openCursor();o.onsuccess=t=>{let r=t.target.result;if(!r){s(null);return}if(null===e||(0,$jNRwG.Rinn).partialCompare(r.value,e)){if(null!==n&&(0,$jNRwG.Rinn).partialCompare(r.value,n)){r.continue();return}s(r.value);return}r.continue()},o.onerror=t=>{r(t.target.error)}})},/**
	 * Deletes a record from the specified data store.
	 * @param {string} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 * !static delete (storeName: string, id: string|number|Array<string|number>) : Promise<void>;
	 */delete:function(t,e){return this.ensureConnected(),new Promise((n,s)=>{let r=this.db.transaction(t,"readwrite").objectStore(t).delete(e);r.onsuccess=t=>{n()},r.onerror=t=>{s(t.target.error)}})},/**
	 * Deletes all items in the specified store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 * !static deleteAll (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<void>;
	 */deleteAll:function(t,e=null){return this.forEach(t,e,async(t,e)=>{await e.delete()})},/**
	 * Inserts a new record in the specified data store.
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 * !static insert (storeName: string, data: object) : Promise<void>;
	 */insert:function(t,e){return this.ensureConnected(),new Promise((n,s)=>{let r=this.db.transaction(t,"readwrite").objectStore(t).add(e);r.onsuccess=t=>{n()},r.onerror=t=>{s(t.target.error)}})}};let $9cc6605c70fa70bc$var$geo={E_NONE:0,E_PERMISSION_DENIED:32769,E_POSITION_UNAVAILABLE:32770,E_TIMEOUT:32771,E_UNSUPPORTED:32772,E_UNKNOWN:32777,supported:null,status:null,indicatorOn:function(){$parcel$global.document.documentElement.classList.add("busy-geo")},indicatorOff:function(){$parcel$global.document.documentElement.classList.remove("busy-geo")},/**
     * Initializes the geolocation interface. Returns boolean indicating whether geolocation
     * is supported on the device.
     * @returns {boolean}
     */init:function(){return this.supported=!!navigator.geolocation,this.supported},/**
     * Single-shot positioning operation.
     * @returns {Promise<{  }>}
     */getCurrentPosition:function(){null===this.supported&&this.init();let t=this.status={cancelled:!1};return new Promise(async(e,n)=>{if(this.indicatorOn(),!this.supported){this.status===t&&(this.status=null),t.cancelled||this.indicatorOff(),n({status:t,code:$9cc6605c70fa70bc$var$geo.E_UNSUPPORTED,message:"Geolocation is not supported on this device."});return}navigator.geolocation.getCurrentPosition(n=>{this.status===t&&(this.status=null),t.cancelled||this.indicatorOff(),n.status=t,e(n)},e=>{let s;switch(this.status===t&&(this.status=null),t.cancelled||this.indicatorOff(),e.code){case 1:s=$9cc6605c70fa70bc$var$geo.E_PERMISSION_DENIED;break;case 2:s=$9cc6605c70fa70bc$var$geo.E_POSITION_UNAVAILABLE;break;case 3:s=$9cc6605c70fa70bc$var$geo.E_TIMEOUT;break;default:s=$9cc6605c70fa70bc$var$geo.E_UNKNOWN,e.message="Unable to get the current location."}n({status:t,code:s,message:e.message})},{enableHighAccuracy:!0})})},/**
     * Cancels the active positioning operation (if any).
     */cancel:function(){null!==this.status&&(this.status.cancelled||this.indicatorOff(),this.status.cancelled=!0,this.status=null)}};var $9cc6605c70fa70bc$export$2e2bcd8739ae039=$9cc6605c70fa70bc$var$geo,$jNRwG=parcelRequire("jNRwG");let $a8da540bf1e6d416$export$55185c17a0fcbe46=$a60d7ab082450164$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$db77ccec0bb4ccac=$a5c21812244207c8$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$9864de54bd63ed8a=$a5c21812244207c8$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$bf71da7aebe9ddc1=$7a42222fdfbd696d$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$accd73d198d77d2f=$80620d99b03812be$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$d3568da47c78d35c=$dae0bbca73793b94$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$cea96571ebbff9dd=$34149b5e20a7ad4b$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$deefd61317ad2797=$b77ee20098523c74$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$3abb4be70fa2c84e=$71bc70b9c4af45f1$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$d2ca453b913dcdea=$56b80282f7eea6ac$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$f932f06c7eb6abeb=$2adc75ff92895237$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$9388fcd1771be726=$9cc6605c70fa70bc$export$2e2bcd8739ae039,$a8da540bf1e6d416$export$eefcfe56efaaa57d=$jNRwG.Rinn,$a8da540bf1e6d416$export$4c85e640eb41c31b=$jNRwG.Class,$a8da540bf1e6d416$export$d61e24a684f9e51=$jNRwG.Event,$a8da540bf1e6d416$export$ec8b666c5fe2c75a=$jNRwG.EventDispatcher,$a8da540bf1e6d416$export$a1edc412be3e1841=$jNRwG.Model,$a8da540bf1e6d416$export$59eced47f477f85a=$jNRwG.ModelList,$a8da540bf1e6d416$export$19342e026b58ebb7=$jNRwG.Schema,$a8da540bf1e6d416$export$3a9581c9ade29768=$jNRwG.Flattenable,$a8da540bf1e6d416$export$fb8073518f34e6ec=$jNRwG.Collection,$a8da540bf1e6d416$export$14416b8d99d47caa=$jNRwG.Template;$parcel$global.riza={Router:$a8da540bf1e6d416$export$55185c17a0fcbe46,Element:$a8da540bf1e6d416$export$db77ccec0bb4ccac,CElement:$a8da540bf1e6d416$export$9864de54bd63ed8a,Api:$a8da540bf1e6d416$export$bf71da7aebe9ddc1,DataSource:$a8da540bf1e6d416$export$accd73d198d77d2f,DataList:$a8da540bf1e6d416$export$d3568da47c78d35c,Easing:$a8da540bf1e6d416$export$cea96571ebbff9dd,Anim:$a8da540bf1e6d416$export$deefd61317ad2797,Elements:$a8da540bf1e6d416$export$3abb4be70fa2c84e,Utils:$a8da540bf1e6d416$export$d2ca453b913dcdea,db:$a8da540bf1e6d416$export$f932f06c7eb6abeb,Rinn:$a8da540bf1e6d416$export$eefcfe56efaaa57d,Class:$a8da540bf1e6d416$export$4c85e640eb41c31b,Event:$a8da540bf1e6d416$export$d61e24a684f9e51,EventDispatcher:$a8da540bf1e6d416$export$ec8b666c5fe2c75a,Model:$a8da540bf1e6d416$export$a1edc412be3e1841,ModelList:$a8da540bf1e6d416$export$59eced47f477f85a,Schema:$a8da540bf1e6d416$export$19342e026b58ebb7,Flattenable:$a8da540bf1e6d416$export$3a9581c9ade29768,Collection:$a8da540bf1e6d416$export$fb8073518f34e6ec,Template:$a8da540bf1e6d416$export$14416b8d99d47caa};export{$a8da540bf1e6d416$export$55185c17a0fcbe46 as Router,$a8da540bf1e6d416$export$db77ccec0bb4ccac as Element,$a8da540bf1e6d416$export$9864de54bd63ed8a as CElement,$a8da540bf1e6d416$export$bf71da7aebe9ddc1 as Api,$a8da540bf1e6d416$export$accd73d198d77d2f as DataSource,$a8da540bf1e6d416$export$d3568da47c78d35c as DataList,$a8da540bf1e6d416$export$cea96571ebbff9dd as Easing,$a8da540bf1e6d416$export$deefd61317ad2797 as Anim,$a8da540bf1e6d416$export$3abb4be70fa2c84e as Elements,$a8da540bf1e6d416$export$d2ca453b913dcdea as Utils,$a8da540bf1e6d416$export$f932f06c7eb6abeb as db,$a8da540bf1e6d416$export$9388fcd1771be726 as geo,$a8da540bf1e6d416$export$eefcfe56efaaa57d as Rinn,$a8da540bf1e6d416$export$4c85e640eb41c31b as Class,$a8da540bf1e6d416$export$d61e24a684f9e51 as Event,$a8da540bf1e6d416$export$ec8b666c5fe2c75a as EventDispatcher,$a8da540bf1e6d416$export$a1edc412be3e1841 as Model,$a8da540bf1e6d416$export$59eced47f477f85a as ModelList,$a8da540bf1e6d416$export$19342e026b58ebb7 as Schema,$a8da540bf1e6d416$export$3a9581c9ade29768 as Flattenable,$a8da540bf1e6d416$export$fb8073518f34e6ec as Collection,$a8da540bf1e6d416$export$14416b8d99d47caa as Template};//# sourceMappingURL=riza.js.map

//# sourceMappingURL=riza.js.map
