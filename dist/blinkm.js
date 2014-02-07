/*
 * BlinkM driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('./cylon-i2c');

  namespace = require('node-namespace');

  namespace("Cylon.Drivers.I2C", function() {
    return this.BlinkM = (function(_super) {
      var FADE_TO_HSB, FADE_TO_RGB, FADE_TO_RND_HSB, FADE_TO_RND_RGB, GET_ADDRESS, GET_FIRMWARE, GET_RGB, PLAY_LIGHT_SCRIPT, SET_ADDRESS, SET_FADE, SET_TIME, STOP_SCRIPT, TO_RGB;

      __extends(BlinkM, _super);

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

      function BlinkM(opts) {
        BlinkM.__super__.constructor.apply(this, arguments);
        this.address = 0x09;
      }

      BlinkM.prototype.commands = function() {
        return ['goToRGB', 'fadeToRGB', 'fadeToHSB', 'fadeToRandomRGB', 'fadeToRandomHSB', 'playLightScript', 'stopScript', 'setFadeSpeed', 'setTimeAdjust', 'getRGBColor', 'setAddress', 'getAddress', 'getFirmware'];
      };

      BlinkM.prototype.start = function(callback) {
        return BlinkM.__super__.start.apply(this, arguments);
      };

      BlinkM.prototype.goToRGB = function(r, g, b, cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, TO_RGB, [r, g, b], cb);
      };

      BlinkM.prototype.fadeToRGB = function(r, g, b, cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, FADE_TO_RGB, [r, g, b], cb);
      };

      BlinkM.prototype.fadeToHSB = function(h, s, b, cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, FADE_TO_HSB, [h, s, b], cb);
      };

      BlinkM.prototype.fadeToRandomRGB = function(r, g, b, cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, FADE_TO_RND_RGB, [r, g, b], cb);
      };

      BlinkM.prototype.fadeToRandomHSB = function(h, s, b, cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, FADE_TO_RND_HSB, [h, s, b], cb);
      };

      BlinkM.prototype.playLightScript = function(id, repeats, startAtLine, cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, PLAY_LIGHT_SCRIPT, [id, repeats, startAtLine], cb);
      };

      BlinkM.prototype.stopScript = function(cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, STOP_SCRIPT, [], cb);
      };

      BlinkM.prototype.setFadeSpeed = function(speed, cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, STOP_SCRIPT, [speed], cb);
      };

      BlinkM.prototype.setTimeAdjust = function(time, cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cWrite(this.address, STOP_SCRIPT, [time], cb);
      };

      BlinkM.prototype.getRGBColor = function(cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cRead(this.address, GET_RGB, 3, cb);
      };

      BlinkM.prototype.getAddress = function(cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cRead(this.address, GET_ADDRESS, 1, cb);
      };

      BlinkM.prototype.setAddress = function(address, cb) {
        if (cb == null) {
          cb = null;
        }
        this.connection.i2cWrite(this.address, SET_ADDRESS, [address, 0xd0, 0x0d, address], cb);
        return this.address = address;
      };

      BlinkM.prototype.getFirmware = function(cb) {
        if (cb == null) {
          cb = null;
        }
        return this.connection.i2cRead(this.address, GET_FIRMWARE, 1, cb);
      };

      return BlinkM;

    })(Cylon.Driver);
  });

}).call(this);
