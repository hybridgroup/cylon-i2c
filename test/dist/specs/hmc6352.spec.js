(function() {
  'use strict';
  var hmc6352, namespace;

  namespace = require('node-namespace');

  namespace('Cylon', function() {
    return this.Basestar = (function() {
      function Basestar() {}

      return Basestar;

    })();
  });

  hmc6352 = source("hmc6352");

  describe("hmc6352", function() {
    var driver;
    driver = new Cylon.Driver.I2C.Hmc6352({
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
