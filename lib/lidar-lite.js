/*
 * LIDAR-Lite driver
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

// jshint unused:false

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

// Register to write to initiate ranging.
var RegisterMeasure = 0x00,
// Value to initiate ranging.
MeasureValue = 0x04,
// Register to get both High and Low bytes in 1 call.
RegisterHighLowB = 0x8f;

/**
 * LIDAR-Lite Driver
 *
 * @constructor lidar-lite
 */
var LIDARLite = module.exports = function LIDARLite() {
  LIDARLite.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x62;
  this.commands = {
    distance: this.distance
  };
};

Cylon.Utils.subclass(LIDARLite, I2CDriver);

/**
 * Returns the distance data for the LIDAR-Lite in cm.
 *
 * @param {Function} callback
 * @return {null}
 * @publish
 */
LIDARLite.prototype.distance = function(callback) {
  this.connection.i2cWrite(this.address, RegisterMeasure, MeasureValue);
  Cylon.Utils.sleep(20);

  this.connection.i2cRead(
    this.address,
    RegisterHighLowB,
    2,
    function(err, data) {
      if ("function" === typeof(callback)) {
        callback(err, this.parseDistance(data));
      }
    }.bind(this)
  );
};

/**
 * parseDistance
 *
 * @param {Number} val
 * @return {number} represents the current distance
 */
LIDARLite.prototype.parseDistance = function(val) {
  return (val[0] << 8) + val[1];
};
