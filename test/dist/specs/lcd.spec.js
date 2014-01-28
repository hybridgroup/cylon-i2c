(function() {
  'use strict';
  var lcd, namespace;

  namespace = require('node-namespace');

  lcd = source("lcd");

  describe("Cylon.Drivers.I2C.LCD", function() {
    var driver;
    driver = new Cylon.Drivers.I2C.LCD({
      name: 'display',
      device: {
        connection: 'connect'
      }
    });
    return it("needs tests");
  });

}).call(this);
