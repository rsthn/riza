
const geo =
{	
    E_NONE:					0x0000,
    E_PERMISSION_DENIED:	0x8001,
    E_POSITION_UNAVAILABLE:	0x8002,
    E_TIMEOUT:				0x8003,
    E_UNSUPPORTED:			0x8004,
    E_UNKNOWN:				0x8009,

    supported: null,
    status: null,

    indicatorOn: function() {
        global.document.documentElement.classList.add('busy-geo');
    },

    indicatorOff: function() {
        global.document.documentElement.classList.remove('busy-geo');
    },

    /**
     * Initializes the geolocation interface. Returns boolean indicating whether geolocation
     * is supported on the device.
     * @returns {boolean}
     */
    init: function() {
        this.supported = navigator.geolocation ? true : false;
        return this.supported;
    },

    /**
     * Single-shot positioning operation.
     * @returns {Promise<{  }>}
     */
    getCurrentPosition: function()
    {
        if (this.supported === null)
            this.init();

        let status = this.status = { cancelled: false };

        return new Promise (async (resolve, reject) =>
        {
            this.indicatorOn();

            if (!this.supported)
            {
                if (this.status === status)
                    this.status = null;

                if (!status.cancelled) this.indicatorOff();

                reject ({ status, code: geo.E_UNSUPPORTED, message: 'Geolocation is not supported on this device.' });
                return;
            }

            navigator.geolocation.getCurrentPosition (
                (data) => {
                    if (this.status === status)
                        this.status = null;

                    if (!status.cancelled) this.indicatorOff();

                    data.status = status;
                    resolve(data);
                },

                (err) => {
                    if (this.status === status)
                        this.status = null;

                    if (!status.cancelled) this.indicatorOff();

                    let code;
                    switch (err.code)
                    {
                        case 0x01:	code = geo.E_PERMISSION_DENIED;
                                    break;
                        case 0x02:	code = geo.E_POSITION_UNAVAILABLE;
                                    break;
                        case 0x03:	code = geo.E_TIMEOUT;
                                    break;
                        default:	code = geo.E_UNKNOWN;
                                    err.message = 'Unable to get the current location.';
                                    break;
                    }

                    reject({ status, code, message: err.message });
                },

                { enableHighAccuracy: true }
            );
        });
    },

    /**
     * Cancels the active positioning operation (if any).
     */
    cancel: function()
    {
        if (this.status === null)
            return;

        if (!this.status.cancelled) this.indicatorOff();

        this.status.cancelled = true;
        this.status = null;
    }
};

export default geo;
