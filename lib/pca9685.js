/*
 * PCA9685 driver
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

// jshint unused:false

"use strict";

var Cylon = require("cylon");

var PCA9685_MODE1 = 0x00,
PCA9685_PRESCALE = 0xFE,
PCA9685_SUBADR1 = 0x2,
PCA9685_SUBADR2 = 0x3,
PCA9685_SUBADR3 = 0x4,
LED0_ON_L = 0x6,
LED0_ON_H = 0x7,
LED0_OFF_L = 0x8,
LED0_OFF_H = 0x9;

/**
 * PCA9685 Driver
 *
 * @constructor pca9685
 */
var PCA9685 = module.exports = function PCA9685() {
  PCA9685.__super__.constructor.apply(this, arguments);
  this.address = 0x40;
  this.commands = {
    reset: this.reset,
    set_pwm_freq: this.setPWMFreq,
    set_pwm: this.setPWM
  };
};

Cylon.Utils.subclass(PCA9685, Cylon.Driver);

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {null}
 */
PCA9685.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the driver
 *
 * @param {Function} callback triggered when the driver is halted
 * @return {null}
 */
PCA9685.prototype.halt = function(callback) {
  callback();
};

/**
 * Resets the PCA9685
 * @return {null}
 */
PCA9685.prototype.reset = function(callback) {
  this.connection.i2cWrite(this.address, PCA9685_MODE1, 0x0);
};

/**
 * Set the servo frequency for the PCA9685
 *
 * @param {number} frequency
 * @return {null}
 * @publish
 */
PCA9685.prototype.setPWMFreq = function(frequency) {
  // Adjust per https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/
  frequency *= 0.9;
  var prescaleval = 25000000;
  prescaleval /= 4096;
  prescaleval /= frequency;
  prescaleval -= 1;
  var prescale = Math.floor(prescaleval + 0.5);

  this.connection.i2cRead(
    this.address,
    PCA9685_MODE1,
    1,
    function(err, oldmode) {
      var newmode = (oldmode & 0x7F) | 0x10; // sleep
      this.connection.i2cWrite(this.address, PCA9685_MODE1, newmode);
      this.connection.i2cWrite(this.address, PCA9685_PRESCALE, prescale);
      this.connection.i2cWrite(this.address, PCA9685_MODE1, oldmode);
      Cylon.Utils.sleep(5);
      this.connection.i2cWrite(this.address, PCA9685_MODE1, oldmode | 0xa1);
    }.bind(this)
  );
};  

/**
 * Set the servo position for the PCA9685
 *
 * @param {number} servoNum
 * @param {number} on
 * @param {number} off
 * @return {null}
 * @publish
 */
PCA9685.prototype.setPWM = function(servoNum, on, off) {
  this.connection.i2cWrite(this.address, LED0_ON_L+4*servoNum, 
                           on, on>>8, off, off>>8);
};  

