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
      __extends(BlinkM, _super);

      function BlinkM(opts) {
        BlinkM.__super__.constructor.apply(this, arguments);
        this.address = 0x09;
      }

      BlinkM.prototype.commands = function() {
        return ['off', 'rgb', 'fade', 'color', 'version'];
      };

      BlinkM.prototype.start = function(callback) {
        this.connection.i2cConfig(50);
        return BlinkM.__super__.start.apply(this, arguments);
      };

      BlinkM.prototype.off = function() {
        return this.connection.i2cWrite(this.address, this.commandBytes('o'));
      };

      BlinkM.prototype.rgb = function(r, g, b) {
        this.connection.i2cWrite(this.address, this.commandBytes('n'));
        return this.connection.i2cWrite(this.address, [r, g, b]);
      };

      BlinkM.prototype.fade = function(r, g, b) {
        this.connection.i2cWrite(this.address, this.commandBytes('c'));
        return this.connection.i2cWrite(this.address, [r, g, b]);
      };

      BlinkM.prototype.color = function(callback) {
        var _this = this;
        this.connection.i2cWrite(this.address, this.commandBytes('g'));
        return this.connection.i2cRead(this.address, 3, function(data) {
          return callback(data[0], data[1], data[2]);
        });
      };

      BlinkM.prototype.version = function(callback) {
        var _this = this;
        this.connection.i2cWrite(this.address, this.commandBytes('Z'));
        return this.connection.i2cRead(this.address, 2, function(data) {
          return callback("" + data[0] + "." + data[1]);
        });
      };

      BlinkM.prototype.commandBytes = function(s) {
        return new Buffer(s, 'ascii');
      };

      return BlinkM;

    })(Cylon.Driver);
  });

}).call(this);
