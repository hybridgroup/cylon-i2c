"use strict";

var Bme280 = lib("bme280");

describe("Cylon.Drivers.I2C.Bme280", function() {
  var driver;

  beforeEach(function() {
    driver = new Bme280({
      name: "bme280",
      connection: {},
      pin: 13
    });
  });

  beforeEach(function() {
    // setup coefficients
    var coefficients = ["ac1", "ac2", "ac3", "ac4", "ac5",
                        "ac6", "b1", "b2", "mb", "mc", "md"];

    for (var i = 0; i < coefficients.length; i++) {
      driver[coefficients[i]] = 10;
    }
  });

  describe("constructor", function() {
    it("sets @address to 0x77", function() {
      expect(driver.address).to.be.eql(0x77);
    });
  });

  describe("#commands", function() {
    it("is an object containing BME280 commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "readCalibrationData");
      driver.start(callback);
    });

    afterEach(function() {
      driver.readCalibrationData.restore();
    });

    it("calls #readCalibrationData", function() {
      expect(driver.readCalibrationData).to.be.called;
    });
  });

  describe("#readPressure", function() {
    var callback;

    var readPressure = function() { driver.readPressure(callback); };

    beforeEach(function() {
      callback = spy();
      stub(driver, "readRawTemp");
      stub(driver, "readRawPressure");
    });

    afterEach(function() {
      driver.readRawTemp.restore();
      driver.readRawPressure.restore();
    });

    it("calls #readRawTemp", function() {
      readPressure();
      expect(driver.readRawTemp).to.be.called;
    });

    context("if #readRawTemp returns data", function() {
      beforeEach(function() {
        driver.readRawTemp.callsArgWith(0, null, 10);
      });

      it("calls #readRawPressure with the supplied mode", function() {
        readPressure();
        expect(driver.readRawPressure).to.be.calledWith("1");
      });

      context("if #readRawPressure returns data", function() {
        beforeEach(function() {
          driver.readRawPressure.callsArgWith(1, null, 20);
        });

        it("triggers the callback with the transformed data", function() {
          readPressure();
          expect(callback).to.be.calledWith(null, { press: 11276, temp: 12.8 });
        });
      });

      context("if #readRawPressure returns an error", function() {
        beforeEach(function() {
          driver.readRawPressure.callsArgWith(1, "error");
        });

        it("triggers the callback with the error", function() {
          readPressure();
          expect(callback).to.be.calledWith("error", null);
        });
      });
    });

    context("if #readRawTemp returns an error", function() {
      beforeEach(function() {
        driver.readRawTemp.callsArgWith(0, "error");
      });

      it("triggers the callback with the error", function() {
        readPressure();
        expect(callback).to.be.calledWith("error", null);
      });
    });
  });

  describe("#readTemperature", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "readRawTemp");
    });

    afterEach(function() {
      driver.readRawTemp.restore();
    });

    it("calls #readRawTemp", function() {
      driver.readTemperature(callback);
      expect(driver.readRawTemp).to.be.called;
    });

    context("if #readRawTemp returns data", function() {
      beforeEach(function() {
        driver.readRawTemp.callsArgWith(0, null, 10);
      });

      it("triggers the callback with the transformed data", function() {
        driver.readTemperature(callback);
        expect(callback).to.be.calledWith(null, { temp: 12.8 });
      });
    });

    context("if #readRawTemp returns an error", function() {
      beforeEach(function() {
        driver.readRawTemp.callsArgWith(0, "error");
      });

      it("triggers the callback with the error", function() {
        driver.readTemperature(callback);
        expect(callback).to.be.calledWith("error", null);
      });
    });
  });

  describe("#readCalibrationData", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cRead = stub();
    });

    afterEach(function() {
      driver.connection.i2cRead = undefined;
    });

    it("calls #i2cRead to get coefficients from the hardware", function() {
      driver.readCalibrationData(callback);
      expect(driver.connection.i2cRead).to.be.calledWith(0x77, 0xAA, 22);
    });

    context("if #i2cRead returns data", function() {
      beforeEach(function() {
        var data = [];
        for (var i = 0; i < 22; i++) { data.push(10); }
        driver.emit = spy();
        driver.connection.i2cRead.callsArgWith(3, null, data);
        driver.readCalibrationData(callback);
      });

      it("sets coefficients based on the passed values", function() {
        var coefficients = ["ac1", "ac2", "ac3", "ac4", "ac5",
                            "ac6", "b1", "b2", "mb", "mc", "md"];

        for (var i = 0; i < coefficients.length; i++) {
          expect(driver[coefficients[i]]).to.be.eql(2570);
        }
      });

      it("triggers the callback", function() {
        expect(callback).to.be.calledWith();
      });
    });

    context("if #i2cRead returns an error", function() {
      beforeEach(function() {
        driver.connection.i2cRead.callsArgWith(3, "error");
      });

      it("triggers the callback with the error", function() {
        driver.readCalibrationData(callback);
        expect(callback).to.be.calledWith("error");
      });
    });
  });

  describe("#readRawTemp", function() {
    var callback, clock;

    beforeEach(function() {
      callback = spy();
      clock = sinon.useFakeTimers();
      driver.connection.i2cWrite = stub();
      driver.connection.i2cRead = stub();
    });

    afterEach(function() {
      clock.restore();
      driver.connection.i2cWrite = undefined;
      driver.connection.i2cRead = undefined;
    });

    it("calls #i2cWrite to setup temperature reading", function() {
      driver.readRawTemp(callback);
      expect(driver.connection.i2cWrite).to.be.calledWith(0x77, 0xF4, [0x2E]);
    });

    context("if #i2cWrite is successful", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
      });

      it("calls #i2cRead to get the temp data after 5 ms", function() {
        driver.readRawTemp(callback);
        expect(driver.connection.i2cRead).to.not.be.called;
        clock.tick(5);
        expect(driver.connection.i2cRead).to.be.calledWith(0x77, 0xF6, 2);
      });

      context("if #i2cRead returns data", function() {
        beforeEach(function() {
          driver.connection.i2cRead.callsArgWith(3, null, [10, 10]);
        });

        it("triggers the callback with the parsed data", function() {
          driver.readRawTemp(callback);
          clock.tick(5);
          expect(callback).to.be.calledWith(null, 2570);
        });
      });

      context("if #i2cRead returns an error", function() {
        beforeEach(function() {
          driver.connection.i2cRead.callsArgWith(3, "error");
        });

        it("triggers the callback with the error", function() {
          driver.readRawTemp(callback);
          clock.tick(5);
          expect(callback).to.be.calledWith("error", null);
        });
      });
    });

    context("if #i2cWrite returns an error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
      });

      it("triggers the callback with the error", function() {
        driver.readRawTemp(callback);
        expect(callback).to.be.calledWith("error");
      });
    });
  });

  describe("#readRawPressure", function() {
    var callback, clock;

    var readRawPressure = function(mode) {
      mode = mode || "1";
      driver.readRawPressure(mode, callback);
    };

    beforeEach(function() {
      callback = spy();
      clock = sinon.useFakeTimers();
      driver.connection.i2cWrite = stub();
      driver.connection.i2cRead = stub();
    });

    afterEach(function() {
      clock.restore();
      driver.connection.i2cWrite = undefined;
      driver.connection.i2cRead = undefined;
    });

    it("calls #i2cWrite to set up pressure reading", function() {
      readRawPressure();
      expect(driver.connection.i2cWrite).to.be.calledWith(0x77, 0xF4, [0x34]);
    });

    context("if 'mode' is outside the 0-3 bounds", function() {
      it("triggers the callback with an error", function() {
        readRawPressure(4);
        var error = new Error("Invalid pressure sensing mode");
        expect(callback).to.be.calledWith(error);
      });
    });

    context("if #i2cWrite is successful", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3);
      });

      it("calls #i2cRead after a delay", function() {
        readRawPressure();
        expect(driver.connection.i2cRead).to.not.be.called;

        clock.tick(10);
        expect(driver.connection.i2cRead).to.be.calledWith(0x77, 0xF6, 3);
      });

      it("the delay changes depending on which mode is passed", function() {
        readRawPressure("3");

        clock.tick(10);
        expect(driver.connection.i2cRead).to.not.be.called;

        clock.tick(18);
        expect(driver.connection.i2cRead).to.be.called;
      });

      context("if #i2cRead returns data", function() {
        beforeEach(function() {
          driver.connection.i2cRead.callsArgWith(3, null, [10, 10, 10]);
        });

        it("triggers the callback with the parsed data", function() {
          readRawPressure();
          clock.tick(8);
          expect(callback).to.be.calledWith(null, 5140);
        });
      });

      context("if #i2cRead returns an error", function() {
        beforeEach(function() {
          driver.connection.i2cRead.callsArgWith(3, "error");
        });

        it("triggers the callback with the error", function() {
          readRawPressure();
          clock.tick(8);
          expect(callback).to.be.calledWith("error", null);
        });
      });
    });

    context("if #i2cWrite returns an error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
      });

      it("triggers the callback with the error", function() {
        readRawPressure();
        expect(callback).to.be.calledWith("error");
      });
    });
  });
});
