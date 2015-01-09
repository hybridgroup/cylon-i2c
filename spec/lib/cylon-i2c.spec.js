// jshint expr:true
"use strict";

var BlinkM = source("blinkm"),
  Hmc6352 = source("hmc6352"),
  Mpl115A2 = source("mpl115a2"),
  Bmp180 = source("bmp180"),
  Mpu6050 = source("mpu6050"),
  LCD = source("lcd"),
  Lsm9ds0g = source("lsm9ds0g"),
  Lsm9ds0xm = source("lsm9ds0xm");

var i2c = source("cylon-i2c");

describe("I2C", function() {
  describe("#drivers", function() {
    it("returns an array of all drivers the i2c supports", function() {
      var drivers = [
        "blinkm",
        "hmc6352",
        "mpl115a2",
        "bmp180",
        "mpu6050",
        "lcd",
        "lsm9ds0g",
        "lsm9ds0xm"
      ];

      expect(i2c.drivers).to.be.eql(drivers);
    });
  });

  describe("#driver", function() {
    var opts, driver;

    beforeEach(function() {
      opts = {
        connection: {},
      };
    });

    context("with 'blinkm'", function() {
      it("returns a BlinkM driver instance", function() {
        opts.driver = "blinkm";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(BlinkM);
      });
    });

    context("with 'hmc6352'", function() {
      it("returns a Hmc6352 driver instance", function() {
        opts.driver = "hmc6352";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Hmc6352);
      });
    });

    context("with 'mpl115a2'", function() {
      it("returns a Mpl115A2 driver instance", function() {
        opts.driver = "mpl115a2";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Mpl115A2);
      });
    });

    context("with 'bmp180'", function() {
      it("returns a Bmp180 driver instance", function() {
        opts.driver = "bmp180";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Bmp180);
      });
    });

    context("with 'mpu6050'", function() {
      it("returns a Mpu6050 driver instance", function() {
        opts.driver = "mpu6050";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Mpu6050);
      });
    });

    context("with 'lcd'", function() {
      it("returns a LCD driver instance", function() {
        opts.driver = "lcd";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(LCD);
      });
    });

    context("with 'lsm9ds0g'", function() {
      it("returns a lsm9ds0g driver instance", function() {
        opts.driver = "lsm9ds0g";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Lsm9ds0g);
      });
    });

    context("with 'lsm9ds0xm'", function() {
      it("returns a lsm9ds0xm driver instance", function() {
        opts.driver = "lsm9ds0xm";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Lsm9ds0xm);
      });
    });

    context("with an invalid driver name", function() {
      it("returns null", function() {
        var result = i2c.driver({name: "notavaliddriver"});
        expect(result).to.be.eql(null);
      });
    });
  });
});
