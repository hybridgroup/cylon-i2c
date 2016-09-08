"use strict";

var BlinkM = lib("blinkm"),
  Hmc6352 = lib("hmc6352"),
  Mpl115A2 = lib("mpl115a2"),
  Bmp180 = lib("bmp180"),
  Bme280 = lib("bme280"),
  Jhd1313m1 = lib("jhd1313m1"),
  Mpu6050 = lib("mpu6050"),
  LCD = lib("lcd"),
  Lsm9ds0g = lib("lsm9ds0g"),
  Lsm9ds0xm = lib("lsm9ds0xm"),
  LidarLite = lib("lidar-lite"),
  Pca9685 = lib("pca9685"),
  Pca9544a = lib("pca9544a"),
  Mag3110 = lib("mag3110"),
  Hmc5883l = lib("hmc5883l"),
  Mma7660 = lib("mma7660"),
  Mma8452q = lib("mma8452q"),
  Lsm303dlhc = lib("lsm303dlhc"),
  L3gd20h = lib("l3gd20h"),
  DirectI2C = lib("direct-i2c");

var i2c = lib("../");

describe("I2C", function() {
  describe("#drivers", function() {
    it("returns an array of all drivers the i2c supports", function() {
      var drivers = [
        "blinkm",
        "hmc6352",
        "mpl115a2",
        "bmp180",
        "bme280",
        "jhd1313m1",
        "mpu6050",
        "lcd",
        "lsm9ds0g",
        "lsm9ds0xm",
        "lidar-lite",
        "pca9685",
        "pca9544a",
        "mag3110",
        "hmc5883l",
        "mma7660",
        "mma8452q",
        "lsm303dlhc",
        "l3gd20h",
        "direct-i2c"
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

    context("with 'bme280'", function() {
      it("returns a Bme280 driver instance", function() {
        opts.driver = "bme280";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Bme280);
      });
    });

    context("with 'jhd1313m1'", function() {
      it("returns a Jhd1313m1 driver instance", function() {
        opts.driver = "jhd1313m1";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Jhd1313m1);
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

    context("with 'lidar-lite'", function() {
      it("returns a lidar-lite driver instance", function() {
        opts.driver = "lidar-lite";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(LidarLite);
      });
    });

    context("with 'pca9544a'", function() {
      it("returns a pca9544a driver instance", function() {
        opts.driver = "pca9544a";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Pca9544a);
      });
    });

    context("with 'pca9685'", function() {
      it("returns a pca9685 driver instance", function() {
        opts.driver = "pca9685";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Pca9685);
      });
    });

    context("with 'mag3110'", function() {
      it("returns a mag3110 driver instance", function() {
        opts.driver = "mag3110";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Mag3110);
      });
    });
    context("with 'hmc5883l'", function() {
      it("returns a hmc5883l driver instance", function() {
        opts.driver = "hmc5883l";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Hmc5883l);
      });
    });
    context("with 'mma7660'", function() {
      it("returns a mma7660 driver instance", function() {
        opts.driver = "mma7660";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Mma7660);
      });
    });
    context("with 'mma8452q'", function() {
      it("returns a mma8452q driver instance", function() {
        opts.driver = "mma8452q";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Mma8452q);
      });
    });
    context("with 'lsm303dlhc'", function() {
      it("returns a  driver instance", function() {
        opts.driver = "lsm303dlhc";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(Lsm303dlhc);
      });
    });
    context("with 'l3gd20h'", function() {
      it("returns a  driver instance", function() {
        opts.driver = "l3gd20h";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(L3gd20h);
      });
    });
    context("with 'direct-i2c'", function() {
      it("returns a DirectI2C driver instance", function() {
        opts.driver = "direct-i2c";
        driver = i2c.driver(opts);
        expect(driver).to.be.an.instanceOf(DirectI2C);
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
