/*
**	elems/r-select
**
**	Copyright (c) 2019-2021, RedStar Technologies, All rights reserved.
**	https://www.rsthn.com/
**
**	THIS LIBRARY IS PROVIDED BY REDSTAR TECHNOLOGIES "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
**	INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
**	PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL REDSTAR TECHNOLOGIES BE LIABLE FOR ANY
**	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
**	NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
**	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
**	STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
**	USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
	<r-select data-list="window.dataList1" data-blank=""></r-select>
*/

import { Rin, ModelList } from '@rsthn/rin';
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

		for (let attr of this.attributes)
		{
			if (attr.nodeName.startsWith('data-_') || attr.nodeName == 'data-list' || attr.nodeName == 'data-blank')
				continue;

			this.container.setAttribute(attr.nodeName, attr.nodeValue);
			this.removeAttribute(attr.nodeName);
		}

		this.textContent = ' ';
		this.style.display = 'none';
	},

	/**
	**	Executed when the children and parent of the element are ready.
	*/
	rready: function()
	{
		let list = this.getFieldByPath(this.dataset.list);
		if (!list)
		{
			console.error('List not found: ' + this.dataset.list);
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
		if (!list || !Rin.isTypeOf(ModelList, list) || this.list === list)
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
	}
});
