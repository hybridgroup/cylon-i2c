(function() {
  'use strict';
  var hmc6352, namespace;

  namespace = require('node-namespace');

  hmc6352 = source("hmc6352");

  describe("Cylon.Drivers.I2C.Hmc6352", function() {
    var driver;
    driver = new Cylon.Drivers.I2C.Hmc6352({
      name: 'compass',
      device: {
        connection: 'connect'
      }
    });
    it("has parseHeading of 0", function() {
      return driver.parseHeading([0, 0]).should.equal(0);
    });
    return it("has parseHeading of 180", function() {
      return driver.parseHeading([0, 1800]).should.equal(180);
    });
  });

}).call(this);
