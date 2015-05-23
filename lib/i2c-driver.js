/**
 * Cylon.js - i2c Base Driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = module.exports = function I2CDriver(opts) {
  I2CDriver.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.address = opts.address;
};

Cylon.Utils.subclass(I2CDriver, Cylon.Driver);

I2CDriver.prototype.start = function(callback) {
  callback();
};

I2CDriver.prototype.halt = function(callback) {
  callback();
};
