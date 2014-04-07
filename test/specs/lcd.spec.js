'use strict';

var LCD = source("lcd");

describe("Cylon.Drivers.I2C.LCD", function() {
  var driver = new LCD({
    name: 'display',
    device: {
      connection: {}
    }
  });
});
