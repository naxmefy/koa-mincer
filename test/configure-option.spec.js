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
    configure: (connectMincer) => {
        connectMincer.Mincer.CoffeeEngine.configure({bare: false});
    },
    paths: [
        "assets/css",
        "assets/js",
        "assets/templates"
    ]
}));

// ...

const request = supertest(app.listen());

describe("koa-mincer", function () {
    describe("asset pipeline with configure", function () {
        it("should response 200 and asset for GET /assets/coffee.js", function *() {
            const response = yield request.get("/assets/coffee.js").end();
            console.log(response.text);
            response.headers["content-type"].should.be.containEql("application/javascript");
            response.text.should.be.containEql("(function() {");
            response.text.should.be.containEql("var x;");
            response.text.should.be.containEql("x = 2;");
            response.text.should.be.containEql("}).call(this);");
        });
    });
});
