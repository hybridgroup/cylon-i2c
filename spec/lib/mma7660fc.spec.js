"use strict";

var MMA7660CF = lib("mma7660fc");

describe("Cylon.Drivers.I2C.MMA7660CF", function() {
  var driver;

  beforeEach(function() {
    driver = new MMA7660CF({
      name: "mma7660fc",
      connection: {},
      pin: 13
    });
  });

  describe("constructor", function() {
    it("sets @address to 0x4C", function() {
      expect(driver.address).to.be.eql(0x4C);
    });
  });

  describe("#commands", function() {
    it("is an object containing MMA7660CF commands", function() {
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
