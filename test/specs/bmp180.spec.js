'use strict';

var Bmp180 = source("bmp180");

describe("Cylon.Drivers.I2C.Bmp180", function() {
  var driver = new Bmp180({
    name: 'bmp180',
    device: {
      connection: {},
      pin: 13,
      emit: spy()
    }
  });
});
