/*
 * BlinkM driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require('./cylon-i2c');

var namespace = require('node-namespace');

namespace("Cylon.Drivers.I2C", function() {
  this.BlinkM = (function(_parent) {

    var FADE_TO_HSB, FADE_TO_RGB, FADE_TO_RND_HSB, FADE_TO_RND_RGB, GET_ADDRESS, GET_FIRMWARE,
        GET_RGB, PLAY_LIGHT_SCRIPT, SET_ADDRESS, SET_FADE, SET_TIME, STOP_SCRIPT, TO_RGB;

    subclass(BlinkM, _parent);

    TO_RGB = 0x6e;
    FADE_TO_RGB = 0x63;
    FADE_TO_HSB = 0x68;
    FADE_TO_RND_RGB = 0x43;
    FADE_TO_RND_HSB = 0x48;
    PLAY_LIGHT_SCRIPT = 0x70;
    STOP_SCRIPT = 0x6f;
    SET_FADE = 0x66;
    SET_TIME = 0x74;
    GET_RGB = 0x67;
    SET_ADDRESS = 0x41;
    GET_ADDRESS = 0x61;
    GET_FIRMWARE = 0x5a;

    function BlinkM() {
      BlinkM.__super__.constructor.apply(this, arguments);
      this.address = 0x09;
    }

    BlinkM.prototype.commands = function() {
      return ['goToRGB', 'fadeToRGB', 'fadeToHSB', 'fadeToRandomRGB', 'fadeToRandomHSB', 'playLightScript', 'stopScript', 'setFadeSpeed', 'setTimeAdjust', 'getRGBColor', 'setAddress', 'getAddress', 'getFirmware'];
    };

    // Public: Starts the driver.
    //
    // Returns null.
    BlinkM.prototype.start = function(callback) {
      BlinkM.__super__.start.apply(this, arguments);
    };

    // Public: Sets the color of the BlinkM RGB LED to the specified
    // combination of RGB color provided.
    // (red, green and blue values should be between 0 and 255)
    //
    // r- params, Red value
    // g - params, Green value
    // b - params,  Blue value
    // cb - params, cb value
    //
    // Returns true | false.
    BlinkM.prototype.goToRGB = function(r, g, b, cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cWrite(this.address, TO_RGB, [r, g, b], cb);
    };

    // Public: Fades the color of the BlinkM RGB LED to the specified
    // combination of RGB color provided.
    // (red, green and blue values should be between 0 and 255)
    //
    // r- params, Red value
    // g - params, Green value
    // b - params,  Blue value
    // cb - params, cb value
    //
    // Returns true | false.
    BlinkM.prototype.fadeToRGB = function(r, g, b, cb) {
      if (cb == null) {
        cb = null;
      }
      return this.connection.i2cWrite(this.address, FADE_TO_RGB, [r, g, b], cb);
    };

    // Public: Fades the color of the BlinkM RGB LED to the specified
    // combination of HSB provided.
    //
    // h - params, Hue value
    // s - params, Saturation value
    // b - params,  Brightness value
    // cb - params, cb value
    //
    // Returns true | false.
    BlinkM.prototype.fadeToHSB = function(h, s, b, cb) {
      if (cb == null) {
        cb = null;
      }
      return this.connection.i2cWrite(this.address, FADE_TO_HSB, [h, s, b], cb);
    };

    // Public: Fades the color of the BlinkM RGB LED to a random
    //combination of RGB color.
    // (red, green and blue values should be between 0 and 255)
    //
    // r- params, Red value
    // g - params, Green value
    // b - params,  Blue value
    // cb - params, cb value
    //
    // Returns nil.
    BlinkM.prototype.fadeToRandomRGB = function(r, g, b, cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cWrite(this.address, FADE_TO_RND_RGB, [r, g, b], cb);
    };

    // Public: Fades the color of the BlinkM RGB LED to a random
    // combination of HSB .
    //
    // h - params, Hue value
    // s - params, Saturation value
    // b - params,  Brightness value
    // cb - params, cb value
    //
    // Returns nil.
    BlinkM.prototype.fadeToRandomHSB = function(h, s, b, cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cWrite(this.address, FADE_TO_RND_HSB, [h, s, b], cb);
    };

    // A repeat value of 0 causes the script to execute until receiving the stopScript command.
    // light script ids available in the blinkM datasheet.

    // Public: Plays a light script for the BlinkM RGB LED.
    //
    // id - params
    // repeats - params
    // startAtLine - params
    // cb - params, cb value
    //
    // Returns nil.
    BlinkM.prototype.playLightScript = function(id, repeats, startAtLine, cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cWrite(this.address, PLAY_LIGHT_SCRIPT, [id, repeats, startAtLine], cb);
    };

    // Public: Stops an specific script for the BlinkM RGB LED.
    //
    // Returns nil.
    BlinkM.prototype.stopScript = function(cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cWrite(this.address, STOP_SCRIPT, [], cb);
    };

    // Speed must be an integer from 1 to 255
    // Public: Sets a fade to an specific speed for the BlinkM RGB LED.
    //
    // speed - params
    // cb - params (callback function)
    //
    // Returns nil.
    BlinkM.prototype.setFadeSpeed = function(speed, cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cWrite(this.address, STOP_SCRIPT, [speed], cb);
    };

    // Time must be an integer betweeb -128 and 127, 0 resets the time.
    // This affects the duration of the scripts being played.
    // Public: Sets a time adjust for the BlinkM RGB LED.
    //
    // time - params
    // cb - params (callback function)
    //
    // Returns nil.
    BlinkM.prototype.setTimeAdjust = function(time, cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cWrite(this.address, STOP_SCRIPT, [time], cb);
    };

    // Public: Returns an array containing the RGB values for the current color.
    // (all integer between 0 and 255)
    //
    // Returns (@address, GET_RGB, 3, cb).
    BlinkM.prototype.getRGBColor = function(cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cRead(this.address, GET_RGB, 3, cb);
    };

    // Public: Returns an string describing the I2C addresss being used.
    //
    // Returns (@address, GET_ADDRESS, 1, cb).
    BlinkM.prototype.getAddress = function(cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cRead(this.address, GET_ADDRESS, 1, cb);
    };

    // Public: Sets an address to the driver.
    //
    // address - params
    // cb - params (callback function)
    //
    // Returns nil.
    BlinkM.prototype.setAddress = function(address, cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cWrite(this.address, SET_ADDRESS, [address, 0xd0, 0x0d, address], cb);
      this.address = address;
    };

    // Public: Returns an sring describing the I2C firmware version being used.
    //
    // cb - params (callback function)
    //
    // Returns (@address, GET_FIRMWARE, 1, cb).
    BlinkM.prototype.getFirmware = function(cb) {
      if (cb == null) {
        cb = null;
      }
      this.connection.i2cRead(this.address, GET_FIRMWARE, 1, cb);
    };

    return BlinkM;

  })(Cylon.Driver);
});
