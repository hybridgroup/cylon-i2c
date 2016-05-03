/*
 * HMC5883L I2C magnetometer driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2016 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/
/*eslint no-undef: "error"*/
/*eslint-env node*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * HMC5883L Driver
 *
 * @constructor hmc5883L
 */

var HMC5883L = module.exports = function HMC5883L() {
  HMC5883L.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x1E;

  this.commands = {
    getMag: this.getMag
    };
};


Cylon.Utils.subclass(HMC5883L, I2CDriver);

HMC5883L.ADDRESS = 0x1E;

HMC5883L.CONFIG_REG_A = 0x00;
HMC5883L.CONFIG_REG_B = 0x01;
HMC5883L.MODE_REG = 0x02;

HMC5883L.REG_OUT_X_MSB = 0x03;
HMC5883L.REG_OUT_X_LSB = 0x04;
HMC5883L.REG_OUT_Z_MSB = 0x05;
HMC5883L.REG_OUT_Z_LSB = 0x06;
HMC5883L.REG_OUT_Y_MSB = 0x07;
HMC5883L.REG_OUT_Y_LSB = 0x08;


HMC5883L.REG_STATUS = 0x09;
HMC5883L.IDENTIFICATION_REG_A = 0x10;
HMC5883L.IDENTIFICATION_REG_A = 0x11;
HMC5883L.IDENTIFICATION_REG_A = 0x12;


/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */


HMC5883L.prototype.start = function(callback) {
  this._initMag();
  callback();
};

/**
 * Gets the value of Magnetometer.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */

HMC5883L.prototype.getMag = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                            HMC5883L.REG_OUT_Z_LSB,
                            6,
      function(err, d) {
        if (err) {
          callback(err, null);
        } else {
          var result = {};
          var data = new Buffer(d);
          result.x = data.readInt16LE(0);
          result.y = data.readInt16LE(2);
          result.z = data.readInt16LE(4);
          callback(null, result);
        }
      }
    );
};

HMC5883L.prototype._initMag = function() {

  // Sets the mode to read the register
  this.connection.i2cWrite(this.address, HMC5883L.MODE_REG, 0x3C);

};
