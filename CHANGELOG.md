# v3.0.42 - Jul 30 2025

#### QoL
- Added `getInnerHTML` function to Element.
- Updated dependencies.

<br/>

# v3.0.40 - May 19 2025

#### QoL
- Package manager auto detected now when using `riza new`.
- Updated README.md
- Updated dependencies.

<br/>

# v3.0.39 - Apr 12 2025

#### QoL
- Updated dependencies.

<br/>

# v3.0.37 - Mar 22 2025

#### Riza Signal
- Added `emit` function as future replacement for `notify`.
- Function `emit` and `notify` now include the signal's value.

#### Element
- Fixed bug causing r-dom-probe not to be detected when a custom prefix is used.
- Added option 'riza_data_property' to override data-property attribute name.

#### r-table
- Container tag is now taken from the data-container attribute.

<br/>

# v3.0.36 - Jan 04 2025

#### r-tabs
- Fixed bug causing partial routes not to keep the respective link with 'is-active' class.

<br/>

# v3.0.35 - Dec 21 2024

#### r-panel
- Fixed bug with the `is-inactive` class when pre-set in the element.

<br/>

# v3.0.34 - Dec 21 2024

#### Api
- Added docstrings to document public functions.
- Added `headers` method to set global headers using an object.
- Added methods `appendParams` and `getAbsoluteUrl`.
- Removed deprecated `makeUrl` in favor of `getAbsoluteUrl`.
- Polished new `request` function.

#### r-form
- Added method `onfieldchanged` triggered when a field of the form changes.

<br/>

# v3.0.33 - Dec 20 2024

#### General
- [Element] Added global method `getRoot`.
- [Api] Added fixup to ensure methods not allowing body will use the query parameters to pass data.
- [Utils] Added method `loadAsBase64`.

#### r-panel
- Fixed bug that removed `is-inactive` if the panel had that class already from the start.

#### r-form
- Added method `preprocess` called right before sending the data to the API.
- Added support for model constraints.

#### r-select
- Added options `data-option-value` and `data-option-label` to change the default value/label fields.

<br/>

# v3.0.32 - Nov 08 2024

#### General
- Added support for global variable `riza_element_prefix` to override the `r-` prefix of custom elements.
- Updated dependencies and added riza signal exports to standalone browser build.
- Added `get` and `set` methods to riza signals.

<br/>

# v3.0.31 - Jun 15 2024
- Quick fixup to `apiCall` to prevent undefined value when `relativeUrl` is not specified.

# v3.0.30 - May 29 2024

#### Template
- Added 'hasPrivilege' to signal-utils.
- Updated signal-utils with new functions and renamed old ones to be more simple.
- Fixed minor CSS issues.
- Added `signalize` to signal-utils.
- Updated xui dependency.
- Updated panels/profile/password to use new change password fields.

#### Element
- Added short-press event to be used when a simple click event is desired and using long-press at the same time.
- Fixed bug causing multiple 'short-press' and 'long-press' events firing when activated.

#### Router
- Added `navigationContext` property and `contextNavigate`.

#### Api
- Added option WIND_V3 to flags to enable compatibility with Wind V3 behavior.
- Methods 'get', 'post', 'put', 'patch' and 'delete' are now async and return a promise.

#### r-form
- Added support for JSON payload when the data-action is a path instead of a function name.

#### DataList
- Added static method 'get' to create or return a global data list.

#### DataSource
- Added static method 'get' to create or return a global data source.

#### Global
- Elements r-list, r-paginator, r-select and r-table now accept a string for dataList or dataSource respectively to create a global DataList or DataSource if desired.

<br/>

# v3.0.29 - Mar 07 2024

#### Template
- Updated actions, public-area, and file-utils

#### r-form
- Field-level errors (span) are no longer shown if the message is empty.

<br/>

# v3.0.27 - Feb 09 2024

#### Template
- Added support for device authentication in `checkAuth` function of `actions.js`
- Added fields to detect and store device token and device secret in login and otp panels.

<br/>

# v3.0.26 - Jan 13 2024

#### Element
- Methods `dispatch`, `dispatchOn` and `setInnerHTML` now return the self element.

#### Router
- The `location` and `args` properties are automatically set now upon Router initialization.

#### Template
- Updated function `tr` in i18n.js to support arguments (using placeholder '@@').

<br/>

# v3.0.24 - Dec 27 2023

#### Template
- Added `formatNumber` function to utils.js

#### r-paginator
- Added default property isRoot set to true.

#### Api
- Fixed bug when calling `fetch` with a single object parameter.

<br/>

# v3.0.23 - Nov 26 2023

#### Template
- Added error area to show when authStatus is ERROR.
- Added logo for the splash screen.
- Added common/utils.js file with utility functions.

#### Api
- Added parameter `method` to function `fetch`.

<br/>

# v3.0.22 - Nov 24 2023

#### General
- Added new riza application template `app` with more pre-defined features.
- Added tsdocs for `geo` static class.
- All custom elements have now `isRoot` set to `false` by default.
- Elements `r-form`, `r-item` and `r-table` have `isRoot` set to `true`, can be overridden with the `data-root` attribute.
- Updated dependencies.

<br/>

# v3.0.20 - Nov 10 2023

#### RuntimeJsx
- Added new trait 'trait::checked' to link a signal to the checked property of an input.
- Added new trait 'trait::selected' to link a signal to the 'selected' property of an option.
- Deprecated traits 'valueSignal' and 'inputSignal' in favor of 'value' and 'input'.

<br/>

# v3.0.19 - Nov 05 2023

#### General
- Patched runtime-jsx to convert event attribute names (starting with `on`) to lower case.
- Updated dependencies (riza-signal).

<br/>

# v3.0.18 - Oct 21 2023

#### General
- Added `geo` static class to access geolocation features.

#### app-jsx
- Added more functions to signal-utils.

<br/>

# v3.0.17 - Oct 11 2023

#### riza-signal
- Added support for typed signals by using the `is` method to specify the signal type.
- Patched to remove automatic type detection.
- Added method `disconnect` to remove a listener.
- Added support for signal validators using the `validator` function.
- Added validators: `min` and `max`.

#### RuntimeJsx
- Renamed traits `valueSignal` to `value`, and `inputSignal` to `input`. Old names will be available until next minor version.

#### General
- Added `signal-utils.js` and `file-utils.js` to common folder of app-jsx.

<br/>

# v3.0.15 - Sep 21 2023

#### General
- Updated app-jsx template to include `xui` CSS helphers and upgraded dependencies.
- Bug fixes in runtime-jsx.

#### babel-plugin-riza
- Fixed bug causing spread-attributes not to be marked dynamic.
- Patched transpiler to force elements to be dynamic to prevent clones.

<br/>

# v3.0.14 - Sep 07 2023

#### General
- Elements `r-list` and `r-table` now also pass the actual Model object to the item builder (second parameter).

<br/>

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
