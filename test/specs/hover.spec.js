'use strict';

var Hover = source("hover");

describe("Cylon.Drivers.I2C.Hover", function() {
  var driver = new Hover({
    name: 'hover',
    device: { emit: spy(), connection: { emit: spy() } }
  });

  describe("#constructor", function() {
    it("sets @address to 0x42 by default", function() {
      expect(driver.address).to.be.eql(0x42);
    });
  });

  describe("#commands", function() {
    it("is an object containing Hover commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    beforeEach(function() {
      driver.connection.i2cConfig = spy();
    });

    afterEach(function() {
      driver.connection.i2cConfig = undefined;
    });

    it("calls #i2cConfig", function() {
      driver.start(function() {});
      expect(driver.connection.i2cConfig).to.be.calledWith(50);
    });
  });

  describe("#getEvent", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cRead = stub().callsArgWith(3, [30, 20]);
      stub(driver, 'parseEvent').returns(20)
      driver.heading(callback)
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
      driver.parseHeading.restore();
    });

    it("calls the callback with the results of parseEvent", function() {
      expect(driver.parseHeading).to.be.calledWith([30, 20]);
      expect(callback).to.be.calledWith(20);
    });
  });

  describe("#parseEvent", function() {
    it("parses an event to determine the gesture", function() {
      expect(driver.parseEvent([0, 0])).to.be.eql(0);

      expect(driver.parseEvent([0, 1800])).to.be.eql(180);
    });
  });
});
