# v3.0.13 - Aug 30 2023

#### General
- Separated code of signals into its own package `riza-signal` so it can be reused more easily without much overhead.
- Renamed CSS classes x-hidden, x-active, x-inactive and x-loading to is-hidden, is-active, is-inactive and is-loading respectively.
- Added support to use attribute `dataModel` in r-item to directly set the model.
- Added method `toggleVisibility` to r-panel.
- Updated logic of r-panel and r-tabs to include CSS class `anim-ended` when the animation of the element has finished.
- Updated behavior of r-form to clear markers until data is available from the API to improve responsiveness.

#### Element
- Updated logic of direct event handlers (on* properties) to include the self element as second parameter.

<br/>

# v3.0.12 - Aug 23 2023

#### Element
- Added support for `data-attr` and `data-self-attr` attribute used to change attributes of the element.

<br/>

# v3.0.11 - Aug 20 2023

#### General
- Updated template of app-jsx to include more features.
- Patched minor bugs in r-form and r-panel.
- Patched runtime-jsx to ensure custom properties are copied to cloned elements.
- Added event `onbeforesubmit` to r-form, fired before the form is submitted.
- Added new refresh mode `enum` to DataSource.

<br/>

# v3.0.7 - Aug 7 2023

#### General
- Renamed template app-v2 to app-jsx for semantic consistency.

<br/>

# v3.0.6 - Jul 31 2023

#### r-table
- Added support for `dataSource` property to directly set the table's data source.
- Added support for `content` property (function) in the tbody to format each row.

#### r-paginator
- Added support for `dataSource` property.

#### r-select
- Added support for `dataList` property.

#### r-list
- Added support for `dataList` property.
- Added support for `content` property (function) to format each item in the list.

#### General
- Updated documentation of custom elements to show new events and properties compatible with JSX.
- Minor bug fixes.

<br/>

# v3.0.5 - Jul 06 2023

#### Element
- Updated `dispatch` method to trigger immediate event handler first when available.

#### RuntimeJsx
- Fixed bugs causing uninitialized elements after cloning.
- Added helper function 'cloneNode' which clones nodes including custom properties.

<br/>

# v3.0.4 - Jun 9 2023

- Added special event `oncreated` for elements created with JSX.
- Added methods get/set to the Signal class to get or set the signal's value.
- Fixed bugs in the runtime-jsx causing elements to be recycled and thus showing only a single instance.

<br/>

# v3.0.2 - May 23 2023

- Replaced entire JSX runtime to be compatible with the latest optimized `babel-plugin-riza`
- Updated riza and related packages to support parcel 2.8
- Fixed minor bug in JSX transpiler and runtime causing `class` not to be properly in elements.

<br/>

# v2.0.15 - Jan 27 2023

#### Api
- Failure callback now includes `err` as first parameter.

#### RuntimeJsx
- Added `default` property to signal, set as the value passed when creating it.
- Added method `reset` used to set the signal to its default value.

#### r-tabs
- When a tab/panel is active now gets `.is-active` CSS class as well (besides the standard `.active`).

<br/>

# v2.0.12 - Jan 09 2023

#### JsxRuntime
- Removed async/await from regular effect function.

<br/>

# v2.0.11 - Dec 13 2022

#### Elements
- Cleaned up comments in files of elems folder.

#### r-panel
- Added `inactive` class when panel is not shown.

<br/>

# v2.0.10 - Dec 12 2022

#### Global
- Updated version strings in base and cli modules to prevent wrong upgrades.
- Updated versions of dependencies for babel-plugin-riza.

<br/>

# v2.0.9 - Dec 05 2022

#### Api
- Added flag Api.DISABLE_CORS to set request mode to 'no-cors' when desired. Defaults to off.
- Added method `request` to Api to execute GET/POST/DELETE/PUT requests.

#### Global
- Started recording changelog.
