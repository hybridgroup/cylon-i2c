/*
 * PCA9544A driver
 * based on PCA9685
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
 * PCA9544A Driver
 *
 * @constructor pca9544a
 */
var PCA9544A = module.exports = function PCA9544A() {
  PCA9544A.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x77;
  this.commands = {
    stop: this.stop,
    enable: this.enable,
    disable: this.disable,
    setChannel: this.setChannel,
    setChannel0: this.setChannel0,
    setChannel1: this.setChannel1,
    setChannel2: this.setChannel2,
    setChannel3: this.setChannel3
  };
};

Cylon.Utils.subclass(PCA9544A, I2CDriver);

PCA9544A.CTRL_REG = 0x04;
PCA9544A.ENABLE = 0x04;
PCA9544A.DISABLE = 0x00;
PCA9544A.CHAN0 = 0x04;
PCA9544A.CHAN1 = 0x05;
PCA9544A.CHAN2 = 0x06;
PCA9544A.CHAN3 = 0x07;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
PCA9544A.prototype.start = function(callback) {
  this.enable(callback);
  this.emit("start");
};

PCA9544A.prototype.stop = function() {
  this.disable();
};

PCA9544A.prototype.send_byte = function(register, byte, callback) {
  this.connection.i2cWrite(this.address, register, [byte],
    function(err) {
      if (typeof (callback) === "function") {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      }
    });
};

/**
 * Enable the mux
 *
 * @param {Function} callback triggered after enable
 * @return {void}
 */
PCA9544A.prototype.enable = function(callback) {
  this.send_byte(PCA9544A.CTRL_REG, PCA9544A.ENABLE, callback);
};

/**
 * Disable the mux
 *
 * @param {Function} callback triggered after disable
 * @return {void}
 */
PCA9544A.prototype.disable = function(callback) {
  this.send_byte(PCA9544A.CTRL_REG, PCA9544A.DISABLE, callback);
};

PCA9544A.prototype._set_channel = function(channel, callback) {
  this.send_byte(PCA9544A.CTRL_REG, channel, callback);
};

/**
 * Select mux channel
 *
 * @param {Channel} channel to select
 * @param {Function} callback triggered after select
 * @return {void}
 */
PCA9544A.prototype.setChannel = function(channel, callback) {
  switch (channel) {
    case 0:
      channel = PCA9544A.CHAN0;
      break;
    case 1:
      channel = PCA9544A.CHAN1;
      break;
    case 2:
      channel = PCA9544A.CHAN2;
      break;
    case 3:
      channel = PCA9544A.CHAN3;
      break;
    default:
      channel = PCA9544A.DISABLE;
      break;
  }
  this._set_channel(channel, callback);
};

/**
 * Select mux channel 0
 *
 * @param {Function} callback triggered after select
 * @return {void}
 */
PCA9544A.prototype.setChannel0 = function(callback) {
  this._set_channel(PCA9544A.CHAN0, callback);
};

/**
 * Select mux channel 1
 *
 * @param {Function} callback triggered after select
 * @return {void}
 */
PCA9544A.prototype.setChannel1 = function(callback) {
  this._set_channel(PCA9544A.CHAN1, callback);
};

/**
 * Select mux channel 2
 *
 * @param {Function} callback triggered after select
 * @return {void}
 */
PCA9544A.prototype.setChannel2 = function(callback) {
  this._set_channel(PCA9544A.CHAN2, callback);
};

/**
 * Select mux channel 3
 *
 * @param {Function} callback triggered after select
 * @return {void}
 */
PCA9544A.prototype.setChannel3 = function(callback) {
  this._set_channel(PCA9544A.CHAN3, callback);
};
