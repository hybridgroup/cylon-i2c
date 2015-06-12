"use strict";

var Pca9685 = lib("pca9685");

describe("Cylon.Drivers.I2C.Pca9685", function() {
  var driver;

  beforeEach(function() {
    driver = new Pca9685({
      name: "Pca9685",
      connection: {},
      pin: 13
    });
  });

  describe("#constructor", function() {
    it("sets @address to 0x40", function() {
      expect(driver.address).to.be.eql(0x40);
    });
  });

  describe("#commands", function() {
    it("is an object containing PCA9685 commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
      driver.start(callback);
    });


    afterEach(function() {
      driver.connection.i2cWrite = undefined;
    });

    it("wake up", function() {
      expect(driver.connection.i2cWrite).to.be.calledWith(
        0x40, 0x00, [0x00]);
    });

    it("reset all", function() {
      expect(driver.connection.i2cWrite).to.be.calledWith(
        0x40, 0xFD, [0x10]);
    });
  });


  describe("#setPWMFreq", function() {

    beforeEach(function() {
      driver.connection.i2cRead = spy();
      driver.setPWMFreq();
    });

    it("calls #i2cRead to get data from the device", function() {
      expect(driver.connection.i2cRead).to.be.calledWith(0x40, 0x00, 1);
    });

  });

  describe("#setPWM", function() {
    beforeEach(function() {
      driver.connection.i2cWrite = spy();
      driver.setPWM(1, 2, 3);
    });
    it("calls #i2cWrite to set the pwm value", function() {
      expect(driver.connection.i2cWrite).to.be.calledWith(0x40, 10, [2]);
      expect(driver.connection.i2cWrite).to.be.calledWith(0x40, 11, [0]);
      expect(driver.connection.i2cWrite).to.be.calledWith(0x40, 12, [3]);
      expect(driver.connection.i2cWrite).to.be.calledWith(0x40, 13, [0]);
    });
  });

  describe("#stop", function() {
    beforeEach(function() {
      driver.connection.i2cWrite = spy();
    });

    it("reset all", function() {
      driver.stop();
      expect(driver.connection.i2cWrite).to.be.calledWith(
        0x40, 0xFD, [0x10]);
    });
  });

});
