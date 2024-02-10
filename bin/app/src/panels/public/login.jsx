
import { checkAuth } from '../../actions';
import { tr } from '../../common/i18n';

export default ({ ref, onActionRequired }, children) =>
{
    function checkResponse (response, form) {
        if (!response.action_required) {
            localStorage.setItem('device_token', response.device_token);
            localStorage.setItem('device_secret', response.device_secret);
            checkAuth();
            return;
        }
        onActionRequired({ response, data: form.model.get() }, form.getRoot());
    }

    async function resetForm (form) {
        form.reset();
        form.model.set('user_agent', navigator.userAgent);
        form.model.set('device_token', localStorage.getItem('device_token'));
    }

    return <r-panel data-root="true" data-ref={ref} data-anim="fade-in" data-route="/login/"
                onPanelShown={ (args, panel) => resetForm(panel.form) }>

        <r-form data-ref="form" data-form-action="auth.login" onFormSuccess={ checkResponse }>

            <input type="hidden" data-field="user_agent" />
            <input type="hidden" data-field="device_token" />

            <br/>
            <div class="field" data-field-container="phone_number">
                <label>{tr('Phone number')}</label>
                <span class="field-group">
                    <select class="input-number-large" data-field="phone_country_code" data-default="+000" style="width:min-content; letter-spacing:0;">
                        <option value="+000">+000</option>
                    </select>
                    <input class="input-number-large" type="number" data-field="phone_number" autocomplete="off" />
                </span>
            </div>

            <div class="field">
                <label>{tr('Username')}</label>
                <input type="text" data-field="username" autocomplete="off" />
            </div>

            <div class="field">
                <label>{tr('Password')}</label>
                <input type="password" data-field="password" />
            </div>

            <div className="message error"></div>

            <button type="submit">
                <i class="fa fa-sign-in" style:marginRight="0.5rem"></i>
                {tr('Login')}
            </button>

            {children}

        </r-form>

    </r-panel>;
};
