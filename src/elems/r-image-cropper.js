/*
	<r-image-cropper>
	</r-image-cropper>
*/

import Element from '../element.js';
import Utils from '../utils.js';

export default Element.register ('r-image-cropper',
{
	/*
	**	Default aspect ratio.
	*/
	aspectRatio: 1,

	/*
	**	Current image scale.
	*/
	imageScale0: 0, imageScale: 1,

	/*
	**	Image translation offsets.
	*/
	imageOffsX: 0, imageOffsY: 0,

	/*
	**	Pointer contexts.
	*/
	pointerA: null, pointerB: null,

	/*
	**	Client bounding box.
	*/
	bounds: null,

	/*
	**	Initializes the element.
	*/
	init: function()
	{
		this.canvas = document.createElement('canvas');
		this.appendChild(this.canvas);

		this.g = this.canvas.getContext('2d');

		this.pointerA = { id: null, active: false, sx: 0, sy: 0, cx: 0, cy: 0, ix: 0, iy: 0 };
		this.pointerB = { id: null, active: false, sx: 0, sy: 0, cx: 0, cy: 0, ix: 0, iy: 0 };

		this.log = document.createElement('div');
		this.appendChild(this.log);
	},

	/*
	**	Sets the image for the cropper from an image URL.
	*/
	setImageUrl: function(url)
	{
		Utils.loadImageFromUrl(url, (image) => {
			this.setImage(image);
		});
	},

	/*
	**	Sets the image for the cropper from an HTML File object.
	*/
	setImageFile: function(file)
	{
		Utils.loadAsDataUrl(file, (url) => {
			Utils.loadImageFromUrl(url, (image) => {
				this.setImage(image);
			});
		});
	},

	/*
	**	Sets the cropper image from an HTML Image element.
	*/
	setImage: function(image)
	{
		this.image = image;

		this.reset();

		this.imageScale = Math.max(this.canvas.width / this.image.width, this.canvas.height / this.image.height);

		this.imageOffsX = (this.canvas.width - this.imageScale*this.image.width)*0.5;
		this.imageOffsY = (this.canvas.height - this.imageScale*this.image.height)*0.5;

		this.render();
	},

	/*
	**	Returns the blob and URL representing the current canvas state.
	*/
	getBlobAndUrl: function(callback, type='image/png', quality=0.9)
	{
		this.canvas.toBlob((blob) => {
			callback(blob, URL.createObjectURL(blob));
		},
		type, quality);
	},

	/*
	**	Auto-resizes the canvas to ensure the aspect ratio is maintained.
	*/
	reset: function()
	{
		this.bounds = this.getBoundingClientRect();

		this.canvas.width = this.bounds.width;
		this.canvas.height = this.bounds.width/this.aspectRatio;
	},

	/*
	**	Auto-resizes the canvas to ensure the aspect ratio is maintained and renders the image.
	*/
	render: function()
	{
		this.canvas.width = this.canvas.width;

		this.g.fillStyle = '#000';
		this.g.beginPath();
		this.g.rect(0, 0, this.canvas.width, this.canvas.height);
		this.g.fill();

		this.g.translate(this.imageOffsX, this.imageOffsY);
		this.g.scale(this.imageScale, this.imageScale);
		this.g.drawImage(this.image, 0, 0);
	},

	/*
	**	Translates the image by the given offsets.
	*/
	translateImage: function(offsX, offsY)
	{
		this.imageOffsX += offsX;
		this.imageOffsY += offsY;

		this.render(true);
	},

	/*
	**	Handle mouse events on the canvas.
	*/
	"event mousemove canvas": function(evt)
	{
		if (this.pointerA.active)
		{
			this.pointerA.cx = evt.clientX;
			this.pointerA.cy = evt.clientY;

			this.translateImage(this.pointerA.cx - this.pointerA.sx, this.pointerA.cy - this.pointerA.sy);

			this.pointerA.sx = this.pointerA.cx;
			this.pointerA.sy = this.pointerA.cy;
		}

		this.pointerA.ix = ((evt.clientX-this.bounds.left) - this.imageOffsX) / this.imageScale;
		this.pointerA.iy = ((evt.clientY-this.bounds.top) - this.imageOffsY) / this.imageScale;
	},

	"event mousedown canvas": function(evt)
	{
		this.pointerA.active = true;
		this.pointerA.sx = evt.clientX;
		this.pointerA.sy = evt.clientY;
	},

	"event mouseup canvas": function(evt)
	{
		this.pointerA.active = false;
	},

	"event wheel canvas": function(evt)
	{
		if (evt.deltaY > 0)
			this.imageScale -= 0.045;
		else
			this.imageScale += 0.045;

		if (this.imageScale < 0.1) this.imageScale = 0.1;

		this.imageOffsX += -this.pointerA.ix*this.imageScale + (evt.clientX-this.bounds.left) - this.imageOffsX;
		this.imageOffsY += -this.pointerA.iy*this.imageScale + (evt.clientY-this.bounds.top) - this.imageOffsY;

		this.render();
	},

	/*
	**	Handle touch events on the canvas.
	*/
	"event touchmove canvas": function(evt)
	{
		for (let i of evt.changedTouches)
		{
			if (this.pointerA.id == i.identifier)
			{
				this.pointerA.cx = i.clientX;
				this.pointerA.cy = i.clientY;
			}
			else if (this.pointerB.id == i.identifier)
			{
				this.pointerB.cx = i.clientX;
				this.pointerB.cy = i.clientY;
			}
		}

		if (this.pointerA.active && this.pointerB.active)
		{
			let d0 = Math.sqrt(Math.pow(this.pointerA.sx-this.pointerB.sx, 2) + Math.pow(this.pointerA.sy-this.pointerB.sy, 2));
			let d1 = Math.sqrt(Math.pow(this.pointerA.cx-this.pointerB.cx, 2) + Math.pow(this.pointerA.cy-this.pointerB.cy, 2));

			let d = d1 - d0;
			this.imageScale += (d/10)*0.025;
			if (this.imageScale < 0.1) this.imageScale = 0.1;

			this.imageOffsX += -this.pointerA.ix*this.imageScale + (this.pointerA.cx-this.bounds.left) - this.imageOffsX;
			this.imageOffsY += -this.pointerA.iy*this.imageScale + (this.pointerA.cy-this.bounds.top) - this.imageOffsY;

			this.pointerA.sx = this.pointerA.cx;
			this.pointerA.sy = this.pointerA.cy;

			this.pointerB.sx = this.pointerB.cx;
			this.pointerB.sy = this.pointerB.cy;

			this.render();
		}
		else
		{
			let p = this.pointerA.active ? this.pointerA : (this.pointerB.active ? this.pointerB : null);
			if (!p) return;

			this.translateImage(p.cx - p.sx, p.cy - p.sy);

			p.sx = p.cx;
			p.sy = p.cy;
		}
	},

	"event touchstart canvas": function(evt)
	{
		this.imageScale0 = this.imageScale;

		for (let i of evt.changedTouches)
		{
			if (this.pointerA.id === null)
			{
				this.pointerA.id = i.identifier;
				this.pointerA.active = true;
				this.pointerA.sx = i.clientX;
				this.pointerA.sy = i.clientY;
				this.pointerA.ix = ((i.clientX-this.bounds.left) - this.imageOffsX) / this.imageScale;
				this.pointerA.iy = ((i.clientY-this.bounds.top) - this.imageOffsY) / this.imageScale;
			}
			else if (this.pointerB.id === null)
			{
				this.pointerB.id = i.identifier;
				this.pointerB.active = true;
				this.pointerB.sx = i.clientX;
				this.pointerB.sy = i.clientY;
				this.pointerB.ix = ((i.clientX-this.bounds.left) - this.imageOffsX) / this.imageScale;
				this.pointerB.iy = ((i.clientY-this.bounds.top) - this.imageOffsY) / this.imageScale;
			}
		}
	},

	"event touchend canvas": function(evt)
	{
		for (let i of evt.changedTouches)
		{
			if (this.pointerA.id == i.identifier)
			{
				this.pointerA.id = null;
				this.pointerA.active = false;
			}
			else if (this.pointerB.id == i.identifier)
			{
				this.pointerB.id = null;
				this.pointerB.active = false;
			}
		}
	},

	"event touchcancel canvas": function(evt)
	{
		for (let i of evt.changedTouches)
		{
			if (this.pointerA.id == i.identifier)
			{
				this.pointerA.id = null;
				this.pointerA.active = false;
			}
			else if (this.pointerB.id == i.identifier)
			{
				this.pointerB.id = null;
				this.pointerB.active = false;
			}
		}
	}
});
