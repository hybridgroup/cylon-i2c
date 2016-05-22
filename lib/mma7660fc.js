/*
 * MMA7660CF I2C accelerometer driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2016 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A MMA7660CF Driver
 *
 * @constructor mma7600cf
 */

var MMA7660CF = module.exports = function MMA7660CF() {
  MMA7660CF.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x4c;

  this.commands = {
      getAccel: this.getAccel
  };
};


Cylon.Utils.subclass(MMA7660CF, I2CDriver);

MMA7660CF.addr = 0x4C;

MMA7660CF.MMA7660_X = 0x00;
MMA7660CF.MMA7660_Y = 0x01;
MMA7660CF.MMA7660_Z = 0x02;
MMA7660CF.MMA7660_TILT = 0x03;
MMA7660CF.MMA7660_SRST = 0x04;
MMA7660CF.MMA7660_SPCNT = 0x05;
MMA7660CF.MMA7660_INTSU = 0x06;
MMA7660CF.MMA7660_MODE = 0x07;
MMA7660CF.MMA7660_STAND_BY = 0x00;
MMA7660CF.MMA7660_ACTIVE = 0x01;
MMA7660CF.MMA7660_SR = 0x08;	   // sample rate register
MMA7660CF.AUTO_SLEEP_120 = 0X00; // 120 sample per second
MMA7660CF.AUTO_SLEEP_64 = 0X01;
MMA7660CF.AUTO_SLEEP_32 = 0X02;
MMA7660CF.AUTO_SLEEP_16 = 0X03;
MMA7660CF.AUTO_SLEEP_8 = 0X04;
MMA7660CF.AUTO_SLEEP_4 = 0X05;
MMA7660CF.AUTO_SLEEP_2 = 0X06;
MMA7660CF.AUTO_SLEEP_1 = 0X07;
MMA7660CF.MMA7660_PDET = 0x09;
MMA7660CF.MMA7660_PD = 0x0A;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */


MMA7660CF.prototype.start = function(callback) {
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

MMA7660CF.prototype.getAccel = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          MMA7660CF.addr,
                          3,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        var data = new Buffer(d);
        result.x = (data.readInt8(0) << 2) / 4.0;
        result.y = (data.readInt8(1) << 2) / 4.0;
        result.z = (data.readInt8(2) << 2) / 4.0;
        callback(null, result);
      }
    }
  );
};

MMA7660CF.prototype._initAccel = function() {

  // set the mode to standby must be in stanby to set sample rate
  this.connection.i2cWrite(this.address, MMA7660CF.MMA7660_MODE, 0x00);
  // set the sample rate
  this.connection.i2cWrite(this.address, MMA7660CF.MMA7660_SR, 0X02);
  // set the mode to active
  this.connection.i2cWrite(this.address, MMA7660CF.MMA7660_MODE, 0x01);

};
