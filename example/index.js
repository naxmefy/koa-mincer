"use strict";

require("babel-register");
const app = module.exports = require("./app.es6");

if (!module.parent) app.listen(process.env.PORT || 3000);
