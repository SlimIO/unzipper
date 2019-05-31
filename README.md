# Unzipper
![Version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/unzipper/master/package.json?token=Aeue0P3eryCYRikk9tHZScyXOpqtMvFIks5ca-XwwA%3D%3D&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/unzipper/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/SlimIO/unzipper.svg)
![size](https://img.shields.io/bundlephobia/min/@slimio/unzipper.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/SlimIO/unzipper/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SlimIO/unzipper?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/unzipper.svg?branch=master)](https://travis-ci.com/SlimIO/unzipper) [![Greenkeeper badge](https://badges.greenkeeper.io/SlimIO/unzipper.svg)](https://greenkeeper.io/)

Modern unzipper with support of `async/await`. This module use [yauzl](https://github.com/thejoshwolfe/yauzl) under the hood and has been designed to replace [extract-zip](https://github.com/maxogden/extract-zip#readme).

## Requirements
- Node.js v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/unzipper
# or
$ yarn add @slimio/unzipper
```

## Usage example
```js
const { join } = require("path");
const unzip = require("@slimio/unzipper");

const filePath = "your/zip/file.zip";
await unzip(filePath);
// or
await unzip(filePath, { dir: join(__dirname, "yourDirectory") });
```

## API

### Unzipper(filePath: string, options?: Unzipper.ConstructorOptions): void

Extract a zip file

> ⚠️ dir must be an absolute path.

Available options are described by the following TypeScript interface:
```ts
interface ConstructorOptions {
    dir?: string;
    log?: boolean;
}
```

- `dir` : unzip directory target. (Default: `process.cwd()`)
- `log` : Log directories and files path (Default: `false`).

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/is](https://github.com/SlimIO/is#readme)|Minor|Low|Type Checker|
|[yauzl](https://github.com/thejoshwolfe/yauzl)|⚠️Major|High|Unzipper for Node.js|

## License
MIT
