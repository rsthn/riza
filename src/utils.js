
const Utils =
{
	/**
	**	Forces the browser to show a download dialog.
	*/
	showDownload: function (filename, url)
	{
		var link = document.createElement("a");
		link.href = url;

		link.style.display = 'none';
		link.download = filename;
		link.target = "_blank";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	},

	/**
	**	Forces the browser to show a file selection dialog.
	*/
	showFilePicker: function (allowMultiple, accept, callback)
	{
		var input = document.createElement("input");

		input.type = "file";
		input.accept = accept;
		input.style.display = 'none';
		input.multiple = allowMultiple;

		document.body.appendChild(input);

		input.onchange = function () {
			callback(input.files);
		};

		document.body.onfocus = function ()
		{
			document.body.onfocus = null;
			document.body.removeChild(input);
		};

		input.click();
	},

	/**
	**	Loads a URL using FileReader and returns as a dataURL.
	*/
	loadAsDataUrl: function (file, callback)
	{
		var reader = new FileReader();

		reader.onload = function(e) {
			callback (e.target.result, null);
		};

		reader.onerror = function(e) {
			callback (null, e);
		};

		reader.readAsDataURL(file);
	},

	/**
	**	Loads a URL using FileReader and returns as text.
	*/
	loadAsText: function (file, callback)
	{
		var reader = new FileReader();

		reader.onload = function(e) {
			callback (e.target.result);
		};

		reader.readAsText(file);
	},

	/**
	**	Loads a URL using FileReader and returns as an array buffer.
	*/
	loadAsArrayBuffer: function (file, callback)
	{
		var reader = new FileReader();

		reader.onload = function(e) {
			callback (e.target.result);
		};

		reader.readAsArrayBuffer(file);
	},

	/**
	**	Loads an array of URLs using FileReader and returns them as data url.
	*/
	loadAllAsDataUrl: function (fileList, callback)
	{
		var result = [];

		if (!fileList || !fileList.length)
		{
			callback(result);
			return;
		}

		var loadNext = function (i)
		{
			if (i == fileList.length)
			{
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

	/*
	**	Loads a URL as an image.
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
