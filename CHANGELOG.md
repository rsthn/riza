# v2.0.13 - Jan 25 2023

#### Api
- Failure callback now includes `err` as first parameter.

#### RuntimeJsx
- Added `default` property to signal, set as the value passed when creating it.

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
