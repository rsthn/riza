
import { userData } from '../../signals';

let form;

function formSuccess(res) {
    userData.set(res.data);
}

function onShown() {
    form.model.set(userData.get());
}

export default () => 
    <r-panel class="s-fill" data-route="/profile/details/" onPanelShown={ onShown }>

        <r-form class="form left" data-method="patch" data-form-action="account/update-details" onFormSuccess={ formSuccess } onCreated={ f=>form=f }>

            <h3>General Information</h3>

            <div className="field">
                <label>Username</label>
                <input type="text" data-field="username" disabled />
            </div>
            <div className="field">
                <label>Full Name</label>
                <input type="text" data-field="name" />
            </div>
            <div class="f-row g-2">
                <div className="field s-12 s-6-md">
                    <label>Email Address</label>
                    <input type="email" data-field="email" />
                </div>
                <div className="field s-12 s-6-md">
                    <label>Phone Number</label>
                    <input type="text" data-field="phone" />
                </div>
            </div>

            <br/>
            <div className="message error"></div>
            <div className="message success"></div>

            <button class="alt" type="submit">
                <i class="fa fa-save" style:marginRight="0.5rem"></i>
                <span>Save Changes</span>
            </button>

        </r-form>

    </r-panel>
;
