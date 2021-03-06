"use strict";

var LSM9DS0XM = lib("lsm9ds0xm");

describe("Cylon.Drivers.I2C.LSM9DS0XM", function() {
  var driver;

  beforeEach(function() {
    driver = new LSM9DS0XM({
      name: "lsm9ds0xm",
      connection: {},
      pin: 13
    });
  });

  describe("constructor", function() {
    it("sets @address to 0x1d", function() {
      expect(driver.address).to.be.eql(0x1d);
    });
  });

  describe("#commands", function() {
    it("is an object containing LSM9DS0XM commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "_initAccel");
      stub(driver, "_initMag");
    });

    afterEach(function() {
      driver._initAccel.restore();
      driver._initMag.restore();
    });

    it("calls #_initAccel", function() {
      driver.start(callback);
      expect(driver._initAccel).to.be.called;
    });

    it("calls #_initMag", function() {
      driver.start(callback);
      expect(driver._initMag).to.be.called;
    });
  });

  describe("#getAccel", function() {
    it("must #getAccel");
  });

  describe("#getMag", function() {
    it("must #getMag");
  });
});
