
import { checkAuth } from '../../actions';
import { tr } from '../../common/i18n';

export default ({ ref }, children) =>
{
    return <r-panel data-root="true" data-ref={ref} data-anim="fade-in" data-route="/recover/"
                onPanelShown={ (args, panel) => panel.form.reset() }>

        <r-form data-ref="form" data-form-action="auth.recover">

            <br/>

            <div>
                {tr('Please provide the email address you used to register with us in the box below.')}
            </div>

            <br/><br/>

            <div class="field">
                <label>{tr('Email Address')}</label>
                <input type="email" data-field="email" autocomplete="off" />
            </div>

            <div className="message error"></div>
            <div className="message success"></div>

            <button type="submit">
                <i class="fa-regular fa-paper-plane" style:marginRight="0.5rem"></i>
                {tr('Send Login Link')}
            </button>

            {children}

        </r-form>

    </r-panel>;
};
