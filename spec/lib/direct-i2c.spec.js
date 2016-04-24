"use strict";

var DirectI2C = lib("direct-i2c");

describe("Cylon.Drivers.I2C.DirectI2C", function() {
  var driver;

  beforeEach(function() {
    driver = new DirectI2C({
      name: "thingie",
      address: 0x86,
      connection: {}
    });
  });

  describe("#constructor", function() {
    it("allows @address to be set", function() {
      expect(driver.address).to.be.eql(0x86);
    });
  });

  describe("#commands", function() {
    it("is an object containing DirectI2C commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  it("needs #read test");
  it("needs #write test");
});
