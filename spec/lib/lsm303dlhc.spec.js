"use strict";

var LSM303DLHC = lib("lsm303dlhc");

describe("Cylon.Drivers.I2C.LSM303DLHC", function() {
  var driver;

  beforeEach(function() {
    driver = new LSM303DLHC({
      name: "lsm303dlhc",
      connection: {},
      pin: 13
    });
  });

  describe("constructor", function() {
    it("sets @address to 0x19", function() {
      expect(driver.address).to.be.eql(0x19);
    });
  });

  describe("#commands", function() {
    it("is an object containing LSM303DLHC commands", function() {
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
