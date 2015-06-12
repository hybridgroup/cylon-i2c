/*
 * LIDAR-Lite driver
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * LIDAR-Lite Driver
 *
 * @constructor LidarLite
 */
var LIDARLite = module.exports = function LIDARLite() {
  LIDARLite.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x62;
  this.commands = {
    distance: this.distance
  };
};

Cylon.Utils.subclass(LIDARLite, I2CDriver);

// Register to write to initiate ranging.
LIDARLite.RegisterMeasure = 0x00;
// Value to initiate ranging.
LIDARLite.MeasureValue = 0x04;
// Register to get both High and Low bytes in 1 call.
LIDARLite.RegisterHighLowB = 0x8f;

/**
 * Returns the distance data for the LIDAR-Lite in cm.
 *
 * @param {Function} callback function to be invoked when done
 * @return {void}
 * @publish
 */
LIDARLite.prototype.distance = function(callback) {
  this.connection.i2cWrite(this.address,
                           LIDARLite.RegisterMeasure,
                           LIDARLite.MeasureValue);
  Cylon.Utils.sleep(20);

  this.connection.i2cRead(
    this.address,
    LIDARLite.RegisterHighLowB,
    2,
    function(err, data) {
      if (typeof callback === "function") {
        callback(err, this.parseDistance(data));
      }
    }.bind(this)
  );
};

/**
 * parseDistance
 *
 * @param {Number} val value to parse
 * @return {number} represents the current distance
 */
LIDARLite.prototype.parseDistance = function(val) {
  return (val[0] << 8) + val[1];
};
