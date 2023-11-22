
import { checkAuth, logout } from '../../actions';
import { tr } from '../../common/i18n';

export default () =>
{
    return <r-panel class="ovf-auto" data-root="true" data-anim="fade-in" data-route="/initial/$">

        <div class="s-static form p-0 pb-5 auto no-shadow f-col s-12 s-6-md s-4-lg s-4-xl" style="margin-top:10vh;">

            <div class="s-static mb-4">
                <div class="p-abs" style="left:0; top:0; background:linear-gradient(#4d49cd,#6d29ed); width:100%; height:20vh; z-index:0;">
                </div>

                <div class="p-rel mx-4 px-3 px-6-xl pt-4" style="background:#fff; border-radius:1rem 1rem 0 0; z-index:1;">
                    <span style:display="inline-block">
                        <img src="img/logo-login.png" style:width="25%" />
                        <br/><br/>
                        <div style="font-size:1.4rem; font-weight:300;">{tr('Submit your details to')}</div>
                        <div style="font-size:1.8rem; font-weight:700;">{tr('Complete your registration')}</div>
                    </span>
                </div>
            </div>

            <div class="s-fill px-6 mx-4-xl" style="background:#fff; z-index:1;">

                <br/>

                <r-form data-ref="form" data-form-action="account.initial-client" onFormSuccess={ checkAuth }>

                    <div class="field">
                        <label>{tr('Your name')}</label>
                        <input type="text" data-field="name" autocomplete="off" />
                    </div>

                    <div class="field">
                        <label>{tr('Profile photo')}</label>
                        <input type="file" accept="image/*" capture="environment" data-field="photo" autocomplete="off" />
                    </div>

                    <div className="message error"></div>

                    <br/>

                    <button type="submit">
                        {tr('Complete Registration')}
                        <i class="fas fa-chevron-right ms-3"></i>
                    </button>

                </r-form>

                <br/>
                <div class="text-center mb-2" style:fontSize="0.8rem">
                    – {tr('Or')} –
                </div>

                <span class="btn small d-block alt-3" onClick={ logout }>
                    <i class="fas fa-sign-out-alt"></i>
                    <span>{tr('Logout')}</span>
                </span>

            </div>

        </div>

    </r-panel>;
};
