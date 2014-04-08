'use strict';

var Bmp180 = source("bmp180");

describe("Cylon.Drivers.I2C.Bmp180", function() {
  var driver = new Bmp180({
    name: 'bmp180',
    device: {
      connection: {},
      pin: 13,
      emit: spy()
    }
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
    it("returns an array of BMP180 commands", function() {
      var commands = driver.commands();

      expect(commands).to.be.an("array");

      for (var i = 0; i < commands.length; i++) {
        expect(commands[i]).to.be.a("string");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, 'readCoefficients');
      driver.start(callback);
    });

    it("passes callback to #readCoefficients", function() {
      expect(driver.readCoefficients).to.be.calledWith(callback);
    });
  });

  describe("#getPressure", function() {
    var callback;

    var getPressure = function() { driver.getPressure("1", callback); }

    beforeEach(function() {
      callback = spy();
      stub(driver, 'getRawTemp');
      stub(driver, 'getRawPressure');
    });

    afterEach(function() {
      driver.getRawTemp.restore();
      driver.getRawPressure.restore();
    });

    it("calls #getRawTemp", function() {
      getPressure();
      expect(driver.getRawTemp).to.be.called;
    });

    context("if #getRawTemp returns data", function() {
      beforeEach(function() {
        driver.getRawTemp.callsArgWith(0, null, 10);
      });

      it("calls #getRawPressure with the supplied mode", function() {
        getPressure();
        expect(driver.getRawPressure).to.be.calledWith("1");
      });

      context("if #getRawPressure returns data", function() {
        beforeEach(function() {
          driver.getRawPressure.callsArgWith(1, null, 20);
        });

        it("triggers the callback with the transformed data", function() {
          getPressure();
          expect(callback).to.be.calledWith(null, { press: 11276, temp: 12.8 });
        });
      });

      context("if #getRawPressure returns an error", function() {
        beforeEach(function() {
          driver.getRawPressure.callsArgWith(1, 'error');
        });

        it("triggers the callback with the error", function() {
          getPressure();
          expect(callback).to.be.calledWith("error", null);
        });
      });
    });

    context("if #getRawTemp returns an error", function() {
      beforeEach(function() {
        driver.getRawTemp.callsArgWith(0, "error");
      });

      it("triggers the callback with the error", function() {
        getPressure();
        expect(callback).to.be.calledWith("error", null);
      });
    });
  });


  describe("#getTemperature", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(driver, "getRawTemp");
    });

    afterEach(function() {
      driver.getRawTemp.restore();
    });

    it("calls #getRawTemp", function() {
      driver.getTemperature(callback);
      expect(driver.getRawTemp).to.be.called;
    });

    context("if #getRawTemp returns data", function() {
      beforeEach(function() {
        driver.getRawTemp.callsArgWith(0, null, 10);
      });

      it("triggers the callback with the transformed data", function() {
        driver.getTemperature(callback);
        expect(callback).to.be.calledWith(null, { temp: 12.8 });
      });
    });

    context("if #getRawTemp returns an error", function() {
      beforeEach(function() {
        driver.getRawTemp.callsArgWith(0, 'error');
      });

      it("triggers the callback with the error", function() {
        driver.getTemperature(callback);
        expect(callback).to.be.calledWith('error', null);
      });
    });
  });
});
