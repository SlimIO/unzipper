// Require Node.JS Dependencies
const { join } = require("path");
const {
    rmdir,
    access
} = require("fs").promises;

// Require Third-Party Dependencies!
const japaTest = require("japa");
const del = require("del");
const is = require("@slimio/is");

// Require Internal Dependencies
const unzip = require("../index.js");

const ZIP_FILE_NAME = "testUnzip";
const ZIP_PATH = join(__dirname, `${ZIP_FILE_NAME}.zip`);

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
    japaTest.failing("options.dir param must be a type <string>", async(assert) => {
        const error = await unzip(ZIP_PATH, { dir: 10 });
        assert.isFalse(error, "options.dir param must be a type <string>");
    });

    japaTest.failing("options.dir param must be a type <string>", async(assert) => {
        const error = await unzip(ZIP_PATH, { dir: 10 });
        assert.isFalse(error, "options.dir param must be a type <string>");
    });

    japaTest.failing("options.dir param is not an absolute path", async(assert) => {
        const error = await unzip(ZIP_PATH, { dir: "foo" });
        assert.isFalse(error, "options.dir param is not an absolute path");
    });

    japaTest.failing("options.log param must be a type <boolean>", async(assert) => {
        const error = await unzip(ZIP_PATH, { dir: __dirname, log: 10 });
        assert.isFalse(error, "options.log param must be a type <boolean>");
    });

    japaTest.failing("options.log param must be a type <boolean>", async(assert) => {
        const error = await unzip(ZIP_PATH, { dir: __dirname, log: "10" });
        assert.isFalse(error, "options.log param must be a type <boolean>");
    });

    japaTest.failing("options.logFile param must be a type <boolean>", async(assert) => {
        const error = await unzip(ZIP_PATH, { dir: __dirname, logFile: 10 });
        assert.isFalse(error, "options.logFile param must be a type <boolean>");
    });
    japaTest.failing("options.logFile param must be a type <boolean>", async(assert) => {
        const error = await unzip(ZIP_PATH, { dir: __dirname, logFile: "10" });
        assert.isFalse(error, "options.logFile param must be a type <boolean>");
    });
});

japaTest.group("All Unzip", (group) => {
    group.afterEach(async() => {
        // await new Promise((resolve) => setTimeout(resolve, 100));
        const exeption = [
            join(`!${__dirname}`),
            join(`!${__dirname}`, "test.js"),
            join(`!${__dirname}`, "testUnzip.zip")
        ];
        const deletedPaths = await del([
            join(__dirname, "**"),
            ...exeption
        ]);
    });

    japaTest("Basic unzip", async(assert) => {
        const basicDir = join(__dirname, ZIP_FILE_NAME);

        await unzip(ZIP_PATH, { dir: __dirname });
        await testUnzip(assert, basicDir);
    });

    japaTest("Unzip with added directory", async(assert) => {
        const addedDir = `${__dirname}/dir`;
        const basicDir = join(addedDir, ZIP_FILE_NAME);

        await unzip(ZIP_PATH, { dir: addedDir });
        await testUnzip(assert, basicDir);
    });
});
