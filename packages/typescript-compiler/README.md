# Meteor Typescript Compiler

## Introduction

TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. The language comes with many additions such as classes, scoping, modules and interfaces.

TypeScript is supported on both the client and the server. Files ending with `.ts` are automatically compiled to JavaScript by this meteor plugin.

See [http://www.typescriptlang.org](http://www.typescriptlang.org) for more information.

## Install

* Run `npm install -g typescript`, you must be running version 1.4*

* **If on Windows, please install the Visual Studio plugin instead of using NPM. All versions are supported through this method.**

* From your Meteor project, type `meteor add meteortypescript:compiler`

That's it! From now on, all `*.ts` files are dynamically compiled into Javascript (client and server).

## What's included?

* Compiler is used for server & client assets using the **tsc** command.
* Compilation uses ECMAScript5 generation on the server & ECMAScript3 on the client.
* Libraries such as **meteor.d.ts** or **node.d.ts** are not bundled with the project (ie. ), please grab them from [https://github.com/meteor-typescript/meteor-typescript-libs](https://github.com/meteor-typescript/meteor-typescript-libs).
* Sample demos built around Meteor+TypeScript can be found in the **samples** folder.

## Using Typescript with Meteor

* Create a lib folder in your project, add **meteor.d.ts** or any other ts description files you may be interested in.
* Refer to the following [coding guidelines](https://github.com/meteor-typescript/meteor-typescript-libs#usage-collections).
* When working with an IDE such as WebStorm, be sure to disable typescript generation.

## Credits

* Authored by [Jason Parekh](https://github.com/jasonparekh) and [Olivier Refalo](https://github.com/orefalo).
* The code is based from the Meteor coffeescript package.

## Updates
* **Jul 8 2015** - fixed an issue on Windows where zzz.ts-compiler.ts would try and make itself on the C:\ drive if your project was located in My Documents. - Jacob Foster
* **Jul 8 2015** - fixed an issue where tsc could not be found on Windows (must install TypeScript for Visual Studio) - Jacob Foster
* **Feb 22 2015** - support for source maps. comments are now removed from generated files.
* **Feb 17 2015** - typescrypt-compiler v2, batch compilation using tsc - code merged from meteor-tsc, thanks to jason parekh.
* **Oct 26 2014** - Upgraded package to latest atmosphere, fixed issues with caching.
* **March 2014** - meteortypescript organization is now live. please join and contribute.
* **May 6 2014** - switched internal compiler to ts-compiler, full support for ts 1.0.
