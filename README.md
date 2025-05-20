<p align="center">
	<img src="https://img.shields.io/npm/v/riza?label=version&color=%2300a020&style=flat-square"/>
	<img src="https://img.shields.io/npm/dt/riza?color=%23a000a0&style=flat-square"/>
	<img src="https://img.shields.io/bundlephobia/min/riza/latest?color=%2300a0b0&style=flat-square"/>
</p>

<br/>

<img src="./docs/logo-512.png" style="width: 300px;" />

<br/>

Riza is a UI library that provides functionality to build custom elements, supports connecting directly to [Wind](https://github.com/rsthn/rose-core/blob/master/Wind.md) compliant APIs and several pre-made elements to develop web applications fast.

## Installation

You can use your favorite package manager to install the library, or use the standalone files from the `dist` folder and include the respective flavor (ESM or global) in your `index.html` file.

<small>**NOTE:** All definitions exported by [Rinn](https://github.com/rsthn/rinn/) will be available as direct exports right from the `riza` package.</small>

### Getting Started

You can either import riza directly in your ESM project by installing the package, or you can create a new project using the default minimalistic template using:

```bash
pnpm dlx riza new <my-project>
```

The source files can be easily modified and are located in the `src` folder. The app component is in the `app.jsx` file. Edit it if you like, and run the development server to view the results:

```bash
pnpm dev
```

Now you will see on screen what port was used to spin up the server, it is usually port `1234` so you can direct your browser to [http://localhost:1234/](http://localhost:1234/) and see the app results.

Note that this dev mode enables HMR with [Parcel](https://github.com/parcel-bundler/parcel) so feel free to edit the source files and see the results on screen. When you're done use `CTRL+C` to break and exit the server.

<br/>

## Documentation

View the [docs](./docs/README.md) folder to view documentation of the exported classes and custom elements.
