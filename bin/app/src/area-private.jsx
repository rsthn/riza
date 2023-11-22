
import { userData } from './signals';
import { navigate } from './actions';

import Profile from './panels/profile/main';
import Initial from './panels/initial/main';

function init() {
    if (userData.get().status === 'initial') {
        navigate('/initial/', true);
    }
    else {
        navigate('/home/', true);
    }
}

export default () =>
    <r-panel class="s-fill multiplex" onRootReady={ init }>

        <div>
            <a href="#/profile/">Profile</a>
            <a href="#/initial/">Initial</a>
        </div>

        <Profile />
        <Initial />

    </r-panel>
;
