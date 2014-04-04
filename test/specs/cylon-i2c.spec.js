'use strict';

source('blinkm');
source('hmc6352');
source('mpl115a2');
source('bmp180');
source('mpu6050');
source('lcd');

var module = source("cylon-i2c");

describe("Cylon.Drivers.I2C", function() {
  describe("#driver", function() {
    beforeEach(function() {
      for (var driver in Cylon.Drivers.I2C) {
        stub(Cylon.Drivers.I2C, driver);
      }
    });

    afterEach(function() {
      for (var driver in Cylon.Drivers.I2C) {
        Cylon.Drivers.I2C[driver].restore();
      }
    });

    context("with 'blinkm'", function() {
      it("returns a BlinkM driver instance", function() {
        module.driver({name: 'blinkm'});

        expect(Cylon.Drivers.I2C.BlinkM).to.be.calledWithNew;
        expect(Cylon.Drivers.I2C.BlinkM).to.be.calledWith({name: 'blinkm'});
      });
    });

    context("with 'hmc6352'", function() {
      it("returns a Hmc6352 driver instance", function() {
        module.driver({name: 'hmc6352'});

        expect(Cylon.Drivers.I2C.Hmc6352).to.be.calledWithNew;
        expect(Cylon.Drivers.I2C.Hmc6352).to.be.calledWith({name: 'hmc6352'});
      });
    });

    context("with 'mpl115a2'", function() {
      it("returns a Mpl115A2 driver instance", function() {
        module.driver({name: 'mpl115a2'});

        expect(Cylon.Drivers.I2C.Mpl115A2).to.be.calledWithNew;
        expect(Cylon.Drivers.I2C.Mpl115A2).to.be.calledWith({name: 'mpl115a2'});
      });
    });

    context("with 'bmp180'", function() {
      it("returns a Bmp180 driver instance", function() {
        module.driver({name: 'bmp180'});

        expect(Cylon.Drivers.I2C.Bmp180).to.be.calledWithNew;
        expect(Cylon.Drivers.I2C.Bmp180).to.be.calledWith({name: 'bmp180'});
      });
    });

    context("with 'mpu6050'", function() {
      it("returns a Mpu6050 driver instance", function() {
        module.driver({name: 'mpu6050'});

        expect(Cylon.Drivers.I2C.Mpu6050).to.be.calledWithNew;
        expect(Cylon.Drivers.I2C.Mpu6050).to.be.calledWith({name: 'mpu6050'});
      });
    });

    context("with 'lcd'", function() {
      it("returns a LCD driver instance", function() {
        module.driver({name: 'lcd'});

        expect(Cylon.Drivers.I2C.LCD).to.be.calledWithNew;
        expect(Cylon.Drivers.I2C.LCD).to.be.calledWith({name: 'lcd'});
      });
    });

    context("with an invalid driver name", function() {
      it("returns null", function() {
        var result = module.driver({name: 'notavaliddriver'});
        expect(result).to.be.eql(null);
      });
    });
  });

  describe("#register", function() {
    var robot;
    beforeEach(function() {
      robot = { registerDriver: spy() };
      stub(Logger, 'debug');
      module.register(robot);
    });

    afterEach(function() {
      Logger.debug.restore();
    });

    it("registers the BlinkM driver", function() {
      expect(Logger.debug).to.be.calledWithMatch("Registering i2c BlinkM driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "blinkm");
    });

    it("registers the HMC6352 driver", function() {
      expect(Logger.debug).to.be.calledWithMatch("Registering i2c HMC6352 driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "hmc6352");
    });

    it("registers the MPL115A2 driver", function() {
      expect(Logger.debug).to.be.calledWithMatch("Registering i2c MPL115A2 driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "mpl115a2");
    });

    it("registers the BMP180 driver", function() {
      expect(Logger.debug).to.be.calledWithMatch("Registering i2c BMP180 driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "bmp180");
    });

    it("registers the MPU6050 driver", function() {
      expect(Logger.debug).to.be.calledWithMatch("Registering i2c MPU6050 driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "mpu6050");
    });

    it("registers the LCD driver", function() {
      expect(Logger.debug).to.be.calledWithMatch("Registering i2c LCD driver");
      expect(robot.registerDriver).to.be.calledWith("cylon-i2c", "lcd");
    });
  });
});
