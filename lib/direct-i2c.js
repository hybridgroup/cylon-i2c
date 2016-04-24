/*
 * Direct i2c driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2016 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * DirectI2C Driver
 *
 * @constructor DirectI2C
 */
var DirectI2C = module.exports = function DirectI2C() {
  DirectI2C.__super__.constructor.apply(this, arguments);

  this.commands = {
    read: this.read,
    write: this.write
  };
};

Cylon.Utils.subclass(DirectI2C, I2CDriver);

/**
 * Perform i2c read
 *
 * @param {Number} register to read from
 * @param {Number} len number of bytes to read
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
DirectI2C.prototype.read = function(register, len, callback) {
  this.connection.i2cRead(
    this.address,
    new Buffer(register),
    len,
    function(err, data) {
      if (typeof callback === "function") {
        callback(err, data);
      }
    }
  );
};

/**
 * Perform i2c write
 *
 * @param {Number} cmd command or register to write to
 * @param {Array} data bytes to write
 * @param {Function} callback function to be invoked with any errors
 * @return {void}
 * @publish
 */
DirectI2C.prototype.write = function(cmd, data, callback) {
  this.connection.i2cWrite(
    this.address,
    cmd,
    data,
    function(err) {
      if (typeof callback === "function") {
        callback(err);
      }
    }
  );
};
