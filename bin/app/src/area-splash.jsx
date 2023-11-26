
import { tr } from './common/i18n';

export default () =>
    <r-panel data-root="true" class="s-fill f-row" style:alignItems="center" style:justifyContent="center"
        style:background="#070707"
    >

        <div class="text-center s-static s-12 s-5-md s-3-lg s-3-xl" style="padding-bottom:14rem;">
            <img src="img/logo-splash.png" style="width:80%;" />
            <br/>

            <br/><br/><br/>
            <div style="font-size:2rem; font-weight:700;">{tr('Default Template')}</div>
            <div style="font-size:1rem; font-weight:200;">{tr('Splash Screen')}</div>

            <img style="width:14%; margin-top:2.0rem;" src="img/button-spinner.svg" />
        </div>

    </r-panel>
;
