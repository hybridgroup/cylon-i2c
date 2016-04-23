/*
 * MAG3110 I2C magnetometer driver
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
 * A MAG3110 Driver
 *
 * @constructor mag3110
 */

var MAG3110 = module.exports = function MAG3110() {
  MAG3110.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x0E;

  this.commands = {
      getMag: this.getMag
  };
};


Cylon.Utils.subclass(MAG3110, I2CDriver);

MAG3110.REG_DR_STATUS = 0x00;
MAG3110.REG_OUT_X_MSB = 0x01;
MAG3110.REG_OUT_X_LSB = 0x02;
MAG3110.REG_OUT_Y_MSB = 0x03;
MAG3110.REG_OUT_Y_LSB = 0x04;
MAG3110.REG_OUT_Z_MSB = 0x05;
MAG3110.REG_OUT_Z_LSB = 0x06;

MAG3110.REG_WHO_AM_I = 0x07;
MAG3110.REG_SYSMOD = 0x08;

MAG3110.REG_OFF_X_MSB = 0x09;
MAG3110.REG_OFF_X_LSB = 0x0A;
MAG3110.REG_OFF_Y_MSB = 0x0B;
MAG3110.REG_OFF_Y_LSB = 0x0C;
MAG3110.REG_OFF_Z_MSB = 0x0D;
MAG3110.REG_OFF_Z_LSB = 0x0E;
MAG3110.REG_DIE_TEMP = 0x0F;
MAG3110.REG_CTRL_REG1 = 0X10;
MAG3110.REG_CTRL_REG2 = 0X11;

MAG3110.MASK_DR = 0xE0;
MAG3110.MASK_OSR = 0x18;

MAG3110.BIT_ACTIVE = 0x0;
MAG3110.BIT_AUTO_RESET = 0x7;
MAG3110.BIT_RAW = 0x5;
MAG3110.BIT_RESET = 0x4;

MAG3110.SYSMOD_STANDBY = 0x0;
MAG3110.SYSMOD_ACTIVE_RAW = 0x1;
MAG3110.SYSMOD_ACTIVE = 0x2;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */


MAG3110.prototype.start = function(callback) {
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

MAG3110.prototype.getMag = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          MAG3110.REG_OFF_MSB,
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

MAG3110.prototype._initMag = function() {

  // set mag into active mode Raw data
  // Enable automatic magnetic sensor resets
  // by setting bit AUTO_MRST_EN in CTRL_REG2. CTRL_REG2 = 0x80
  this.connection.i2cWrite(this.address, MAG3110.REG_CTRL_REG1, 0x01);

  // temperature
  this.connection.i2cWrite(this.address, MAG3110.REG_DIE_TEMP, 0x0F);

};
