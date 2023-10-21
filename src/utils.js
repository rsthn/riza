
const Utils =
{
    /**
     * Forces the browser to show a download dialog.
     * @param {string} filename
     * @param {string} url
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
     * @param {function(File[])} callback 
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
     * Loads a file or blob and returns the content as text.
     * @param {File|Blob} file
     * @param {function(string)} callback
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
     * @param {function([{ name:string, size:number, url:string }])} callback
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
     */
    loadImageFromUrl: function (url, callback)
    {
        let image = new Image();
        image.onload = () => callback(image);
        image.onerror = () => callback(null);
        image.src = url;
    }
};

export default Utils;
