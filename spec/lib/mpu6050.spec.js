"use strict";

var Mpu6050 = lib("mpu6050");

describe("Cylon.Drivers.I2C.Mpu6050", function() {
  var driver;

  beforeEach(function() {
    driver = new Mpu6050({
      name: "Mpu6050",
      connection: {},
      pin: 13
    });
  });

  describe("#constructor", function() {
    it("sets @address to 0x68", function() {
      expect(driver.address).to.be.eql(0x68);
    });
  });

  describe("#commands", function() {
    it("is an object containing MPU6050 commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver._writeBits = stub();
      driver.emit = spy();
      driver.start(callback);
    });

    afterEach(function() {
      driver._writeBits = undefined;
    });

    it("sets up the clock", function() {
      expect(driver._writeBits).to.be.calledWith(0x6B, [0x02, 0x03, 0x01]);
    });

    it("sets up the gyroscope", function() {
      expect(driver._writeBits).to.be.calledWith(0x1B, [0x04, 0x02, 0x00]);
    });

    it("sets up the accelerometer", function() {
      expect(driver._writeBits).to.be.calledWith(0x1C, [0x04, 0x02, 0x00]);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.called;
    });

    it("emits the 'start' event", function() {
      expect(driver.emit).to.be.calledWith("start");
    });
  });

  describe("#getAngularVelocity", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "getMotionAndTemp");
      driver.getAngularVelocity(callback);
    });

    afterEach(function() {
      driver.getMotionAndTemp.restore();
    });

    it("passes the provided callback to #getMotionAndTemp", function() {
      expect(driver.getMotionAndTemp).to.be.calledWith(callback);
    });
  });

  describe("#getAcceleration", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "getMotionAndTemp");
      driver.getAcceleration(callback);
    });

    afterEach(function() {
      driver.getMotionAndTemp.restore();
    });

    it("passes the provided callback to #getMotionAndTemp", function() {
      expect(driver.getMotionAndTemp).to.be.calledWith(callback);
    });
  });

  describe("#getMotionAndTemp", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      var data = new Buffer(14);
      for (var i = 0; i < 14; i++) {
        data[i] = 10;
      }

      driver.connection.i2cWrite = stub();
      driver.connection.i2cRead = stub().callsArgWith(3, null, data);
      driver.getMotionAndTemp(callback);
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
    });

    it("calls #i2cRead to get data from the device", function() {
      expect(driver.connection.i2cRead).to.be.calledWith(0x68, 0x3B, 14);
    });

    it("triggers the callback with the parsed data", function() {
      var expected = {
        a: [2570, 2570, 2570],
        g: [2570, 2570, 2570],
        t: 44.06470588235294
      };

      expect(callback).to.be.calledWith(null, expected);
    });
  });
});
