'use strict';
var blinkm;

blinkm = source("blinkm");

describe("Cylon.Drivers.I2C.BlinkM", function() {
  var button;
  button = new Cylon.Drivers.I2C.BlinkM({
    name: 'blinkm',
    device: {
      connection: 'connect',
      pin: 13
    }
  });
  it("needs tests");
});
