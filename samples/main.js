
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
            <div style="border:1px solid red; padding: 0.2rem; margin: 0.4rem;" data-action="_print0">
                <div style="border:1px solid red; padding: 0.2rem; margin: 0.4rem;">Hello World</div>
                <div style="border:1px solid red; padding: 0.2rem; margin: 0.4rem;" data-long-press="_print1" data-short-press="_print2" data-action="_print3">Long</div>
            </div>
        `);
    },

    add: function() {
        const text = (this.model.get('input') || '').trim();
        if (!text) return;

        const li = document.createElement('li');
        li.textContent = text;
        //li.dataset.action = ':toggleClass done';
        li.setAttribute("data-short-press", '_short');
        li.setAttribute("data-long-press", '_long');
        li.setAttribute("data-action", '_act');
        this.list.appendChild(li);

        this.model.set('count', this.model.get('count') + 1);
        this.model.set('input', '');
    },

    _short: function() {
        console.log('SHORT');
    },
    _long: function() {
        console.log('LONG');
    },
    _act: function() {
        console.log('ACTION');
    },
    _print0: function() {
        console.log('CONTAINER');
    },
    _print1: function() {
        console.log('LONG BUTTON');
    },
    _print2: function() {
        console.log('SHORT BUTTON');
    },
    _print3: function() {
        console.log('ACTION BUTTON');
    },
});
