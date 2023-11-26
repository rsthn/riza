
import { tr } from './common/i18n';

export default () =>
    <r-panel data-root="true" class="s-fill f-row" style:alignItems="center" style:justifyContent="center"
        style:background="linear-gradient(#fd2d42,#fd2d29)"
    >

        <div style="position:absolute; left:50%; transform:translateX(-50%); padding:1rem 2rem; border-radius:0.5rem; top:18vh; width:100%; color:#fff; text-align:center; width:max-content; background:rgba(0,0,0,0.5);">
            <i class="fas fa-exclamation-triangle mb-3" style="font-size:3.0rem;"></i>
            <br/>
            {tr('Unable to connect to the server.')}
            <br/><br/>
            <button class="btn alt-2" onClick={ () => location.reload() }>
                <i class="fas fa-sync-alt me-2"></i>
                {tr('Try Again')}
            </button>
        </div>

    </r-panel>
;
