/*
 * HMC6352 Digital Compass driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace;

  namespace = require('node-namespace');

  namespace("Cylon.Driver.I2C", function() {
    return this.Hmc6352 = (function() {
      function Hmc6352(opts) {
        this.self = this;
        this.device = opts.device;
        this.connection = this.device.connection;
        this.address = 0x42;
      }

      Hmc6352.prototype.commands = function() {
        return ['heading'];
      };

      Hmc6352.prototype.start = function(callback) {
        Logger.debug("Hmc6352 started");
        this.connection.i2cConfig(50);
        callback(null);
        return this.device.emit('start');
      };

      Hmc6352.prototype.stop = function() {
        return Logger.debug("Hmc6352 stopping");
      };

      Hmc6352.prototype.heading = function(callback) {
        var _this = this;
        this.connection.i2cWrite(this.address, this.commandBytes('A'));
        return this.connection.i2cRead(this.address, 2, function(data) {
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

    })();
  });

}).call(this);
