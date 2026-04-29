
riza.Element.register('todo-app', {
    isRoot: true,
    model: { input: '', count: 0 },

    styles: `
        @ { display: block; padding: 1rem; font-family: sans-serif; }
        @ ul { list-style: none; padding: 0; }
        @ li { padding: 0.25rem 0; }
        @ .done { text-decoration: line-through; opacity: 0.6; }
    `,

    init: function() {
        this.setInnerHTML(`
            <h2>Tasks (<span data-watch="count">[count]</span>)</h2>
            <input data-property="input" data-enter="add" placeholder="What needs doing?" />
            <button data-action="add">Add</button>
            <ul data-ref="list"></ul>
        `);
    },

    add: function() {
        const text = (this.model.get('input') || '').trim();
        if (!text) return;

        const li = document.createElement('li');
        li.textContent = text;
        li.dataset.action = ':toggleClass done';
        this.list.appendChild(li);

        this.model.set('count', this.model.get('count') + 1);
        this.model.set('input', '');
    }
});
