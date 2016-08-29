/*
 * L3GD20H I2C gyroscope driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2016 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A L3GD20H Driver
 *
 * @constructor l3gd20h
 */
var L3GD20H = module.exports = function L3GD20H() {
  L3GD20H.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x6B;

  this.commands = {
    getGyro: this.getGyro
  };
};

Cylon.Utils.subclass(L3GD20H, I2CDriver);

L3GD20H.WHO_AM_I = 0x0F;

L3GD20H.CTRL1 = 0x20;
L3GD20H.CTRL2 = 0x21;
L3GD20H.CTRL3 = 0x22;
L3GD20H.CTRL4 = 0x23;
L3GD20H.CTRL5 = 0x24;
L3GD20H.REFERENCE = 0x25;
L3GD20H.OUT_TEMP = 0x26;
L3GD20H.STATUS = 0x27;
L3GD20H.OUT_X_L = 0x28;
L3GD20H.OUT_X_H = 0x29;
L3GD20H.OUT_Y_L = 0x2A;
L3GD20H.OUT_Y_H = 0x2B;
L3GD20H.OUT_Z_L = 0x2C;
L3GD20H.OUT_Z_H = 0x2D;
L3GD20H.FIFO_CTRL = 0x2E;
L3GD20H.FIFO_SRC = 0x2F;
L3GD20H.IG_CFG = 0x30;
L3GD20H.IG_SRC = 0x31;
L3GD20H.IG_THS_XH = 0x32;
L3GD20H.IG_THS_XL = 0x33;
L3GD20H.IG_THS_YH = 0x34;
L3GD20H.IG_THS_YL = 0x35;
L3GD20H.IG_THS_ZH = 0x36;
L3GD20H.IG_THS_ZL = 0x37;
L3GD20H.IG_DURATION = 0x38;
L3GD20H.LOW_ODR = 0x39;


/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
L3GD20H.prototype.start = function(callback) {
  this._initGyro();
  callback();
};

/**
 * Gets the value of Gyroscope.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */
L3GD20H.prototype.getGyro = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          L3GD20H.OUT_X_L,
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

L3GD20H.prototype._initGyro = function() {

   this.connection.i2cWrite(this.address, L3GD20H.CTRL1, 0xF);
   this.connection.i2cWrite(this.address, L3GD20H.CTRL2, 0x00);
   this.connection.i2cWrite(this.address, L3GD20H.CTRL6, 0x0);

};
