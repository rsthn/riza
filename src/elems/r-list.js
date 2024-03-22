/*
    <r-list data-list="window.dataList1" data-container=".x-data" data-wrap="true|false">

        <template data-mode="static|dynamic">
        </template>

        <div class="x-empty">
            Nothing to show.
        </div>

        <div class="x-data">
        </div>

    </r-list>

    CSS:
        .is-hidden {
            display: none;
        }

    Modifiers:
        .x-empty-null		Visible when the list is in undefined state (before first load).
        .x-empty			Visible when there is no data in the list.
        .x-not-empty 		Visible when there is data in the list.
        .is-loading 		Visible when the list is loading.
*/

import { Rinn, ModelList, Template } from 'rinn';
import Element from '../element.js';
import DataList from '../data-list.js';

/*
**	Connects to a ModelList and renders its contents using a template. When using "dynamic" template, the contents can be other custom elements, and
**	the model of each item can be accessed by using data-model=":list-item", which will cause the item model to be added to the element.
**
**	Additionally root attribute data-wrap can be set to 'true' to wrap the template contents inside a div with a data-iid representing the ID of the
**	item, this will cause any changes to items to affect only the specific item in question.
*/

export default Element.register ('r-list',
{
    list: null,

    container: null,
    template: null,
    isEmpty: false,
    isDynamicTemplate: false,

    /**
    **	Executed when the children of the element are ready.
    */
    ready: function()
    {
        this.container = this.querySelector(this.dataset.container || '.x-data');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'x-data';
            this.appendChild(this.container);
        }

        let tmp = this.template_elem = this.querySelector('template');
        if (tmp) {
            if (tmp.dataset.mode != 'dynamic') {
                this.template = Template.compile(tmp.innerHTML);
            }
            else {
                this.template = () => tmp.innerHTML;
                this.isDynamicTemplate = true;
            }

            tmp.remove();
        }
        else
            this.template = () => '';

        this.container.textContent = ' ';

        this.setEmpty(null);
        this.setLoading(null);
    },

    /**
    **	Executed when the children of the element are ready.
    */
    rready: function()
    {
        let list = this.dataList
        if (list) {
            if (typeof(list) === 'string')
                list = DataList.get(list, true);
        }
        else
            list = this.getFieldByPath(this.dataset.list);

        if (!list) {
            if (this.dataset.list) console.error('data-list not found: ' + this.dataset.list);
            return;
        }

        this.setList(list);
    },

    /*
    **	Indicates if the list is empty. Elements having x-empty, x-not-empty and x-empty-null will be updated.
    */
    setEmpty: function (value)
    {
        if (this.isEmpty === value)
            return;

        if (value === true)
        {
            this.querySelectorAll('.x-empty').forEach(i => i.classList.remove('is-hidden'));
            this.querySelectorAll('.x-not-empty').forEach(i => i.classList.add('is-hidden'));
            this.querySelectorAll('.x-empty-null').forEach(i => i.classList.add('is-hidden'));
        }
        else if (value === false)
        {
            this.querySelectorAll('.x-empty').forEach(i => i.classList.add('is-hidden'));
            this.querySelectorAll('.x-not-empty').forEach(i => i.classList.remove('is-hidden'));
            this.querySelectorAll('.x-empty-null').forEach(i => i.classList.add('is-hidden'));
        }
        else
        {
            this.querySelectorAll('.x-empty').forEach(i => i.classList.add('is-hidden'));
            this.querySelectorAll('.x-not-empty').forEach(i => i.classList.add('is-hidden'));
            this.querySelectorAll('.x-empty-null').forEach(i => i.classList.remove('is-hidden'));
        }

        this.isEmpty = value;
    },

    /*
    **	Indicates if the list is loading. Elements having is-loading will be updated.
    */
    setLoading: function (value)
    {
        if (value === true)
            this.querySelectorAll('.is-loading').forEach(i => i.classList.remove('is-hidden'));
        else
            this.querySelectorAll('.is-loading').forEach(i => i.classList.add('is-hidden'));
    },

    /**
    **	Sets the list model-list of the element.
    */
    setList: function (list)
    {
        if (!list || !Rinn.isInstanceOf(list, ModelList) || this.list === list)
            return;

        if (this.list != null)
        {
            if (this.list.dataSource)
                this.list.dataSource.removeEventListener (this.eid+':*');

            if (this.list.dataList)
                this.list.dataList.removeEventListener (this.eid+':*');

            this.list.removeEventListener (this.eid+':*');
        }

        this.list = list;

        if (this.list.dataSource) {
            this.list.dataSource.addEventListener (this.eid+':listLoading', this.onLoading, this);
            this.list.dataSource.addEventListener (this.eid+':listLoaded', this.onLoaded, this);
        }

        if (this.list.dataList) {
            this.list.dataList.addEventListener (this.eid+':listLoading', this.onLoading, this);
            this.list.dataList.addEventListener (this.eid+':listLoaded', this.onLoaded, this);
        }

        this.list.addEventListener (this.eid+':itemsCleared', this.onItemsCleared, this);
        this.list.addEventListener (this.eid+':itemsChanged', this.onItemsChanged, this);
        this.list.addEventListener (this.eid+':itemRemoved', this.onItemRemoved, this);
        this.list.addEventListener (this.eid+':itemChanged', this.onItemChanged, this);
        this.list.addEventListener (this.eid+':itemAdded', this.onItemAdded, this);
    },

    /*
    **	Builds an item (inside a div) to be added to the container.
    */
    buildItem: function (iid, data, asHtml=false)
    {
        if (this.content) {
            let elem = this.content(data.get(), data);
            elem.dataset.iid = iid;
            return elem;
        }

        if (this.container.content) {
            let elem = this.container.content(data.get(), data);
            elem.dataset.iid = iid;
            return elem;
        }

        let html = this.template(data.get());
        if (asHtml) return html;

        let elem = document.createElement('div');
        
        elem.dataset.iid = iid;
        elem.innerHTML = html;

        elem.querySelectorAll('[data-model=":list-item"]').forEach(i => {
            i.model = data;
            i.dataset.model = "this.model";
        });

        for (let attr of this.template_elem.attributes)
        {
            if (attr.nodeName.startsWith('data-_') || attr.nodeName == 'data-mode')
                continue;

            elem.setAttribute(attr.nodeName, attr.nodeValue);
        }

        return elem;
    },

    /*
    **	Executed when the list is loading.
    */
    onLoading: function()
    {
        this.setLoading(true);
    },

    /*
    **	Executed when the list finished loading.
    */
    onLoaded: function()
    {
        this.setLoading(false);
    },

    /*
    **	Executed when the list is cleared.
    */
    onItemsCleared: function()
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
    onItemsChanged: function()
    {
        if (this.list.length() == 0)
            return;

        if (this.container._timeout)
            clearTimeout(this.container._timeout);

        this.container._timeout = null;
        this.container.textContent = '';

        let i = 0;

        for (let data of this.list.getData())
        {
            if (this.dataset.wrap != 'false')
                this.container.append(this.buildItem(this.list.itemId[i++], data));
            else
                this.container.innerHTML += this.buildItem(this.list.itemId[i++], data, true);
        }

        this.setEmpty(i == 0);
    },

    /*
    **	Executed when an item is removed from the list.
    */
    onItemRemoved: function(evt, args)
    {
        if (this.dataset.wrap == 'false')
        {
            this.onItemsChanged();
            return;
        }

        let elem = this.container.querySelector('[data-iid="'+args.id+'"]');
        if (!elem) return;

        elem.remove();
        this.setEmpty(this.list.length() == 0);
    },

    /*
    **	Executed when an item changes.
    */
    onItemChanged: function(evt, args)
    {
        if (this.isDynamicTemplate) return;

        if (this.dataset.wrap == 'false')
        {
            this.onItemsChanged();
            return;
        }

        let elem = this.container.querySelector('[data-iid="'+args.id+'"]');
        if (!elem) return;

        elem.innerHTML = this.template(args.item);
    },

    /*
    **	Executed when an item is added to the list.
    */
    onItemAdded: function(evt, args)
    {
        if (args.position == 'head')
        {
            if (this.dataset.wrap != 'false')
                this.container.prepend(this.buildItem(args.id, args.item));
            else
                this.container.innerHTML = this.buildItem(args.id, args.item, true) + this.container.innerHTML;
        }
        else
        {
            if (this.dataset.wrap != 'false')
                this.container.append(this.buildItem(args.id, args.item));
            else
                this.container.innerHTML += this.buildItem(args.id, args.item, true);
        }

        this.setEmpty(false);
    },

    /**
     * 	Forces re-rendering of the element.
     */
    refresh: function()
    {
        this.onItemsChanged();
    }
});
