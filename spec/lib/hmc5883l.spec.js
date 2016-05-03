"use strict";

var HMC5883L = lib("hmc5883l");

describe("Cylon.Drivers.I2C.hmc5883l", function() {
  var driver;

  beforeEach(function() {
    driver = new HMC5883L({
        name: "compass",
        connection: {}
    });
  });

  describe("#constructor", function() {
    it("sets @address to 0x1E by default", function() {
      expect(driver.address).to.be.eql(0x1E);
    });
  });

  describe("#commands", function() {
    it("is an object containing HMC5883L commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "_initMag");
    });

    afterEach(function() {
      driver._initMag.restore();
    });

    it("calls #_initMag", function() {
      driver.start(callback);
      expect(driver._initMag).to.be.called;
    });
  });

  describe("#getMag", function() {
    it("must #getMag");
  });
});
