/*
 * BlinkM driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

// jshint unused:false

"use strict";

var Cylon = require("cylon");
var TO_RGB = 0x6e,
    FADE_TO_RGB = 0x63,
    FADE_TO_HSB = 0x68,
    FADE_TO_RND_RGB = 0x43,
    FADE_TO_RND_HSB = 0x48,
    PLAY_LIGHT_SCRIPT = 0x70,
    STOP_SCRIPT = 0x6f,
    SET_FADE = 0x66,
    SET_TIME = 0x74,
    GET_RGB = 0x67,
    GET_ADDRESS = 0x61,
    SET_ADDRESS = 0x41,
    GET_FIRMWARE = 0x5a;

/**
 * A BlinkM Driver
 *
 * @constructor
 */
var BlinkM = module.exports = function BlinkM() {
  BlinkM.__super__.constructor.apply(this, arguments);
  this.address = 0x09;

  this.setupCommands([
    "goToRGB", "fadeToRGB", "fadeToHSB", "fadeToRandomRGB",
    "fadeToRandomHSB", "playLightScript", "stopScript", "setFadeSpeed",
    "setTimeAdjust", "getRGBColor", "setAddress", "getAddress", "getFirmware"
  ]);
};

Cylon.Utils.subclass(BlinkM, Cylon.Driver);

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {null}
 */
BlinkM.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the driver
 *
 * @param {Function} callback triggered when the driver is halted
 * @return {null}
 */
BlinkM.prototype.halt = function(callback) {
  callback();
};

/**
 * Sets the color of the BlinkM to the specified combination of RGB values.
 *
 * @param {Number} r red value, 0-255
 * @param {Number} g green value, 0-255
 * @param {Number} b blue value, 0-255
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.goToRGB = function(r, g, b, callback) {
  this.connection.i2cWrite(this.address, TO_RGB, [r, g, b], callback);
};

/**
 * Fades the color of the BlinkM to the specified combination of RGB values.
 *
 * @param {Number} r red value, 0-255
 * @param {Number} g green value, 0-255
 * @param {Number} b blue value, 0-255
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.fadeToRGB = function(r, g, b, callback) {
  this.connection.i2cWrite(this.address, FADE_TO_RGB, [r, g, b], callback);
};

/**
 * Fades the color of the BlinkM to the specified combination of HSB values.
 *
 * @param {Number} h hue value, 0-359
 * @param {Number} s saturation value, 0-100
 * @param {Number} b brightness value, 0-100
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.fadeToHSB = function(h, s, b, callback) {
  this.connection.i2cWrite(this.address, FADE_TO_HSB, [h, s, b], callback);
};

/**
 * Fades the color of the BlinkM to a random combination of RGB values.
 *
 * @param {Number} r red value, 0-255
 * @param {Number} g green value, 0-255
 * @param {Number} b blue value, 0-255
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.fadeToRandomRGB = function(r, g, b, cb) {
  this.connection.i2cWrite(this.address, FADE_TO_RND_RGB, [r, g, b], cb);
};

/**
 * Fades the color of the BlinkM to a random combination of HSB values.
 *
 * @param {Number} h hue value, 0-359
 * @param {Number} s saturation value, 0-100
 * @param {Number} b brightness value, 0-100
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.fadeToRandomHSB = function(h, s, b, cb) {
  this.connection.i2cWrite(this.address, FADE_TO_RND_HSB, [h, s, b], cb);
};

/**
 * Plays a light script for the BlinkM.
 *
 * Available scripts are available in the BlinkM datasheet.
 *
 * A `repeats` value of `0` causes the script to execute until the the
 * `#stopScript` command is called.
 *
 * @param {Number} id light script to play
 * @param {Number} repeats whether the script should repeat
 * @param {Number} startAtLine which line in the light script to start at
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.playLightScript = function(id, repeats, startAtLine, cb) {
  this.connection.i2cWrite(
    this.address,
    PLAY_LIGHT_SCRIPT,
    [id, repeats, startAtLine],
    cb
  );
};

/**
 * Stops the currently executing BlinkM light script.
 *
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.stopScript = function(cb) {
  this.connection.i2cWrite(this.address, STOP_SCRIPT, [], cb);
};

/**
 * Sets the fade speed for the BlinkM
 *
 * @param {Number} speed how fast colors should fade (1-255)
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.setFadeSpeed = function(speed, cb) {
  this.connection.i2cWrite(this.address, SET_FADE, [speed], cb);
};

/**
 * Sets a time adjust for the BlinkM.
 *
 * This affects the duration of scripts.
 *
 * @param {Number} time an integer between -128 and 127. 0 resets the time.
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.setTimeAdjust = function(time, cb) {
  this.connection.i2cWrite(this.address, SET_TIME, [time], cb);
};

/**
 * Gets the RGB values for the current BlinkM color.
 *
 * Yields an array in the form `[r, g, b]`, each a 0-255 integer.
 *
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.getRGBColor = function(cb) {
  return this.connection.i2cRead(this.address, GET_RGB, 3, cb);
};

/**
 * Returns a string describing the current I2C address being used.
 *
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.getAddress = function(cb) {
  return this.connection.i2cRead(this.address, GET_ADDRESS, 1, cb);
};

/**
 * Sets an address to the BlinkM driver
 *
 * @param {Number} address
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.setAddress = function(address, cb) {
  this.connection.i2cWrite(
    this.address,
    SET_ADDRESS,
    [address, 0xd0, 0x0d, address],
    cb
  );

  this.address = address;
};

/**
 * Returns a string describing the I2C firmware version being used
 *
 * @param {Function} callback
 * @return {null}
 * @publish
 */
BlinkM.prototype.getFirmware = function(cb) {
  return this.connection.i2cRead(this.address, GET_FIRMWARE, 1, cb);
};
