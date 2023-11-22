
import { Api, signal, watch } from 'riza';
import { userData } from '../../signals';

const status = signal(0);
const code = signal('');
const errMsg = signal('');
const qrUrl = signal(null);

let codeSize = 6;
let form;

watch([code], (code) =>
{
    if (code.length < codeSize) return;

    Api.fetch(status.value == 1 ? 'account/2fa-confirm' : 'account/2fa-disable', { code }).then(r => {
        errMsg.set('');
        if (r.response == 200) {
            userData.set(r.data);
            status.set(0);
        }
        else
            errMsg.set(r.error, true);
    });
});

watch([errMsg], (msg) => {
    if (msg != '') code.set('');
});

function enable2fa()
{
    Api.fetch('account/2fa-enable').then(r => {
        qrUrl.value = r.qrUrl;
        errMsg.set('');
        code.set('');
        status.set(1);
    });
}

function disable2fa()
{
    errMsg.set('');
    code.set('');
    status.set(2);
}

export default () => 
    <r-panel class="s-fill" data-route="/profile/2fa/" onPanelShown={ () => status.set(0) }>

        <div class="form left" onCreated={f=>form=f}>

            <div style:textAlign="center">

                <b style:fontSize="1.2rem">Two-Factor Authentication</b>
                <br/><br/>
                <i class="fa-solid fa-shield-halved" style:color={ $userData.has_2fa ? '#3a4' : '#e35' } style:fontSize="4rem"></i>
                <br/>
                <b class="d-block mt-1" style:fontSize="1.1rem">{ $userData.has_2fa ? 'Enabled' : 'Disabled' }</b>
                <br/><br/>

                <div className="f-row" class:xx-hidden={ $userData.has_2fa || $status != 0 }>
                <button class="s-12 s-5-md mx-auto spinner" onClick={ enable2fa }>
                    <span>Enable Now</span>
                </button>
                </div>

                <div className="f-row" class:xx-hidden={ !$userData.has_2fa || $status != 0 }>
                <button class="s-12 s-5-md mx-auto" onClick={ disable2fa }>
                    <span>Disable 2FA</span>
                </button>
                </div>

                <div className="f-row" class:xx-hidden={ $status != 1 && $status != 2 }>
                    <div className="s-12 s-6-md mx-auto">
                        <div className="field">
                            <label>Authenticator Code:</label>
                            <input type="number" style:textAlign="center" trait:input={ code } disabled={ $code.length == codeSize } />
                            <span class="field-error" class:is-hidden={ $errMsg == '' }>{errMsg}</span>
                        </div>
                    </div>

                    <div className="s-12 s-8-md mx-auto" class:xx-hidden={ $status != 1 }>
                        <div>
                            Scan the QR code below with your authenticator app and type the code it generates in the field above.
                        </div>
                        <img src={ qrUrl } style:width="100%" style:maxWidth="15rem" />
                    </div>

                    <div className="s-12 s-8-md mx-auto" class:xx-hidden={ $status != 2 }>
                        <div>
                            Use your authenticator app to generate a code and type it in the field above to <b style:color="#f00">disable 2FA</b> on your account.
                        </div>
                        <br/>
                    </div>

                    <div className="s-12 s-6-md mx-auto">
                        <button class="s-12 s-5-md mx-auto gray spinner" onClick={ () => status.set(0) }>
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>

    </r-panel>
;
