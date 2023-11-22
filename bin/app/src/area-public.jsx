
import { Router, watch } from 'riza';
import { navigate } from './actions';
import { authStatus } from './signals';
import { tr } from './common/i18n';

import Login from './panels/public/login';
import Recover from './panels/public/recover';
import OTP from './panels/public/otp';

function init() {
    document.body.classList.add('anim-ended');
    Router.refresh();
}

watch([authStatus], (status) =>
{
    if (status !== authStatus.NOT_AUTH)
        return;

    document.body.classList.remove('anim-ended');
    Router.refresh();

    if (Router.location !== '/login/' && Router.location !== '/otp/' && Router.location !== '/recover/')
        navigate('/login/');
});

export default () =>
    <r-panel data-root="true" class="s-fill f-row" onRootReady={ init } style:alignItems="start">

        <div class="s-static form p-0 pb-5 auto no-shadow f-col s-12 s-6-md s-4-lg s-4-xl" style="margin-top:10vh;">

            <div class="s-static mb-4">
                <div class="p-abs" style="left:0; top:0; background:linear-gradient(#4d49cd,#6d29ed); width:100%; height:20vh; z-index:0;">
                </div>

                <div class="p-rel mx-4 px-3 px-6-xl pt-4" style="background:#fff; border-radius:1rem 1rem 0 0; z-index:1;">
                    <span style:display="inline-block">
                        <img src="img/logo-login.png" style:width="25%" />
                        <br/><br/>
                        <div style="font-size:1.4rem; font-weight:300;">{tr('Proceed with your cellphone')}</div>
                        <div style="font-size:1.8rem; font-weight:700;">{tr('Login')}</div>
                    </span>
                </div>
            </div>

            <div class="s-fill px-6 mx-4-xl">

                <Login ref="login" onActionRequired={ ({ data }, el) => el.getRoot().otp.dispatch('activate', data) }>
                    <div style:textAlign="right" style:marginTop="0.5rem" style:fontSize="0.9rem">
                        <a href="#/recover/">
                            <span>{tr('Forgot password')}</span>
                        </a>
                    </div>

                    <div style="line-height:1.2; font-size:0.8rem; margin-top:1rem;">
                        {tr('By using our app you are implicitly agreeing to our terms of service and privacy policy.')}
                    </div>
                </Login>

                <OTP ref="otp">
                    <div style:textAlign="right" style:marginTop="0.5rem" style:fontSize="0.9rem">
                        <a href="#/login/">
                            <span>{tr('Use another cellphone number')}</span>
                        </a>
                    </div>
                </OTP>

                <Recover ref="recover">
                    <div style:textAlign="right" style:marginTop="0.5rem" style:fontSize="0.9rem">
                        <a href="#/login/">
                            <span>{tr('Login to my account')}</span>
                        </a>
                    </div>
                </Recover>

            </div>

        </div>

    </r-panel>
;
