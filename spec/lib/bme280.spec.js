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

  beforeEach(function() {
    // setup coefficients
    var coefficients = ["dig_T1", "dig_T2", "dig_T3", "dig_P1", "dig_P2",
                        "dig_P3", "dig_P4", "dig_P5", "dig_P6", "dig_P7",
                        "dig_P8", "dig_P9", "dig_H1", "dig_H2", "dig_H3",
                        "dig_H4", "dig_H5", "dig_H6"];
    var values = [0x00, 0x00, 0x00, 0x00, 0x00,
                  0x00, 0x00, 0x00, 0x00, 0x00,
                  0x00, 0x00, 0x00, 0x00, 0x00,
                  0x00, 0x00, 0x00];

    for (var i = 0; i < coefficients.length; i++) {
      driver[coefficients[i]] = values[i];
    }
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
