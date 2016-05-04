/*
 * MMA8452Q I2C accelerometer driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A MMA8452Q Driver
 *
 * @constructor mma8442q
 */
var MMA8452Q = module.exports = function MMA8452Q() {
  MMA8452Q.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x0C;

  this.commands = {
    getAccel: this.getAccel
  };
};

Cylon.Utils.subclass(MMA8452Q, I2CDriver);

MMA8452Q.STATUS_MMA8452Q = 0x00;
MMA8452Q.OUT_X_MSB = 0x01;
MMA8452Q.OUT_X_LSB = 0x02;
MMA8452Q.OUT_Y_MSB = 0x03;
MMA8452Q.OUT_Y_LSB = 0x04;
MMA8452Q.OUT_Z_MSB = 0x05;
MMA8452Q.OUT_Z_LSB = 0x06;
MMA8452Q.SYSMOD = 0x0B;
MMA8452Q.INT_SOURCE = 0x0C;
MMA8452Q.WHO_AM_I = 0x0D;
MMA8452Q.XYZ_DATA_CFG = 0x0E;
MMA8452Q.HP_FILTER_CUTOFF = 0x0F;
MMA8452Q.PL_STATUS = 0x10;
MMA8452Q.PL_CFG = 0x11;
MMA8452Q.PL_COUNT = 0x12;
MMA8452Q.PL_BF_ZCOMP = 0x13;
MMA8452Q.P_L_THS_REG = 0x14;
MMA8452Q.FF_MT_CFG = 0x15;
MMA8452Q.FF_MT_SRC = 0x16;
MMA8452Q.FF_MT_THS = 0x17;
MMA8452Q.FF_MT_COUNT = 0x18;
MMA8452Q.TRANSIENT_CFG = 0x1D;
MMA8452Q.TRANSIENT_SRC = 0x1E;
MMA8452Q.TRANSIENT_THS = 0x1F;
MMA8452Q.TRANSIENT_COUNT = 0x20;
MMA8452Q.PULSE_CFG = 0x21;
MMA8452Q.PULSE_SRC = 0x22;
MMA8452Q.PULSE_THSX = 0x23;
MMA8452Q.PULSE_THSY = 0x24;
MMA8452Q.PULSE_THSZ = 0x25;
MMA8452Q.PULSE_TMLT = 0x26;
MMA8452Q.PULSE_LTCY = 0x27;
MMA8452Q.PULSE_WIND = 0x28;
MMA8452Q.ASLP_COUNT = 0x29;
MMA8452Q.CTRL_REG1 = 0x2A;
MMA8452Q.CTRL_REG2 = 0x2B;
MMA8452Q.CTRL_REG3 = 0x2C;
MMA8452Q.CTRL_REG4 = 0x2D;
MMA8452Q.CTRL_REG5 = 0x2E;
MMA8452Q.OFF_X = 0x2F;
MMA8452Q.OFF_Y = 0x30;
MMA8452Q.OFF_Z = 0x31;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
MMA8452Q.prototype.start = function(callback) {
  this._initAccel();
  callback();
};

/**
 * Gets the value of Accelerometer.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */
MMA8452Q.prototype.getAccel = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          MMA8452Q.OUT_X_MSB,
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

MMA8452Q.prototype._initAccel = function() {

 this.connection.i2cWrite(this.address, MMA8452Q.SYSMOD, 0x01);

};
