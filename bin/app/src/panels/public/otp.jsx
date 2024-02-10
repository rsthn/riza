
import { navigate, checkAuth } from '../../actions';
import { tr } from '../../common/i18n';

export default ({ ref }, children) =>
{
    function checkResponse (response, form) {
        localStorage.setItem('device_token', response.device_token);
        localStorage.setItem('device_secret', response.device_secret);
        checkAuth();
    }

    function activate (data, panel) {
        panel.form.reset();
        panel.form.model.set(data);
        navigate('/otp/');
    }

    return <r-panel data-root="true" data-ref={ref} data-anim="fade-in" data-route="/otp/"
                onActivate={ activate }>

        <r-form data-ref="form" data-form-action="auth.login" onFormSuccess={ checkResponse }>

            <br/>

            <span>{tr('Enter the verification code we sent via SMS to your phone:')}</span>
            <br/><br/>

            <input type="hidden" data-field="user_agent" />
            <input type="hidden" data-field="device_token" />
            <input type="hidden" data-field="phone_country_code" />
            <input type="hidden" data-field="phone_number" />

            <div class="field">
                <label>{tr('Username')}</label>
                <input type="text" data-field="username" autocomplete="off" disabled />
            </div>

            <div class="field">
                <label>{tr('Password')}</label>
                <input type="password" data-field="password" disabled />
            </div>

            <div class="field">
                <label>{tr('2FA Code')}</label>
                <input class="input-number-large" type="number" data-field="one_time_code" autocomplete="off" />
            </div>

            <div className="message error"></div>
            <div className="message success"></div>

            <button type="submit">
                <i class="fa fa-check me-2"></i>
                {tr('Confirm')}
            </button>

            {children}

        </r-form>

    </r-panel>;
};
