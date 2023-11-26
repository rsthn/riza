
import { authStatus } from './signals';
import { checkAuth } from './actions';

import AreaSplash from './area-splash';
import AreaPublic from './area-public';
import AreaPrivate from './area-private';
import AreaError from './area-error';

import "./css/main.css"
import "./css/xui.css"

const panel = { };
panel[authStatus.UNDEF] = <AreaSplash />;
panel[authStatus.NOT_AUTH] = <AreaPublic />;
panel[authStatus.AUTH] = <AreaPrivate />;
panel[authStatus.ERROR] = <AreaError />;

function init() {
    if (localStorage.showSplash !== 'false') {
        localStorage.showSplash = 'false';
        setTimeout(() => checkAuth(), 5000);
        return;
    }

    // Set manually the authStatus signal to preview panels:
    //authStatus.set(authStatus.AUTH);
    checkAuth();
}

export default () =>
    <r-panel class="s-fill f-row" onRootReady={ init }>
        { panel[$authStatus] }
    </r-panel>
;
