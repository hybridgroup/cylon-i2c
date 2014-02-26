'use strict';

var namespace = require('node-namespace'),
    lcd = source("lcd");

describe("Cylon.Drivers.I2C.LCD", function() {
  var driver;

  driver = new Cylon.Drivers.I2C.LCD({
    name: 'display',
    device: {
      connection: 'connect'
    }
  });

  it("needs tests");
});
