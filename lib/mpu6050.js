/*
 * MPU6050 I2C accelerometer and temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-15 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A MPU6050 Driver
 *
 * @constructor mpu6050
 */
var Mpu6050 = module.exports = function Mpu6050() {
  Mpu6050.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x68; // DataSheet
  this.commands = {
    get_angular_velocity: this.getAngularVelocity,
    get_acceleration: this.getAcceleration,
    get_motion_and_temp: this.getMotionAndTemp
  };
};

Cylon.Utils.subclass(Mpu6050, I2CDriver);

Mpu6050.RA_ACCEL_XOUT_H = 0x3B;
Mpu6050.RA_PWR_MGMT_1 = 0x6B;
Mpu6050.PWR1_CLKSEL_BIT = 2;
Mpu6050.PWR1_CLKSEL_LENGTH = 3;
Mpu6050.CLOCK_PLL_XGYRO = 0x01;

Mpu6050.GYRO_FS_250 = 0x00;
Mpu6050.RA_GYRO_CONFIG = 0x1B;
Mpu6050.GCONFIG_FS_SEL_LENGTH = 2;
Mpu6050.GCONFIG_FS_SEL_BIT = 4;

Mpu6050.RA_ACCEL_CONFIG = 0x1C;
Mpu6050.ACONFIG_AFS_SEL_BIT = 4;
Mpu6050.ACONFIG_AFS_SEL_LENGTH = 2;
Mpu6050.ACCEL_FS_2 = 0x00;

Mpu6050.RA_PWR_MGMT_1 = 0x6B;
Mpu6050.PWR1_SLEEP_BIT = 6;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Mpu6050.prototype.start = function(callback) {
  // setClockSource
  this._writeBits(Mpu6050.RA_PWR_MGMT_1,
                  [Mpu6050.PWR1_CLKSEL_BIT,
                   Mpu6050.PWR1_CLKSEL_LENGTH,
                   Mpu6050.CLOCK_PLL_XGYRO]);

  // setFullScaleGyroRange
  this._writeBits(Mpu6050.RA_GYRO_CONFIG,
                  [Mpu6050.GCONFIG_FS_SEL_BIT,
                   Mpu6050.GCONFIG_FS_SEL_LENGTH,
                   Mpu6050.GYRO_FS_250]);

  // setFullScaleAccelRange
  this._writeBits(Mpu6050.RA_ACCEL_CONFIG,
                  [Mpu6050.ACONFIG_AFS_SEL_BIT,
                   Mpu6050.ACONFIG_AFS_SEL_LENGTH,
                   Mpu6050.ACCEL_FS_2]);

  callback();
  this.emit("start");
};

/**
 * Gets the value of the Angular Velocity
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Mpu6050.prototype.getAngularVelocity = function(callback) {
  this.getMotionAndTemp(callback);
};

/**
 * Gets the value of the Acceleration
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Mpu6050.prototype.getAcceleration = function(callback) {
  this.getMotionAndTemp(callback);
};

/**
 * Gets the value of the Motion.
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Mpu6050.prototype.getMotionAndTemp = function(callback) {
  // first, wake up
  this.connection.i2cWrite(this.address, Mpu6050.RA_PWR_MGMT_1, [0x00]);

  this.connection.i2cRead(
    this.address,
    Mpu6050.RA_ACCEL_XOUT_H,
    14,
    function(err, d) {
      var data = new Buffer(d);
      var ax = data.readInt16BE(0),
          ay = data.readInt16BE(2),
          az = data.readInt16BE(4);

      var temp = data.readInt16BE(6);

      var gx = data.readInt16BE(8),
          gy = data.readInt16BE(10),
          gz = data.readInt16BE(12);

      var values = {
        a: [ax, ay, az],
        g: [gx, gy, gz],
        t: this.convertToCelsius(temp)
      };

      callback(err, values);
    }.bind(this));
};

// The temperature sensor is -40 to +85 degrees Celsius.
// It is a signed integer.
// According to the datasheet:
//   340 per degrees Celsius, -512 at 35 degrees.
// At 0 degrees: -512 - (340 * 35) = -12412
Mpu6050.prototype.convertToCelsius = function(temp) {
  return (temp + 12412.0) / 340.0;
};

Mpu6050.prototype._bitMask = function(bit, bitLength) {
  return ((1 << bitLength) - 1) << (1 + bit - bitLength);
};

Mpu6050.prototype._writeBits = function(func, bit, bitLength, value, callback) {
  var that = this;
  this.connection.i2cRead(this.address, func, 1, function(err, buffer) {
    if (err) { return; }
    var mask = that._bitMask(bit, bitLength);
    var newValue = buffer ^ ((buffer ^ (value << bit)) & mask);
    console.log(newValue);
    that.connection.i2cWrite(that.address, func, [newValue], callback);
  });
};
