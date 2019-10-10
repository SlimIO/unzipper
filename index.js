"use strict";

// Require Node.js Dependencies
const { createWriteStream, promises: { mkdir } } = require("fs");
const { join } = require("path");
const { promisify } = require("util");

// Require Third-Party Dependencies!
const yauzl = require("yauzl");

// Vars
const open = promisify(yauzl.open);

/**
 * @namespace Unzipper
 */

/**
 * @version 1.0.0
 *
 * @async
 * @public
 * @function unzip
 * @memberof Unzipper#
 * @param {!string} filePath String path .zip
 * @param {object} [options] Options object
 * @param {string} options.dir Output directory
 * @param {boolean} options.log Log information to the stdout
 * @returns {Promise<void>}
 *
 * @throws {TypeError}
 * @throws {Error}
 */
async function unzip(filePath, options = Object.create(null)) {
    const { log = false, dir: unzipDir = process.cwd() } = options;

    if (typeof unzipDir !== "undefined" && typeof unzipDir !== "string") {
        throw new TypeError("options.dir param must be a type <string>");
    }
    if (typeof log !== "undefined" && typeof log !== "boolean") {
        throw new TypeError("options.log param must be a type <boolean>");
    }

    const zipFile = await open(filePath, { lazyEntries: true });
    await new Promise((resolve, reject) => {
        zipFile.readEntry();
        zipFile.once("end", resolve);
        zipFile.on("entry", (entry) => {
            if (/\/$/.test(entry.fileName)) {
                if (log) {
                    console.log(`Directory: ${entry.fileName}`);
                }
                mkdir(join(unzipDir, entry.fileName), { recursive: true })
                    .then(() => zipFile.readEntry())
                    .catch(reject);
            }
            else {
                zipFile.openReadStream(entry, (err, readStream) => {
                    /* istanbul ignore if  */
                    if (err) {
                        return reject(err);
                    }

                    readStream.once("error", reject);
                    readStream.once("end", () => zipFile.readEntry());
                    if (log) {
                        console.log(`File: ${entry.fileName}`);
                    }

                    const wS = createWriteStream(join(unzipDir, entry.fileName));
                    wS.once("error", reject);
                    readStream.pipe(wS);

                    return void 0;
                });
            }
        });
    });
}

module.exports = unzip;
