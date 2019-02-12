# @slimio/unzipper
![Version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/unzipper/master/package.json?token=Aeue0P3eryCYRikk9tHZScyXOpqtMvFIks5ca-XwwA%3D%3D&query=$.version&label=Version)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/SlimIO/Winmem/blob/master/LICENSE)

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/unzipper
# or
$ yarn add @slimio/unzipper
```

## API

### unzip(filePath: string, options?: unzipOptions): void;

```js
const unzip = require("@slimio/unzipper");

const filePath = "your/zip/file.zip";
await unzip(filePath);
// or
await unzip(filePath, { dir: "/to/specific/dir" });
```

### Options
```ts
interface unzipOptions {
    dir: string;
    log: boolean;
    logFile: boolean;
}
```

- `dir` : unzip directory target. Default : `process.cwd();`
- `log` : Log directories and files path
- `logFile` : Log all files content

## License
MIT
