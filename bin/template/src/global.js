
import { Api, Model } from 'riza';

/**
 * Global state.
 */
Object.assign(global.global = global,
{
	currentDialog: null
});

/**
 * Create an event bus using a model to pass data.
 */
global.EventBus = new Model();

/**
 * Data bus is the same as the event bus, but renamed cause feels weird to store data in an event bus.
 */
global.DataBus = global.EventBus;

/**
 * Set API end point.
 */
Api.setEndPoint(process.env.API_URL);


// *****************************
import './messages.js';
