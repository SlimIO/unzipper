// Require Node.JS Dependencies
const {
    createWriteStream,
    promises: {
        writeFile,
        mkdir
    }
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
 * @function readStream
 * @param {ZipFile} zipfile ZipFile Object
 * @param {Entry} entry Entry Object from ZipFile
 *
 * @throws {Error}
 * @returns {void}
 */
function readStream(zipfile, entry) {
    zipfile.openReadStream(entry, (err, readStream) => {
        if (err) {
            throw err;
        }

        readStream.on("error", (err) => {
            throw err;
        });

        if (LOG) {
            console.log(`File: ${entry.fileName}`);
        }

        readStream.on("end", () => {
            zipfile.readEntry();
        });

        writeStream(readStream, entry.fileName);
    });
}

/**
 * @version 1.0.0
 *
 * @private
 * @function readStream
 * @param {ReadableStream} readStream ReadableStream Object
 * @param {String} fileName Filename for WritableStream
 *
 * @throws {Error}
 * @returns {void}
 */
function writeStream(readStream, fileName) {
    const write = createWriteStream(join(UNZIP_DIR, fileName));
    write.on("error", (err) => {
        throw err;
    });

    if (LOG_FILE) {
        readStream.pipe(process.stdout);
    }

    readStream.pipe(write);
}

/**
 * @version 1.0.0
 *
 * @async
 * @private
 * @function createDir
 * @param {ZipFile} zipfile ZipFile Object
 * @param {Entry} entry Entry Object from ZipFile
 *
 * @returns {Promise<void>}
 */
async function createDir(zipfile, entry) {
    if (LOG) {
        console.log(`Directory: ${entry.fileName}`);
    }
    await mkdir(join(UNZIP_DIR, entry.fileName), { recursive: true });
    zipfile.readEntry();
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
    return new Promise((resolve) => {
        zipfile.readEntry();
        zipfile.on("entry", async(entry) => {
            if (/\/$/.test(entry.fileName)) {
                await createDir(zipfile, entry);
            }
            else {
                readStream(zipfile, entry);
            }
        });
        zipfile.on("end", () => {
            resolve();
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
