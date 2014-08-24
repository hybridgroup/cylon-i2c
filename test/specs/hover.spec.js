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
      driver.connection.pinMode = spy();
      driver.connection.digitalWrite = spy();
    });

    afterEach(function() {
      driver.connection.i2cConfig = undefined;
      driver.connection.pinMode = undefined;
      driver.connection.digitalWrite = undefined;
    });

    it("calls #pinMode", function() {
      driver.start(function() {});
      expect(driver.connection.pinMode).to.be.called;
    });

    it("calls #digitalWrite", function() {
      driver.start(function() {});
      expect(driver.connection.digitalWrite).to.be.called;
    });
  });

  describe("#getEvent", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cRead = stub().callsArgWith(3, [30, 20]);
      driver.connection.pinMode = spy();
      driver.connection.digitalWrite = spy();
      stub(driver, 'parseEvent').returns(20)
      driver.getEvent()
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
      driver.connection.pinMode = undefined;
      driver.connection.digitalWrite = undefined;
      driver.parseEvent.restore();
    });

    it("parses i2c data", function() {
      expect(driver.parseEvent).to.be.calledWith([30, 20]);
    });
  });

  describe("#parseEvent", function() {
    it("ignores messages that are smaller than 10 bytes", function() {
      var val = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      expect(driver.parseEvent(val)).to.be.null;
    });

    it("looks in the 11th byte", function() {
      var val = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66]
      expect(driver.parseEvent(val)).to.equal(34);
    });

    it("parses an event to determine the gesture", function() {
      var val = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 65]
      expect(driver.parseEvent(val)).to.equal(33);
    });

  });
});
