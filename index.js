"use strict";

// Require Node.js Dependencies
const { createWriteStream, promises: { mkdir } } = require("fs");
const { join } = require("path");

// Require Third-Party Dependencies!
const yauzl = require("yauzl");

/**
 * @namespace Unzipper
 */

/**
 * @version 1.0.0
 *
 * @private
 * @function getZipFile
 * @memberof Unzipper#
 * @param {!string} zipFilePath Zip file path
 * @returns {Promise<ZipFile>}
 */
function getZipFile(zipFilePath) {
    return new Promise((resolve, reject) => {
        yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
            if (err) {
                return reject(err);
            }

            return resolve(zipfile);
        });
    });
}

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

    const zipFile = await getZipFile(filePath);
    await new Promise((resolve, reject) => {
        zipFile.readEntry();
        zipFile.once("end", resolve);
        zipFile.on("entry", async(entry) => {
            if (/\/$/.test(entry.fileName)) {
                try {
                    if (log) {
                        console.log(`Directory: ${entry.fileName}`);
                    }
                    await mkdir(join(unzipDir, entry.fileName), { recursive: true });
                    zipFile.readEntry();
                }
                catch (err) {
                    reject(err);
                }

                return void 0;
            }

            zipFile.openReadStream(entry, (err, readStream) => {
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

            return void 0;
        });
    });
}

module.exports = unzip;
