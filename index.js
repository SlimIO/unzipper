// Require Node.JS Dependencies
const {
    createWriteStream,
    promises: { mkdir }
} = require("fs");
const { isAbsolute, join } = require("path");

// Require Third-Party Dependencies!
const is = require("@slimio/is");
const yauzl = require("yauzl");

let UNZIP_DIR = process.cwd();
let LOG = false;
let LOG_FILE = false;


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
 * @private
 * @function readAllEntries
 * @param {ZipFile} zipfile ZipFile Object
 *
 * @returns {Promise<void>}
 */
function readAllEntries(zipfile) {
    return new Promise((resolve, reject) => {
        zipfile.readEntry();
        zipfile.once("end", resolve);
        zipfile.on("entry", async(entry) => {
            if (/\/$/.test(entry.fileName)) {
                try {
                    if (LOG) {
                        console.log(`Directory: ${entry.fileName}`);
                    }
                    await mkdir(join(UNZIP_DIR, entry.fileName), { recursive: true });
                    zipfile.readEntry();
                }
                catch (err) {
                    reject(err);
                }

                return void 0;
            }

            zipfile.openReadStream(entry, (err, readStream) => {
                if (err) {
                    return reject(err);
                }

                readStream.once("error", reject);
                readStream.on("end", () => zipfile.readEntry());
                if (LOG) {
                    console.log(`File: ${entry.fileName}`);
                }

                const wS = createWriteStream(join(UNZIP_DIR, entry.fileName));
                wS.once("error", reject);
                readStream.pipe(wS);

                return void 0;
            });

            return void 0;
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
    if (!is.nullOrUndefined(options.dir) && !is.string(options.dir)) {
        throw new TypeError("options.dir param must be a type <string>");
    }
    if (!is.nullOrUndefined(options.dir) && !isAbsolute(options.dir)) {
        throw new Error("options.dir param is not an absolute path");
    }

    if (!is.nullOrUndefined(options.log) && !is.boolean(options.log)) {
        throw new TypeError("options.log param must be a type <boolean>");
    }
    if (!is.nullOrUndefined(options.logFile) && !is.boolean(options.logFile)) {
        throw new TypeError("options.logFile param must be a type <boolean>");
    }

    UNZIP_DIR = is.nullOrUndefined(options.dir) ? process.cwd() : options.dir;
    LOG = is.nullOrUndefined(options.log) ? false : options.log;
    LOG_FILE = is.nullOrUndefined(options.logFile) ? false : options.logFile;

    const zipFile = await getZipFile(filePath);
    await readAllEntries(zipFile);
}

module.exports = unzip;
