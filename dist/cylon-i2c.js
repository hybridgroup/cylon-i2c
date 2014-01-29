/*
 * cylon-gpio
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  require('cylon');

  require('./blinkm');

  require('./hmc6352');

  require('./lcd');

  module.exports = {
    driver: function(opts) {
      if (opts.name === 'blinkm') {
        return new Cylon.Drivers.I2C.BlinkM(opts);
      } else if (opts.name === 'hmc6352') {
        return new Cylon.Drivers.I2C.Hmc6352(opts);
      } else if (opts.name === 'lcd') {
        return new Cylon.Drivers.I2C.LCD(opts);
      } else {
        return null;
      }
    },
    register: function(robot) {
      Logger.debug("Registering i2c BlinkM driver for " + robot.name);
      robot.registerDriver('cylon-i2c', 'blinkm');
      Logger.debug("Registering i2c HMC6352 driver for " + robot.name);
      robot.registerDriver('cylon-i2c', 'hmc6352');
      Logger.debug("Registering i2c LCD driver for " + robot.name);
      return robot.registerDriver('cylon-i2c', 'lcd');
    }
  };

}).call(this);
