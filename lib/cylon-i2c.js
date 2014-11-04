/*
 * cylon-gpio
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/
'use strict';

var Cylon = require('cylon');

var Drivers = {
  'blinkm': require('./blinkm'),
  'hmc6352': require('./hmc6352'),
  'mpl115a2': require('./mpl115a2'),
  'bmp180': require('./bmp180'),
  'mpu6050': require('./mpu6050'),
  'lcd': require('./lcd'),
  'lsm9ds0g': require('./lsm9ds0g'),
  'lsm9ds0xm': require('./lsm9ds0xm')
}

module.exports = {
  drivers: Object.keys(Drivers),

  driver: function(opts) {
    for (var driver in Drivers) {
      if (opts.driver === driver) {
        return new Drivers[driver](opts);
      }
    }

    return null;
  }
};
