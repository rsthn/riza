/*
    <r-select data-list="window.dataList1" data-blank=""></r-select>
*/

import { Rinn, ModelList } from 'rinn';
import Element from '../element.js';

/*
**	Connects to a ModelList and renders its contents as a <select> element.
*/

export default Element.register ('r-select',
{
    list: null,
    container: null,

    value: '',

    /**
    **	Initializes the element.
    */
    init: function()
    {
        this.container = document.createElement('select');
        this.parentElement.insertBefore(this.container, this);

        let list = [];

        for (let attr of this.attributes)
        {
            if (attr.nodeName.startsWith('data-_') || attr.nodeName == 'data-list' || attr.nodeName == 'data-blank')
                continue;

            this.container.setAttribute(attr.nodeName, attr.nodeValue);
            list.push(attr.nodeName);
        }

        if (this.disabled)
            this.container.disabled = this.disabled;

        list.forEach(i => this.removeAttribute(i));

        this.textContent = ' ';
        this.style.display = 'none';
    },

    /**
    **	Executed when the children and parent of the element are ready.
    */
    rready: function()
    {
        let list = this.dataList ?? this.getFieldByPath(this.dataset.list);
        if (!list) {
            if (this.dataset.list) console.error('data-list not found: ' + this.dataset.list);
            return;
        }

        this.setList(list);

        if (this.parentElement.lastElementChild !== this)
            this.parentElement.append(this);
    },

    /**
    **	Sets the list model-list of the element.
    */
    setList: function (list)
    {
        if (!list || !Rinn.isInstanceOf(list, ModelList) || this.list === list)
            return;

        if (this.list != null)
            this.list.removeEventListener (this.eid+':*');

        this.list = list;

        if (this.list.dataSource)
            this.list.dataSource.includeEnum = true;

        this.list.addEventListener (this.eid+':itemsCleared', this.onItemsCleared, this);
        this.list.addEventListener (this.eid+':itemsChanged', this.onItemsChanged, this);
        this.list.addEventListener (this.eid+':itemRemoved', this.onItemsChanged, this);
        this.list.addEventListener (this.eid+':itemChanged', this.onItemsChanged, this);
        this.list.addEventListener (this.eid+':itemAdded', this.onItemsChanged, this);

        this.onItemsChanged();
    },

    /*
    **	Executed when the list is cleared.
    */
    onItemsCleared: function(evt, args)
    {
        this.container.textContent = '';
    },

    /*
    **	Executed when the items of the list changed.
    */
    onItemsChanged: function(evt, args)
    {
        if (this.list.length() == 0)
            return;

        let list = this.list.getData();
        let value, label, s = '';

        if (list[0].has('value')) value = 'value';
        else if (list[0].has('id')) value = 'id';

        if (list[0].has('label')) label = 'label';
        else if (list[0].has('name')) label = 'name';

        if ('blank' in this.dataset)
            s += '<option value="">'+this.dataset.blank+'</option>';

        if (list[0].has('group'))
        {
            let groups = { };
            list.forEach(i => groups[i.get('group')] = null);

            for (let i in groups)
                groups[i] = { name: i, list: [] };

            list.forEach(i => groups[i.get('group')].list.push(i));

            groups = Object.values(groups);
            groups.forEach(g => {
                s += '<optgroup label="'+g.name+'">';
                g.list.forEach(i => s += '<option value="'+i.get(value)+'">'+i.get(label)+'</option>');
                s += '</optgroup>';
            });
        }
        else
            list.forEach(i => s += '<option value="'+i.get(value)+'">'+i.get(label)+'</option>');

        this.container.innerHTML = s;
        this.container.value = this.container.dataset.value;
    },

    /**
     * 	Forces re-rendering of the element.
     */
    refresh: function()
    {
        this.onItemsChanged();
    }
});
