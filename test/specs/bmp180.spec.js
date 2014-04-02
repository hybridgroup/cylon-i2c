'use strict';

var bmp180 = source("bmp180");

describe("Cylon.Drivers.I2C.Bmp180", function() {
  var button;

  button = new Cylon.Drivers.I2C.Bmp180({
    name: 'bmp180',
    device: {
      connection: 'connect',
      pin: 13
    }
  });

  it("needs tests");
});
