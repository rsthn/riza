/*
    <r-table data-source="window.dataSource1">
        <table>
            <thead>
                <tr>
                    <th>A</th>
                    <th>B</th>
                </tr>
            </thead>

            <tbody class="x-data">
                <tr>
                    <td>[a]</td>
                    <td>[b]</td>
                </tr>
            </tbody>
        </table>
    </r-table>

    CSS:
        .is-hidden {
            display: none;
        }

        th[data-sort] {
            cursor: pointer; text-decoration: underline;
        }

        th[data-sort][data-order="asc"]:before {
            content: "\25B2";
        }

        th[data-sort][data-order="desc"]:before {
            content: "\25BC";
        }

    Modifiers:
        .x-empty			Add to elements that should be shown only when there is no data in the data source.
        .x-not-empty 		Add to elements that should be shown only when there is data in the data source.
        [data-sort]			Added to th/td elements in thead, marks the column as sortable.
*/

import { Rinn, Template } from 'rinn';
import Element from '../element.js';
import DataSource from '../data-source.js';

/**
 * Connects to a DataSource and renders its contents as a table.
 */

export default Element.register ('r-table',
{
    isRoot: true,

    source: null,
    template: null,
    container: null,
    isEmpty: null,

    /**
     * Initializes the element.
     */
    init: function()
    {
        this.setModel({ });
    },

    /**
     * Executed when the children of the element are ready.
     */
    ready: function()
    {
        this.container = this.querySelector(this.dataset.container || 'tbody.x-data');
        if (!this.container) throw new Error ('r-table requires a container');

        if (this.container.dataset.mode != 'dynamic')
            this.template = Template.compile(this.container.innerHTML);
        else
            this.template = () => this.container.innerHTML;

        this.temporalBody = document.createElement((this.dataset.container || 'tbody').split('.')[0] || 'tbody');
        this.container.textContent = ' ';
        this.setEmpty(true);
    },

    /**
     * Executed when the children and root elements are ready.
     */
    rready: function()
    {
        let source = this.dataSource;
        if (source) {
            if (typeof(source) === 'string')
                source = DataSource.get(source, true);
        }
        else
            source = this.getFieldByPath(this.dataset.source);

        if (!source) {
            if (this.dataset.source) console.error('data-source not found: ' + this.dataset.source);
            return;
        }

        this.setSource(source);
    },

    /*
    **	Indicates if the table is empty. Elements having .x-not-empty will be hidden.
    */
    setEmpty: function (value)
    {
        if (this.isEmpty === value)
            return;

        if (value)
        {
            this.querySelectorAll('.x-empty').forEach(i => i.classList.remove('is-hidden'));
            this.querySelectorAll('.x-not-empty').forEach(i => i.classList.add('is-hidden'));
        }
        else
        {
            this.querySelectorAll('.x-empty').forEach(i => i.classList.add('is-hidden'));
            this.querySelectorAll('.x-not-empty').forEach(i => i.classList.remove('is-hidden'));
        }

        this.isEmpty = value;
    },

    /**
    **	Sets the data source of the element.
    */
    setSource: function (source)
    {
        if (!source || !Rinn.isInstanceOf(source, DataSource) || this.source === source)
            return;

        if (this.source != null)
            this.source.removeEventListener (this.eid+':*');

        this.source = source;

        this.source.addEventListener (this.eid+':requestPropertyChanged', this.onRequestPropertyChanged, this);
        this.source.addEventListener (this.eid+':listItemsCleared', this.onItemsCleared, this);
        this.source.addEventListener (this.eid+':listItemsChanged', this.onItemsChanged, this);
        this.source.addEventListener (this.eid+':listItemRemoved', this.onItemRemoved, this);
        this.source.addEventListener (this.eid+':listItemChanged', this.onItemChanged, this);
        this.source.addEventListener (this.eid+':listItemAdded', this.onItemAdded, this);

        this.source.setNamespace(this.eid);
        this.source.request.update(true);
        this.source.setNamespace(null);
    },

    /*
    **	Event handler invoked when a property of the source request changes. The property is copied to the local model.
    */
    onRequestPropertyChanged: function(evt, args)
    {
        this.model.set(args.name, args.value);

        if (args.name == 'sort')
        {
            this.querySelectorAll('thead [data-sort]').forEach(i => i.dataset.order = '');
        }
        else if (args.name == 'order')
        {
            let elem = this.querySelector('thead [data-sort="'+evt.source.get('sort')+'"]');
            if (elem) elem.dataset.order = args.value;
        }
    },

    /*
    **	Event handler invoked when a property of the model has changed. The property is copied to the data source request model.
    */
    onModelPropertyChanged: function (evt, args)
    {
        if (this.source.request.get(args.name) == args.value)
            return;

        this.source.request.set(args.name, args.value);

        let ignored = [
            'count',
            'offset'
        ];

        if (ignored.indexOf(args.name) != -1)
            return;

        this.source.refresh('filter');
    },

    /*
    **	Event handler invoked when a property of the model is removed.
    */
    onModelPropertyRemoved: function (evt, args)
    {
        if (typeof(args.fields) == 'string')
            this.source.request.remove(i);
        else
            args.fields.forEach(i => this.source.request.remove(i));

        this.source.refresh('filter');
    },

    /*
    **	Builds an item to be added to the container.
    */
    buildItem: function (iid, data)
    {
        if (this.container.content) {
            let elem = this.container.content(data.get(), data);
            elem.dataset.iid = iid;
            return elem;
        }

        let elem = this.temporalBody;
        elem.innerHTML = this.template(data.get());
        elem.querySelectorAll('[data-model=":list-item"]').forEach(i => {
            i.model = data;
            i.dataset.model = "this.model";
        });

        elem = elem.firstElementChild;
        elem.dataset.iid = iid;
        return elem;
    },

    /*
    **	Executed when the list is cleared.
    */
    onItemsCleared: function(evt, args)
    {
        this.container._timeout = setTimeout(() => {
            this.setEmpty(true);
            this.container._timeout = null;
            this.container.textContent = '';
        }, 300);
    },

    /*
    **	Executed when the items of the list changed.
    */
    onItemsChanged: function(evt, args)
    {
        if (this.source.list.length() == 0)
            return;

        if (this.container._timeout)
            clearTimeout(this.container._timeout);

        this.container._timeout = null;
        this.container.textContent = '';

        let i = 0;

        for (let data of this.source.list.getData())
            this.container.append(this.buildItem(this.source.list.itemId[i++], data));

        this.setEmpty(i == 0);
    },

    /*
    **	Executed when an item is removed from the list.
    */
    onItemRemoved: function(evt, args)
    {
        let elem = this.container.querySelector('[data-iid="'+args.id+'"]');
        if (!elem) return;

        elem.remove();
        this.setEmpty(this.source.list.length() == 0);
    },

    /*
    **	Executed when an item changes.
    */
    onItemChanged: function(evt, args)
    {
        let elem = this.container.querySelector('[data-iid="'+args.id+'"]');
        if (!elem) return;

        let _elem = this.buildItem(args.id, args.item);
        this.container.replaceChild(_elem, elem);
    },

    /*
    **	Executed when an item is added to the list.
    */
    onItemAdded: function(evt, args)
    {
        if (args.position == 'head')
            this.container.prepend(this.buildItem(args.id, args.item));
        else
            this.container.append(this.buildItem(args.id, args.item));

        this.setEmpty(false);
    },

    /*
    **	Handles clicks to data-sort elements.
    */
    "event click thead [data-sort]": function(evt, args)
    {
        if (this.source.request.get('sort') == evt.source.dataset.sort)
        {
            this.source.request.set('order', this.source.request.get('order') == 'asc' ? 'desc' : 'asc');
            this.source.refresh('order');
        }
        else
        {
            this.source.request.set('sort', evt.source.dataset.sort);
            this.source.request.set('order', 'asc', true);
            this.source.refresh('order');
        }
    },

    /*
    **	Refreshes the data source.
    */
    refresh: function()
    {
        this.source.refresh('full');
    },

    /*
    **	Clears (set to empty) the specified fields from the data source's request parameters.
    */
    clear: function(args)
    {
        for (let i = 0; i < args.length; i++)
            this.model.set(args[i], '');
    }
});
