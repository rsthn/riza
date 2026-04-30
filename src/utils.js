
//!class Utils

const Utils =
{
    /**
     * Forces the browser to show a download dialog.
     * @param {string} filename
     * @param {string} url
     * !static showDownload (filename: string, url: string) : void;
     */
    showDownload: function (filename, url)
    {
        let link = document.createElement("a");
        link.href = url;

        link.style.display = 'none';
        link.download = filename;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Forces the browser to show a file selection dialog.
     * @param {boolean} allowMultiple
     * @param {string} accept
     * @param {(files: FileList) => void} callback
     * !static showFilePicker (allowMultiple: boolean, accept: string, callback: (files: FileList) => void) : void;
     */
    showFilePicker: function (allowMultiple, accept, callback)
    {
        let input = document.createElement("input");

        input.type = "file";
        input.accept = accept;
        input.style.display = 'none';
        input.multiple = allowMultiple;

        document.body.appendChild(input);

        input.onchange = function() {
            callback(input.files);
        };

        document.body.onfocus = function() {
            document.body.onfocus = null;
            document.body.removeChild(input);
        };

        input.click();
    },

    /**
     * Loads a file or blob and returns the content as a dataURL.
     * @param {File|Blob} file
     * @param {function(string)} callback
     * !static loadAsDataUrl (file: File|Blob, callback: (url: string, err: any) => void) : void;
     */
    loadAsDataUrl: function (file, callback)
    {
        let reader = new FileReader();

        reader.onload = function(e) {
            callback (e.target.result, null);
        };

        reader.onerror = function(e) {
            callback (null, e);
        };

        reader.readAsDataURL(file);
    },

    /**
     * Loads a file or blob and returns the base64 data.
     * @param {File|Blob} file
     * !static loadAsBase64 (file: File|Blob) : Promise<string>;
     */
    loadAsBase64: async function (file)
    {
        return new Promise((resolve, reject) =>
        {
            let reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result.split(',')[1]);
            };
            reader.onerror = function(e) {
                reject(e);
            };
            reader.readAsDataURL(file);
        });
    },

    /**
     * Loads a file or blob and returns the content as text.
     * @param {File|Blob} file
     * @param {function(string)} callback
     * !static loadAsText (file: File|Blob, callback: (text: string) => void) : void;
     */
    loadAsText: function (file, callback)
    {
        let reader = new FileReader();

        reader.onload = function(e) {
            callback (e.target.result);
        };

        reader.readAsText(file);
    },

    /**
     * Loads a file or blob and returns the content as array buffer.
     * @param {File|Blob} file
     * @param {function(ArrayBuffer)} callback
     * !static loadAsArrayBuffer (file: File|Blob, callback: (buffer: ArrayBuffer) => void) : void;
     */
    loadAsArrayBuffer: function (file, callback)
    {
        let reader = new FileReader();

        reader.onload = function(e) {
            callback (e.target.result);
        };

        reader.readAsArrayBuffer(file);
    },

    /**
     * Loads a list of files or blobs and returns the content as dataURLs.
     * @param {Array<File|Blob>} fileList
     * @param {(results: Array<{ name: string, size: number, url: string }>) => void} callback
     * !static loadAllAsDataUrl (fileList: Array<File|Blob>, callback: (results: Array<{ name: string, size: number, url: string }>) => void) : void;
     */
    loadAllAsDataUrl: function (fileList, callback)
    {
        let result = [];

        if (!fileList || !fileList.length) {
            callback(result);
            return;
        }

        let loadNext = function (i)
        {
            if (i == fileList.length) {
                callback(result);
                return;
            }

            Utils.loadAsDataUrl (fileList[i], function(url, err) {
                if (!err) {
                    result.push({ name: fileList[i].name, size: fileList[i].size, url: url });
                }
                loadNext(i+1);
            });
        };

        loadNext(0);
    },

    /**
     * Loads an image from a url and returns it as an Image object.
     * @param {string} url
     * @param {function(Image)} callback
     * !static loadImageFromUrl (url: string, callback: (image: HTMLImageElement) => void) : void;
     */
    loadImageFromUrl: function (url, callback)
    {
        let image = new Image();
        image.onload = () => callback(image);
        image.onerror = () => callback(null);
        image.src = url;
    }
};

//!/class

export default Utils;
