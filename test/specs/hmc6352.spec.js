'use strict';

var Hmc6352 = source("hmc6352");

describe("Cylon.Drivers.I2C.Hmc6352", function() {
  var driver = new Hmc6352({
    name: 'compass',
    device: { emit: spy(), connection: { emit: spy() } }
  });

  describe("#constructor", function() {
    it("sets @address to 0x42 by default", function() {
      expect(driver.address).to.be.eql(0x42);
    });
  });

  describe("#commands", function() {
    it("returns an array of Hmc6352 commands", function() {
      var commands = driver.commands();

      expect(commands).to.be.an('array');

      for (var i = 0; i < commands.length ; i++) {
        expect(commands[i]).to.be.a('string');
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

  describe("#heading", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cRead = stub().callsArgWith(3, [30, 20]);
      stub(driver, 'parseHeading').returns(20)
      driver.heading(callback)
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
      driver.parseHeading.restore();
    });

    it("calls the callback with the results of parseHeading", function() {
      expect(driver.parseHeading).to.be.calledWith([30, 20]);
      expect(callback).to.be.calledWith(20);
    });
  });

  describe("#commandBytes", function() {
    it("creates an ASCII buffer with the provided string", function() {
      var bytes = driver.commandBytes("testing");
      expect(bytes).to.be.a('object');
      expect(bytes.length).to.be.eql(7);
    });
  });

  describe("#parseHeading", function() {
    it("parses an array to determine the heading", function() {
      expect(driver.parseHeading([0, 0])).to.be.eql(0);

      expect(driver.parseHeading([0, 1800])).to.be.eql(180);
    });
  });
});
