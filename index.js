// Require Node.js Dependencies
const { createWriteStream, promises: { mkdir } } = require("fs");
const { isAbsolute, join } = require("path");

// Require Third-Party Dependencies!
const is = require("@slimio/is");
const yauzl = require("yauzl");

/**
 * @version 1.0.0
 *
 * @private
 * @function getZipFile
 * @param {String} zipFilePath Zip file path
 *
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
 * @param {String} filePath String path .zip
 * @param {Object} options Options object
 *
 * @throws {Error|TypeError}
 * @returns {Promise<void>}
 */
async function unzip(filePath, options = Object.create(null)) {
    const dirDef = !is.undefined(options.dir);
    if (dirDef && !is.string(options.dir)) {
        throw new TypeError("options.dir param must be a type <string>");
    }
    if (dirDef && !isAbsolute(options.dir)) {
        throw new Error("options.dir param is not an absolute path");
    }
    if (!is.nullOrUndefined(options.log) && !is.boolean(options.log)) {
        throw new TypeError("options.log param must be a type <boolean>");
    }

    const { log = false, dir: unzipDir = process.cwd() } = options;
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
