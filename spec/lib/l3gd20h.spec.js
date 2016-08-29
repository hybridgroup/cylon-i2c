"use strict";

var L3GD20H = lib("l3gd20h");

describe("Cylon.Drivers.I2C.L3GD20H", function() {
  var driver;

  beforeEach(function() {
    driver = new L3GD20H({
      name: "l3gd20h",
      connection: {},
      pin: 13
    });
  });

  describe("constructor", function() {
    it("sets @address to 0x6b", function() {
      expect(driver.address).to.be.eql(0x6b);
    });
  });

  describe("#commands", function() {
    it("is an object containing L3GD20H commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "_initGyro");
    });

    afterEach(function() {
      driver._initGyro.restore();
    });

    it("calls #_initGyro", function() {
      driver.start(callback);
      expect(driver._initGyro).to.be.called;
    });
  });

  describe("#getGyro", function() {
    it("must #getGyro");
  });
});
