/*
 * HMC6352 Digital Compass driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require('./cylon-i2c');

var namespace = require('node-namespace');

namespace("Cylon.Drivers.I2C", function() {
  return this.Hmc6352 = (function(_parent) {
    subclass(Hmc6352, _parent);

    function Hmc6352() {
      Hmc6352.__super__.constructor.apply(this, arguments);
      this.address = 0x42;
    }

    Hmc6352.prototype.commands = function() {
      return ['heading'];
    };

    // Public: Starts the driver.
    //
    // Returns null.
    Hmc6352.prototype.start = function(callback) {
      this.connection.i2cConfig(50);
      Hmc6352.__super__.start.apply(this, arguments);
    };

    // Public: Returns the heading data for the compass
    //
    // callback - params
    //
    // Returns null.
    Hmc6352.prototype.heading = function(callback) {
      var _this = this;
      this.connection.i2cRead(this.address, this.commandBytes('A'), 2, function(data) {
        callback(parseHeading(data));
      });
    };

    // Public: commandBytes
    //
    // s - params
    //
    // Returns null.
    Hmc6352.prototype.commandBytes = function(s) {
      return new Buffer(s, 'ascii');
    };

    // Public: parseHeading
    //
    // val - params
    //
    // Returns null.
    Hmc6352.prototype.parseHeading = function(val) {
      return (val[1] + val[0] * 256) / 10.0;
    };

    return Hmc6352;

  })(Cylon.Driver);
});
