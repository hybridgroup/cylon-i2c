// jshint expr:true
"use strict";

var PCA9685 = source("pca9685");

describe("Cylon.Drivers.I2C.PCA9685", function() {
  var driver;

  beforeEach(function() {
    driver = new PCA9685({
      name: "servo-controller",
      connection: {}
    });
  });

  describe("#constructor", function() {
    it("sets @address to 0x40 by default", function() {
      expect(driver.address).to.be.eql(0x40);
    });
  });

  describe("#commands", function() {
    it("is an object containing PCA9685 commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });
});
