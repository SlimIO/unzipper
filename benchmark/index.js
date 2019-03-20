// Require Node.js Dependencies
const { join } = require("path");

// Require Third-party Dependencies
const del = require("del");
const extract = require("extract-zip");
const { downloadNodeFile, constants: { File } } = require("@slimio/nodejs-downloader");

// Require Internal Dependencies
const unzip = require("../");

async function main() {
    const fName = await downloadNodeFile(File.WinBinary64, { dest: __dirname });

    // SlimIO Benchmark
    try {
        const dir = join(__dirname, "slimio");
        console.time("slimio_unzip");
        await unzip(fName, { dir });
        console.timeEnd("slimio_unzip");

        await del([dir]);
    }
    catch (err) {
        console.error("Failed to process SlimIO benchmark!");
    }

    // ExtractZip Benchmark
    try {
        const dir = join(__dirname, "extractzip");
        console.time("extract_zip");
        await new Promise((resolve, reject) => {
            extract(fName, { dir }, function extractzip(err) {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
        console.timeEnd("extract_zip");

        await del([dir]);
    }
    catch (err) {
        console.error("Failed to process ExtractZip benchmark!");
    }

    await del([fName]);
}
main().catch(console.error);
