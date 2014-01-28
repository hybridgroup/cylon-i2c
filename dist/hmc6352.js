/*
 * HMC6352 Digital Compass driver
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
    return this.Hmc6352 = (function(_super) {
      __extends(Hmc6352, _super);

      function Hmc6352(opts) {
        Hmc6352.__super__.constructor.apply(this, arguments);
        this.address = 0x42;
      }

      Hmc6352.prototype.commands = function() {
        return ['heading'];
      };

      Hmc6352.prototype.start = function(callback) {
        this.connection.i2cConfig(50);
        return Hmc6352.__super__.start.apply(this, arguments);
      };

      Hmc6352.prototype.heading = function(callback) {
        var _this = this;
        return this.connection.i2cRead(this.address, this.commandBytes('A'), 2, function(data) {
          return callback(parseHeading(data));
        });
      };

      Hmc6352.prototype.commandBytes = function(s) {
        return new Buffer(s, 'ascii');
      };

      Hmc6352.prototype.parseHeading = function(val) {
        return (val[1] + val[0] * 256) / 10.0;
      };

      return Hmc6352;

    })(Cylon.Driver);
  });

}).call(this);
