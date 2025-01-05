
import { Api } from 'riza';
import App from './app.jsx';

Api.setBaseUrl(process.env.API_URL, Api.flags | Api.WIND_V3);

document.body.appendChild(App());
