// Require Node.JS Dependencies
const { join } = require("path");

// Require Third-Party Dependencies!
const avaTest = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const unzip = require("../index.js");

avaTest("Bypass", async(assert) => {
    await unzip(join(__dirname, "/Cache.zip"), { dir: __dirname, log: true });
    assert.pass();
});
