# r-image-cropper

Interactive image cropper backed by an internal `<canvas>`. The element measures its own bounding box on the first load, sizes the canvas to that width while honoring the configured `aspectRatio`, and lets the user pan and zoom the source image to compose the desired crop. Once the user is happy with the framing, `getBlobAndUrl` returns the rendered crop as a `Blob` and an object URL ready to be uploaded or assigned to an `<img>`.

The element accepts no HTML attributes — configure it via JS properties before or after attaching it to the DOM.

|Property|Default|Description
|--------|-------|-----------
|`aspectRatio`|`1`|Width-to-height ratio of the canvas (and therefore the crop). For example, `16/9` for widescreen or `4/5` for portrait.

<br/>

# Interaction

|Input|Effect
|-----|------
|Mouse drag on canvas|Pans the image.
|Mouse wheel on canvas|Zooms in/out around the cursor (step `0.045`, clamped to a minimum scale of `0.1`).
|One-finger touch drag|Pans the image.
|Two-finger pinch|Zooms around the first touch point.

<br/>

# Methods

### `setImageUrl` (`url`: _string_)
Loads an image from the given URL and uses it as the source for cropping. Internally calls `Utils.loadImageFromUrl` and then `setImage`.

### `setImageFile` (`file`: _File | Blob_)
Loads an image from a `File` or `Blob` (e.g. from an `<input type="file">`), reads it as a data URL, and uses it as the source for cropping.

### `setImage` (`image`: _HTMLImageElement_)
Uses the given `HTMLImageElement` as the source for cropping. Resets the canvas, computes an initial scale that covers the canvas in both axes, centers the image, and renders it.

### `getBlobAndUrl` (`callback`: _function_, `type`: _string_ = `'image/png'`, `quality`: _number_ = `0.9`)
Returns the current canvas state as a `Blob`. The callback is invoked as `callback(blob, url)` where `url` is an object URL created via `URL.createObjectURL(blob)`. Caller is responsible for revoking the URL with `URL.revokeObjectURL(url)` once it is no longer needed.

### `reset` ()
Re-measures the element's bounding box and resizes the canvas to match `aspectRatio`. Does not re-render — typically used internally by `setImage`, but can be called manually after the element's size changes (e.g. after a layout change).

### `render` ()
Clears the canvas (filled black) and re-draws the source image at the current scale and offset.

### `translateImage` (`offsX`: _number_, `offsY`: _number_)
Adds the given pixel offsets to the current image translation and re-renders.

<br/>

## Example

```html
<input type="file" id="picker" accept="image/*" />

<r-image-cropper id="cropper" style="display:block; width:400px;"></r-image-cropper>

<button id="save">Save crop</button>
```

```js
const cropper = document.getElementById('cropper');
cropper.aspectRatio = 4/3;

document.getElementById('picker').addEventListener('change', (evt) => {
    const file = evt.target.files[0];
    if (file) cropper.setImageFile(file);
});

document.getElementById('save').addEventListener('click', () => {
    cropper.getBlobAndUrl((blob, url) => {
        // upload `blob`, or preview via `url`
        const preview = document.createElement('img');
        preview.src = url;
        document.body.appendChild(preview);
    }, 'image/jpeg', 0.85);
});
```

<br/>

## Notes

- The element renders a child `<canvas>` and a child `<div>` (used internally for diagnostics) as soon as it initializes — give the element an explicit width via CSS so the initial bounding-box measurement is meaningful.
- The element does not currently emit any events; observe state changes by wrapping calls to `setImage*` / `getBlobAndUrl` directly.
