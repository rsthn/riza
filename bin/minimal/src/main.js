
import { Api } from 'riza';
import App from './app.jsx';

Api.setEndPoint(process.env.API_URL);

document.body.appendChild(App());
