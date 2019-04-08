# Unzipper
![Version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/unzipper/master/package.json?token=Aeue0P3eryCYRikk9tHZScyXOpqtMvFIks5ca-XwwA%3D%3D&query=$.version&label=Version)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/SlimIO/Winmem/blob/master/LICENSE)

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

## License
MIT
