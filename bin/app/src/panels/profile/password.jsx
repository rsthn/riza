
let form;

export default () => 
    <r-panel class="s-fill" data-route="/profile/password/" onPanelShown={ () => form.reset() }>

        <r-form class="form left" data-form-action="account.update-password" onFormSuccess={ () => form.reset() } onCreated={ f=>form=f }>

            <h3>Update Password</h3>

            <div className="field">
                <label>Current Password</label>
                <input type="password" data-field="cpassword" />
            </div>
            <div className="field">
                <label>New Password</label>
                <input type="password" data-field="npassword" />
            </div>
            <div className="field">
                <label>Repeat New Password</label>
                <input type="password" data-field="rpassword" />
            </div>

            <br/>
            <div className="message error"></div>
            <div className="message success"></div>

            <button class="alt" type="submit">
                <i class="fa fa-key" style:marginRight="0.5rem"></i>
                <span>Change Password</span>
            </button>

        </r-form>

    </r-panel>
;
