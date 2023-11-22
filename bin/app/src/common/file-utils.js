
/**
 * Reads a file or blob as a data URL.
 * @param {Blob|File} blob
 * @returns {Promise<string>}
 */
export function readAsDataURL (blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (evt) => resolve(evt.target.result);
    });
}

/**
 * Loads an image from a URL.
 * @param {string} url
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage (url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

/**
 * Shows a dialog to select a file from the user's device.
 * @param {string} accept
 * @returns {Promise<string>}
 */
export function selectFile (accept) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    return new Promise((resolve, reject) => {
        input.onchange = async (evt) => {
            resolve(await readAsDataURL(evt.target.files[0]));
        };
        input.click();
    });
}
