/*
 * PCA9685 driver
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
 */

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * PCA9685 Driver
 *
 * @constructor pca9685
 */
var PCA9685 = module.exports = function PCA9685() {
  PCA9685.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x40;
  this.commands = {
    stop: this.stop,
    set_pwm_freq: this.setPWMFreq,
    set_pwm: this.setPWM
  };
};

Cylon.Utils.subclass(PCA9685, I2CDriver);

PCA9685.MODE1 = 0x00;
PCA9685.PRESCALE = 0xFE;
PCA9685.SUBADR1 = 0x02;
PCA9685.SUBADR2 = 0x03;
PCA9685.SUBADR3 = 0x04;
PCA9685.LED0_ON_L = 0x06;
PCA9685.LED0_ON_H = 0x07;
PCA9685.LED0_OFF_L = 0x08;
PCA9685.LED0_OFF_H = 0x09;
PCA9685.ALLLED_ON_L = 0xFA;
PCA9685.ALLLED_ON_H = 0xFB;
PCA9685.ALLLED_OFF_L = 0xFC;
PCA9685.ALLLED_OFF_H = 0xFD;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
PCA9685.prototype.start = function(callback) {
  this.connection.i2cWrite(this.address, PCA9685.MODE1, [0x00]);
  this.connection.i2cWrite(this.address, PCA9685.ALLLED_OFF_H, [0x10]);
  callback();
};

PCA9685.prototype.stop = function() {
  this.connection.i2cWrite(this.address, PCA9685.ALLLED_OFF_H, [0x10]);
};

/**
 * Set the servo frequency for the PCA9685
 *
 * @param {number} frequency frequency to write
 * @param {function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
PCA9685.prototype.setPWMFreq = function(frequency, callback) {
  // Adjust per https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/
  var prescaleval = 25000000;
  prescaleval /= 4096.0;
  prescaleval /= frequency;
  prescaleval -= 1.0;
  var prescale = Math.floor(prescaleval * 1.0 + 0.5);

  this.connection.i2cRead(
    this.address,
    PCA9685.MODE1,
    1,
    function(err, data) {
      if (err) { return; }

      var oldmode = data[0];
      var newmode = [(oldmode & 0x7F) | 0x10]; // sleep
      this.connection.i2cWrite(this.address, PCA9685.MODE1, newmode);

      this.connection.i2cWrite(
        this.address, PCA9685.PRESCALE, Math.floor(prescale)
      );

      this.connection.i2cWrite(this.address, PCA9685.MODE1, [oldmode]);

      Cylon.Utils.sleep(100);

      this.connection.i2cWrite(this.address, PCA9685.MODE1, [oldmode | 0x80]);

      if (typeof callback === "function") {
        callback(null, frequency);
      }
    }.bind(this));
};

/**
 * Set the servo position for the PCA9685
 *
 * @param {number} channel channel to write to
 * @param {number} pulseon pulse on to set
 * @param {number} pulseoff pulse off to set
 * @param {function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
PCA9685.prototype.setPWM = function(channel, pulseon, pulseoff, callback) {
  this.connection.i2cWrite(
    this.address, PCA9685.LED0_ON_L + 4 * channel, [pulseon & 0xFF]);
  this.connection.i2cWrite(
    this.address, PCA9685.LED0_ON_H + 4 * channel, [pulseon >> 8]);
  this.connection.i2cWrite(
    this.address, PCA9685.LED0_OFF_L + 4 * channel, [pulseoff & 0xFF]);
  this.connection.i2cWrite(
    this.address, PCA9685.LED0_OFF_H + 4 * channel, [pulseoff >> 8], callback);
};
