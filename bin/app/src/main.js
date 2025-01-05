
import { Api } from 'riza';
import App from './app.jsx';
import './common/messages';

Api.setEndPoint(process.env.API_URL, Api.flags | Api.WIND_V3);
document.body.appendChild(App());
