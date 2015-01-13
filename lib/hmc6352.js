/*
 * HMC6352 Digital Compass driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

// jshint unused:false

"use strict";

var Cylon = require("cylon");

/**
 * A HMC6352 Driver
 *
 * @constructor
 */
var Hmc6352 = module.exports = function Hmc6352() {
  Hmc6352.__super__.constructor.apply(this, arguments);
  this.address = 0x42 >> 1; // to accomodate the 7-bit device addressing
  this.commands = {
    heading: this.heading
  };
};

Cylon.Utils.subclass(Hmc6352, Cylon.Driver);

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {null}
 */
Hmc6352.prototype.start = function(callback) {
  this.connection.i2cWrite(this.address, this.commandBytes("A"));
  callback();
};

/**
 * Stops the driver
 *
 * @param {Function} callback triggered when the driver is halted
 * @return {null}
 */
Hmc6352.prototype.halt = function(callback) {
  callback();
};

/**
 * Returns the heading data for the compass.
 *
 * @param {Function} callback
 * @return {null}
 * @publish
 */
Hmc6352.prototype.heading = function(callback) {
  this.connection.i2cRead(
    this.address,
    this.commandBytes("A"),
    2,
    function(err, data) {
      if ("function" === typeof(callback)) {
        callback(err, this.parseHeading(data));
      }
    }.bind(this)
  );
};

/**
 * commandBytes
 *
 * @param {String} s
 * @return {null}
 */
Hmc6352.prototype.commandBytes = function(s) {
  return new Buffer(s, "ascii");
};

/**
 * parseHeading
 *
 * @param {Number} val
 * @return {number} represents the current heading
 */
Hmc6352.prototype.parseHeading = function(val) {
  return (val[1] + val[0] * 256) / 10.0;
};
