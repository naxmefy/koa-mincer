"use strict";

const supertest = require("co-supertest");

const koa = require("koa");
const koaMincer = require("..");

const app = module.exports = koa();

// ...

app.use(koaMincer({
    root: __dirname,
    production: app.env === "production",
    mountPoint: "/assets",
    manifestFile: __dirname + "/public/assets/manifest.json",
    paths: [
        "assets/css",
        "assets/js",
        "assets/templates"
    ]
}));

// ...

const request = supertest(app.listen());

describe("koa-mincer", function () {
    describe("asset pipeline", function () {
        it("should response 200 and asset for GET /assets/asset.js", function*() {
            const response = yield request.get("/assets/asset.js").end();
            response.status.should.be.eql(200);
            response.headers["content-type"].should.be.containEql("application/javascript");
            response.text.should.be.containEql("var x = 1;");
        });

        it("should response 200 and asset for GET /assets/asset.css", function*() {
            const response = yield request.get("/assets/asset.css").end();
            response.status.should.be.eql(200);
            response.headers["content-type"].should.be.containEql("text/css");
            response.text.should.be.containEql("body{background-color: red;}");
        });
    });
});