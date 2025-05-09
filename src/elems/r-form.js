/*
<r-form data-form-action="api-function-name" [data-strict="true|false"] [data-errors-at=""] [data-method="post"]>
    <input type="text" data-field="username"/>
</r-form>

r-form .message.is-hidden {
    display: none;
}

r-form span.field-error {
    display: block;
    color: red;
}
*/

import { Model, Template } from 'rinn';
import Element from '../element.js';
import Api from '../api.js';

export default Element.register ('r-form',
{
    isRoot: true,

    /**
     * Initial form model.
     */
    model: { },

    /**
     * Element events.
     */
    events:
    {
        'change [data-field]': '_fieldChanged',

        'click input[type=reset]': 'reset',
        'click .reset': 'reset',

        'click input[type=submit]': 'submit',
        'click button[type=submit]': 'submit',
        'click .submit': 'submit',
        'submit form': 'submit'
    },

    /**
     * Executed when the children of the element are ready.
     */
    ready: function()
    {
        let formElement = document.createElement('form');
        formElement.append(...this.childNodes);
        this.append(formElement);

        let def = { };
        let names = this.model.get();

        this.querySelectorAll('[data-field]').forEach((i) =>
        {
            i.name = i.dataset.field;
            names[i.name] = i.type;

            let val = i.dataset.default;
            if (val == undefined)
            {
                switch (i.type)
                {
                    case 'radio':
                        if (!i.checked) return;
                        val = i.value;
                        break;

                    case 'checkbox':
                        val = i.checked ? '1' : '0';
                        break;

                    case 'field':
                        val = i.getValue();
                        break;

                    case 'file':
                        val = '';
                        break;

                    default:
                        val = '';
                        break;
                }
            }

            def[i.dataset.field] = val;
        });

        for (let name in names)
        {
            if (name in def)
                names[name] = def[name];
            else
                names[name] = '';
        }

        def = names;

        this.model.defaults = def;
        this.model.reset();

        this.clearMarkers();
    },

    /**
     * Transforms an string returned by the server to a local representation.
     */
    filterString: function (str, r)
    {
        if (!str || !('messages' in global))
            return str;

        if (str.startsWith('@messages.'))
        {
            if (str.substr(10) in global.messages)
                str = Template.eval(global.messages[str.substr(10)], r);
        }

        return str;
    },

    _change: function(elem)
    {
        if ('createEvent' in document) {
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            elem.dispatchEvent(evt);
        }
        else
            elem.fireEvent('onchange');
    },

    _setField: function (f, value, silent)
    {
        if (!f) return;

        if (this.onfieldchanged)
            value = this.onfieldchanged(f, value, this);

        for (f of this.querySelectorAll('[data-field="'+f+'"]'))
        {
            switch (f.type || f.tagName.toLowerCase())
            {
                case 'select':
                    f.val = f.dataset.value = f.multiple ? (value ? value.split(',') : value) : value;
                    f.value = f.val = f.dataset.value;

                    if (silent !== true) this._change(f);
                    break;

                case 'checkbox':
                    f.checked = parseInt(value) ? true : false;
                    break;

                case 'radio':
                    f.checked = value == f.value;
                    break;

                case 'field':
                    f.val = f.dataset.value = value;
                    f.setValue(value);
                    break;

                case 'file':
                    if ((value instanceof File) || (value instanceof Blob))
                    {
                        f.val = value;
                        f.dataset.value = value;
                    }
                    else if (value instanceof FileList)
                    {
                        f.val = value;
                        f.dataset.value = value;
                    }
                    else
                    {
                        f.val = f.dataset.value = '';
                        f.value = '';
                    }

                    break;

                default:
                    f.val = f.dataset.value = value;
                    f.value = value;

                    if (silent !== true) this._change(f);
                    break;
            }
        }
    },

    _getField: function (f, _value=null, fromFileFields=false)
    {
        if (!f) return null;

        if (typeof(f) != 'string')
        {
            let value = f.value == null ? f.val : f.value;
            if (value === null) value = _value;

            switch (f.type || f.tagName.toLowerCase())
            {
                case 'select':
                    _value = f.multiple ? (value ? value.join(',') : value) : value;
                    break;

                case 'checkbox':
                    _value = f.checked ? '1' : '0';
                    break;

                case 'radio':
                    if (f.checked) _value = f.value;
                    break;

                case 'field':
                    _value = f.getValue();
                    break;

                case 'file':
                    _value = fromFileFields ? (f.files && f.files.length ? (f.multiple ? f.files : f.files[0]) : null) : f.val;
                    break;

                default:
                    _value = value;
                    break;
            }

            return _value === null ? '' : _value;
        }

        _value = null;

        for (f of this.querySelectorAll('[data-field="'+f+'"]'))
            _value = this._getField(f, _value);

        return _value === null ? '' : _value;
    },

    getField: function (name)
    {
        return this._getField(name);
    },

    clearMarkers: function ()
    {
        this.classList.remove('busy');

        this.querySelectorAll('.message').forEach(i => i.classList.add('is-hidden') );
        this.querySelectorAll('span.field-error').forEach(i => i.remove());

        this.querySelectorAll('.field-error').forEach(i => { i.classList.remove('field-error'); i.classList.remove('is-invalid'); });
        this.querySelectorAll('.field-passed').forEach(i => i.classList.remove('field-passed'));
    },

    _fieldChanged: function (evt)
    {
        let f = evt.source;

        if (f.type == 'file')
            this.model.set (f.dataset.field, this._getField(f, null, true), true);
        else
            this.model.set (f.dataset.field, this._getField(f));

        evt.continuePropagation = true;
    },

    onModelPropertyChanged: function (evt, args)
    {
        this._setField (args.name, args.value);
    },

    _onSuccess: function(r)
    {
        this.classList.remove('busy');
        this.clearMarkers();
        let tmp;

        this.dispatch('formSuccess', r);

        if (r.message && (tmp = this.querySelector('.message.success')) != null)
        {
            tmp.innerHTML = this.filterString(r.message, r).replace(/\n/g, '<br/>');
            tmp.classList.remove('is-hidden');
            tmp.onanimationend = () => tmp.classList.add('is-hidden');
        }
    },

    _onFailure: function(r)
    {
        this.classList.remove('busy');
        this.clearMarkers();
        let tmp;

        this.dispatch('formError', r);

        if (r.fields)
        {
            for (let i in r.fields)
            {
                let f = this.querySelector('[data-field-container="'+i+'"]');
                if (!f) {
                    f = this.querySelector('[data-field="'+i+'"]');
                    if (!f) continue;
                }

                f.classList.add('field-error');
                f.classList.add('is-invalid');

                let message = this.filterString(r.fields[i], r).replace(/\n/g, '<br/>');
                if (!message) continue;

                let tmp = document.createElement('span');
                tmp.classList.add('field-error');
                tmp.innerHTML = message;

                if (this.dataset.errorsAt == 'bottom')
                    f.parentElement.append(tmp);
                else if (this.dataset.errorsAt == 'top')
                    f.parentElement.prepend(tmp);
                else
                    f.parentElement.insertBefore(tmp, f.nextElementSibling);

                setTimeout((function (tmp) { return function() { tmp.classList.add('active'); } })(tmp), 25);
            }

            if (r.error && (tmp = this.querySelector('.message.error')) != null)
            {
                tmp.innerHTML = this.filterString(r.error, r).replace(/\n/g, '<br/>');
                tmp.classList.remove('is-hidden');
                tmp.onanimationend = () => tmp.classList.add('is-hidden');
            }
        }
        else
        {
            if ((tmp = this.querySelector('.message.error')) != null)
            {
                tmp.innerHTML = this.filterString(r.error, r).replace(/\n/g, '<br/>') || ('Error: ' + r.response);
                tmp.classList.remove('is-hidden');
                tmp.onanimationend = () => tmp.classList.add('is-hidden');
            }
        }
    },

    reset: function (nsilent)
    {
        this.model.reset (nsilent);
        this.clearMarkers();

        if (nsilent === false)
        {
            for (var i in this.model.data)
                this._setField (i, this.model.data[i], true);
        }

        return false;
    },

    submit: async function ()
    {
        if (this.classList.contains('busy'))
            return;

        let data = { };

        if (this.dataset.strict === 'false')
            Object.assign(data, this.model.get());

        let list = { };
        this.querySelectorAll('[data-field]').forEach(e => list[e.dataset.field] = true);
        Object.keys(list).forEach(f => data[f] = this._getField(f));

        if (this.constraints)
            data = (new Model(data, null, this.constraints)).get();

        this.dispatch('beforeSubmit', data);
        this.model.set(data);

        if (this.preprocess)
            await this.preprocess(data);

        let f = this.dataset.formAction || this.formAction;
        if (!f) return;

        this.classList.add('busy');

        if (typeof(f) != 'function')
        {
            let modern = f.indexOf('/') !== -1;
            if (!modern) data.f = f;

            Api.apiCall(
                modern ? JSON.stringify(data) : data,
                (r) => this[r.response == 200 ? '_onSuccess' : '_onFailure'](r), 
                (r) => this._onFailure({ error: 'Unable to execute request.' }), 
                this.dataset.method ?? 'POST',
                null,
                modern ? f : null
            );
        }
        else
            f(data, (r) => this[r.response == 200 ? '_onSuccess' : '_onFailure'](r));
    }
});
