
import { Element } from 'riza';
import fs from 'fs';

Element.register('custom-box1', {
    contents: `
        <div class="title">
            Box 1
        </div>
    `,

    styles: `
        @ {
            background: aquamarine;
            padding: 0.5rem;
            border-radius: 0.5rem;
            margin: 0.5rem;
            border: 2px solid #fff;
            outline: 1px solid rgba(0,0,0,0.3);
        }
    `
});

Element.register('custom-box2', 'custom-box1', {
    contents: `
        <div class="title">
            Box 2
        </div>
    `,

    styles: `
        @ {
            background: aqua;
        }
        @ .title {
            font-size: 1.1rem; font-weight: bold;
        }
    `
});

Element.register('r-home',
{
    contents: fs.readFileSync(__dirname + '/home.html'),
    model: { },
    isRoot: true,

    init: function() {
        this.addClass('fill-parent d-flex flex-column');
        this.dataset.anim = this.args.anim || 'fade-in';
        this.refresh();
    },

    ready: function() {
        setInterval(() => this.refresh(), 1000);
    },

    refresh: function() {
        this.model.set('value', (new Date()).toLocaleTimeString());
    }
});
