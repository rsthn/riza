
import Details from './details';
import Password from './password';
import TwoFactor from './2fa';

export default () =>
    <r-panel class="f-col s-fill p-6" data-route="/profile/">

        <h1>Your Profile</h1>

        <div class="f-row">
        <div class="tabs">
            <r-panel data-route="/profile/details/">
                <a href="#/profile/details/">
                    <i class="fa fa-list"></i>
                    <span>General</span>
                </a>
            </r-panel>
            <r-panel data-route="/profile/password/">
                <a href="#/profile/password/">
                    <i class="fa fa-lock"></i>
                    <span>Update Password</span>
                </a>
            </r-panel>
            <r-panel data-route="/profile/2fa/">
                <a href="#/profile/2fa/">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>2FA</span>
                </a>
            </r-panel>
        </div>
        </div>

        <div class="s-fill p-rel">
        <div class="p-fill p-3 ovf-auto">

            <Details/>
            <Password/>
            <TwoFactor/>

        </div>
        </div>

    </r-panel>
;
