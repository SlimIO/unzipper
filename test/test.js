"use strict";

// Require Node.JS Dependencies
const { join } = require("path");
const { access } = require("fs").promises;

// Require Third-Party Dependencies!
const japaTest = require("japa");
const del = require("del");

// Require Internal Dependencies
const unzip = require("../");

const ZIP_FILE_NAME = "testUnzip";
const ZIP_PATH = join(__dirname, `${ZIP_FILE_NAME}.zip`);

/**
 * @version 1.0.0
 *
 * @async
 * @function testUnzip test
 * @param {!object} assert assert
 * @param {object} basicDir basicdir
 * @returns {Promise<void>}
 *
 */
async function testUnzip(assert, basicDir) {
    try {
        await Promise.all([
            access(basicDir),
            access(join(basicDir, "foo")),
            access(join(basicDir, "slimio.txt")),
            access(join(basicDir, "foo", "discord.JPG")),
            access(join(basicDir, "foo", "lorem")),
            access(join(basicDir, "foo", "lorem", "ipsum.txt"))
        ]);
        assert.isTrue(true);
    }
    catch (err) {
        assert.isTrue(false);
    }
}


japaTest.group("All throw error", (group) => {
    japaTest("wrong zip path", async(assert) => {
        assert.plan(1);
        try {
            await unzip("foo");
        }
        catch ({ code }) {
            assert.equal(code, "ENOENT");
        }
    });

    japaTest("options.dir param must be a type <string>", async(assert) => {
        assert.plan(1);
        try {
            await unzip(ZIP_PATH, { dir: 10 });
        }
        catch ({ message }) {
            assert.equal(message, "options.dir param must be a type <string>");
        }
    });

    japaTest("options.log param must be a type <boolean> | number", async(assert) => {
        assert.plan(1);
        try {
            await unzip(ZIP_PATH, { dir: __dirname, log: 10 });
        }
        catch ({ message }) {
            assert.equal(message, "options.log param must be a type <boolean>");
        }
    });

    japaTest("options.log param must be a type <boolean> | string", async(assert) => {
        assert.plan(1);
        try {
            await unzip(ZIP_PATH, { dir: __dirname, log: "10" });
        }
        catch ({ message }) {
            assert.equal(message, "options.log param must be a type <boolean>");
        }
    });
});

japaTest.group("All Unzip", (group) => {
    group.afterEach(async() => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const exceptions = [
            join(`!${__dirname}`),
            join(`!${__dirname}`, "test.js"),
            join(`!${__dirname}`, "testUnzip.zip")
        ];
        await del([
            join(__dirname, "**"),
            ...exceptions
        ]);
    });

    japaTest("Basic unzip", async(assert) => {
        const basicDir = join(__dirname, ZIP_FILE_NAME);

        await unzip(ZIP_PATH, { dir: __dirname });
        await testUnzip(assert, basicDir);
    });

    japaTest("Basic unzip with log", async(assert) => {
        const basicDir = join(__dirname, ZIP_FILE_NAME);

        await unzip(ZIP_PATH, { dir: __dirname, log: true });
        await testUnzip(assert, basicDir);
    });

    japaTest("Unzip with added directory", async(assert) => {
        const addedDir = `${__dirname}/dir`;
        const basicDir = join(addedDir, ZIP_FILE_NAME);

        await unzip(ZIP_PATH, { dir: addedDir });
        await testUnzip(assert, basicDir);
    });
});
