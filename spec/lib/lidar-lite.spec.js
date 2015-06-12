"use strict";

var LidarLite = lib("lidar-lite");

describe("Cylon.Drivers.I2C.LidarLite", function() {
  var driver;

  beforeEach(function() {
    driver = new LidarLite({
      name: "ranger",
      connection: {}
    });
  });

  describe("#constructor", function() {
    it("sets @address to 0x62 by default", function() {
      expect(driver.address).to.be.eql(0x62);
    });
  });

  describe("#commands", function() {
    it("is an object containing LidarLite commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#distance", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cRead = stub().callsArgWith(3, null, [30, 20]);
      // driver.connection.i2cWrite = stub().callsArgWith(3, [30, 20]);
      driver.connection.i2cWrite = stub();
      stub(driver, "parseDistance").returns(20);
      driver.distance(callback);
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
      driver.connection.i2cWrite = undefined;
      driver.parseDistance.restore();
    });

    it("calls the callback with the results of parseDistance", function() {
      expect(driver.parseDistance).to.be.calledWith([30, 20]);
      expect(callback).to.be.calledWith(null, 20);
    });
  });

  describe("#parseDistance", function() {
    it("parses an array to determine the distance", function() {
      expect(driver.parseDistance([0, 0])).to.be.eql(0);
      expect(driver.parseDistance([0, 180])).to.be.eql(180);
      expect(driver.parseDistance([10, 90])).to.be.eql(2650);
    });
  });
});
