
import { tr } from './common/i18n';

export default () =>
    <r-panel data-root="true" class="s-fill f-row" style:alignItems="center" style:justifyContent="center"
        style:background="#213"
    >

        <div class="s-static" style="padding-bottom:14rem;">
            <div style="background:rgba(255,255,255,0.02); padding:2.0rem; border-radius:999px;">
            <div style="background:rgba(255,255,255,0.06); padding:2.0rem; border-radius:999px;">
            <div style="background:rgba(255,255,255,0.10); padding:2.0rem; border-radius:999px;">
            <div style="background:rgba(255,255,255,1.00); padding:1.5rem; border-radius:999px; width:45vw; height:45vw; box-sizing:border-box; position:relative;">
                <img src="img/logo.png" style="position:absolute; left:5.5vw; top:12vw; width:34vw;" />
            </div>
            </div>
            </div>
            </div>
        </div>

        <div style="position:absolute; left:0; bottom:10vh; width:100%; color:#fff; text-align:center;">
            <div style="font-size:2rem; font-weight:700;">{tr('Default Template')}</div>
            <div style="font-size:1rem; font-weight:200;">{tr('Splash Screen')}</div>
            <img style="width:14vw; margin-top:2.0rem;" src="img/splash-spinner.svg" />
        </div>

    </r-panel>
;
