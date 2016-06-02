/*
 * LSM303DLHC I2C accelerometer & magnetometer driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A LSM303DLHC Driver
 *
 * @constructor lsm303dlhc
 */
var LSM303DLHC = module.exports = function LSM303DLHC() {
  LSM303DLHC.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x19 || 0x1E;

  this.commands = {
    getAccel: this.getAccel,
    getMag: this.getMag,
    getTemp: this.getTemp
  };
};

Cylon.Utils.subclass(LSM303DLHC, I2CDriver);

LSM303DLHC.ADDRESS_ACCEL = 0X19;
LSM303DLHC.ADDRESS_MAG = 0X1E;

LSM303DLHC.CTRL_REG1_A = 0x20;
LSM303DLHC.CTRL_REG2_A = 0x21;
LSM303DLHC.CTRL_REG3_A = 0x22;
LSM303DLHC.CTRL_REG4_A = 0x23;
LSM303DLHC.CTRL_REG5_A = 0x24;
LSM303DLHC.CTRL_REG6_A = 0x25;
LSM303DLHC.REFERENCE_A = 0x26;
LSM303DLHC.STATUS_REG_A = 0x27;
LSM303DLHC.OUT_X_L_A = 0x28 | 0x80;
LSM303DLHC.OUT_X_H_A = 0x29;
LSM303DLHC.OUT_Y_L_A = 0x2A;
LSM303DLHC.OUT_Y_H_A = 0x2B;
LSM303DLHC.OUT_Z_L_A = 0x2C;
LSM303DLHC.OUT_Z_H_A = 0x2D;
LSM303DLHC.FIFO_CTRL_REG_A = 0x2E;
LSM303DLHC.FIFO_SRC_REG_A = 0x2F;
LSM303DLHC.INT1_CFG_A = 0x30;
LSM303DLHC.INT1_SOURCE_A = 0x31;
LSM303DLHC.INT1_THS_A = 0x32;
LSM303DLHC.INT1_DURATION_A = 0x33;
LSM303DLHC.INT2_CFG_A = 0x34;
LSM303DLHC.INT2_SOURCE_A = 0x35;
LSM303DLHC.INT2_THS_A = 0x36;
LSM303DLHC.INT2_DURATION_A = 0x37;
LSM303DLHC.CLICK_CFG_A = 0x38;
LSM303DLHC.CLICK_SRC_A = 0x39;
LSM303DLHC.CLICK_THS_A = 0x3A;
LSM303DLHC.TIME_LIMIT_A = 0x3B;
LSM303DLHC.TIME_LATENCY_A = 0x3C;
LSM303DLHC.TIME_WINDOW_A = 0x3D;

LSM303DLHC.MAG_CRA_REG_M = 0x00;
LSM303DLHC.MAG_CRB_REG_M = 0x01;
LSM303DLHC.MAG_MR_REG_M = 0x02;
LSM303DLHC.MAG_OUT_X_H_M = 0x03;
LSM303DLHC.MAG_OUT_X_L_M = 0x04;
LSM303DLHC.MAG_OUT_Z_H_M = 0x05;
LSM303DLHC.MAG_OUT_Z_L_M = 0x06;
LSM303DLHC.MAG_OUT_Y_H_M = 0x07;
LSM303DLHC.MAG_OUT_Y_L_M = 0x08;
LSM303DLHC.MAG_SR_REG_M = 0x09;
LSM303DLHC.MAG_IRA_REG_M = 0x0A;
LSM303DLHC.MAG_IRB_REG_M = 0x0B;
LSM303DLHC.MAG_IRC_REG_M = 0x0C;
LSM303DLHC.MAG_TEMP_OUT_H_M = 0x31;
LSM303DLHC.MAG_TEMP_OUT_L_M = 0x32;

LSM303DLHC.MAGGAIN_1_3 = 0x20;  // +/- 1.3
LSM303DLHC.MAGGAIN_1_9 = 0x40;  // +/- 1.9
LSM303DLHC.MAGGAIN_2_5 = 0x60;  // +/- 2.5
LSM303DLHC.MAGGAIN_4_0 = 0x80;  // +/- 4.0
LSM303DLHC.MAGGAIN_4_7 = 0xA0;  // +/- 4.7
LSM303DLHC.MAGGAIN_5_6 = 0xC0;  // +/- 5.6
LSM303DLHC.MAGGAIN_8_1 = 0xE0;  // +/- 8.1

LSM303DLHC.MAGRATE_0_7 = 0x00;  // 0.75 Hz
LSM303DLHC.MAGRATE_1_5 = 0x01;  // 1.5 Hz
LSM303DLHC.MAGRATE_3_0 = 0x62;  // 3.0 Hz
LSM303DLHC.MAGRATE_7_5 = 0x03;  // 7.5 Hz
LSM303DLHC.MAGRATE_15 = 0x04;   // 15 Hz
LSM303DLHC.MAGRATE_30 = 0x05;   // 30 Hz
LSM303DLHC.MAGRATE_75 = 0x06;   // 75 Hz
LSM303DLHC.MAGRATE_220 = 0x07;  // 200 Hz

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
LSM303DLHC.prototype.start = function(callback) {
  this._initAccel();
  this._initMag();
  callback();
};

/**
 * Gets the value of Accelerometer.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */
LSM303DLHC.prototype.getAccel = function(callback) {
  var self = this;

  self.connection.i2cRead(LSM303DLHC.ADDRESS_ACCEL,
                          LSM303DLHC.OUT_X_L_A,
                          6,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        var data = new Buffer(d);
        result.Ax = data.readInt16LE(0);
        result.Ay = data.readInt16LE(2);
        result.Az = data.readInt16LE(4);
        callback(null, result);
      }
    }
  );
};

/**
 * Gets the value of Magnetometer.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */
LSM303DLHC.prototype.getMag = function(callback) {
  var self = this;

  self.connection.i2cRead(LSM303DLHC.ADDRESS_MAG,
                          LSM303DLHC.MAG_OUT_X_L_M,
                          6,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        var data = new Buffer(d);
        result.Mx = data.readInt16LE(0);
        result.My = data.readInt16LE(2);
        result.Mz = data.readInt16LE(4);
        callback(null, result);
      }
    }
  );
};

LSM303DLHC.prototype.getTemp = function(callback) {
  var self = this;

  self.connection.i2cRead(this.address,
                          LSM303DLHC.MAG_TEMP_OUT_L_M,
                          2,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        var data = new Buffer(d);
        result.Temp = data.readInt16LE(0) / 8 + 18;
        callback(null, result);
      }
    }
  );
};

LSM303DLHC.prototype._initAccel = function() {
  // enables accelerometer
  this.connection.i2cWrite(this.address, LSM303DLHC.CTRL_REG1_A, 0x57);

  // sets accelerometer resolution
  this.connection.i2cWrite(this.address, LSM303DLHC.CTRL_REG4_A, 0x38);

};

LSM303DLHC.prototype._initMag = function() {
  // enables magnetometer
  this.connection.i2cWrite(LSM303DLHC.ADDRESS_MAG,
                           LSM303DLHC.MAG_MR_REG_M, 0x00);

  // enables temperature
  this.connection.i2cWrite(LSM303DLHC.ADDRESS_MAG,
                           LSM303DLHC.MAG_CRA_REG_M, 0x90);

};
