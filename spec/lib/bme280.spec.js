"use strict";

var Bme280 = lib("bme280");

describe("Cylon.Drivers.I2C.Bme280", function() {
  var driver;

  beforeEach(function() {
    driver = new Bme280({
      name: "bme280",
      connection: {},
      pin: 13
    });
  });

  describe("constructor", function() {
    it("sets @address to 0x77", function() {
      expect(driver.address).to.be.eql(0x77);
    });
  });

  describe("#commands", function() {
    it("is an object containing BME280 commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

});
