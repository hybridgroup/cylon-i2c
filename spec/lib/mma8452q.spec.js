"use strict";

var MMA8452Q = lib("mma8452q");

describe("Cylon.Drivers.I2C.MMA8452Q", function() {
  var driver;

  beforeEach(function() {
    driver = new MMA8452Q({
      name: "mma8452q",
      connection: {},
      pin: 13
    });
  });

  describe("constructor", function() {
    it("sets @address to 0x1D", function() {
      expect(driver.address).to.be.eql(0x1D);
    });
  });

  describe("#commands", function() {
    it("is an object containing MMA8452Q commands", function() {
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
    });

    afterEach(function() {
      driver._initAccel.restore();
    });

    it("calls #_initAccel", function() {
      driver.start(callback);
      expect(driver._initAccel).to.be.called;
    });
  });

  describe("#getAccel", function() {
    it("must #getAccel");
  });
});
