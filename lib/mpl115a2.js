/*
 * MPL115A2 I2C Barometric Pressure + Temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-14 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

require('./cylon-i2c');

var namespace = require('node-namespace');

namespace("Cylon.Drivers.I2C", function() {
  return this.Mpl115A2 = (function(_parent) {
    subclass(Mpl115A2, _parent);

    var MPL115A2_REGISTER_PRESSURE_MSB = 0x00,
        MPL115A2_REGISTER_PRESSURE_LSB = 0x01,
        MPL115A2_REGISTER_TEMP_MSB = 0x02,
        MPL115A2_REGISTER_TEMP_LSB = 0x03,
        MPL115A2_REGISTER_A0_COEFF_MSB = 0x04,
        MPL115A2_REGISTER_A0_COEFF_LSB = 0x05,
        MPL115A2_REGISTER_B1_COEFF_MSB = 0x06,
        MPL115A2_REGISTER_B1_COEFF_LSB = 0x07,
        MPL115A2_REGISTER_B2_COEFF_MSB = 0x08,
        MPL115A2_REGISTER_B2_COEFF_LSB = 0x09,
        MPL115A2_REGISTER_C12_COEFF_MSB = 0x0A,
        MPL115A2_REGISTER_C12_COEFF_LSB = 0x0B,
        MPL115A2_REGISTER_STARTCONVERSION = 0x12;

    function Mpl115A2() {
      Mpl115A2.__super__.constructor.apply(this, arguments);
      this.address = 0x60;
    }

    Mpl115A2.prototype.commands = function() {
      return ['getPressure', 'getTemperature'];
    };

    Mpl115A2.prototype.start = function(callback) {
      this.readCoefficients(callback);
    };

    Mpl115A2.prototype.readCoefficients = function(callback) {
      var self = this;

      return this.connection.i2cRead(this.address, MPL115A2_REGISTER_A0_COEFF_MSB, 8, function(data) {
        var a0coeff = (data[0] << 8) | data[1],
            b1coeff = (data[2] << 8) | data[3],
            b2coeff = (data[4] << 8) | data[5],
            c12coeff = ((data[6] << 8) | data[7]) >> 2;

        self.a0 = a0coeff / 8;
        self.b1 = b1coeff / 8192;
        self.b2 = b2coeff / 16384;
        self.c12 = c12coeff / 4194304.0;

        callback();
        self.device.emit('start');
      });
    };

    Mpl115A2.prototype.getPT = function(callback) {
      var self = this;

      this.connection.i2cWrite(this.address, MPL115A2_REGISTER_STARTCONVERSION);
      this.connection.i2cWrite(this.address, 0x00);

      sleep(5);

      this.connection.i2cRead(this.address, MPL115A2_REGISTER_PRESSURE_MSB, 4, function(data) {
        var pressure, pressureComp, temp;
        pressure = ((data[0] << 8) | data[1]) >> 6;
        temp = ((data[2] << 8) | data[3]) >> 6;
        pressureComp = self.a0 + (self.b1 + self.c12 * temp) * pressure + self.b2 * temp;
        self.pressure = ((65.0 / 1023.0) * pressureComp) + 50.0;
        self.temperature = ((temp - 498.0) / -5.35) + 25.0;
        callback({
          'pressure': self.pressure,
          'temperature': self.temperature
        });
      });
    };

    Mpl115A2.prototype.getPressure = Mpl115A2.prototype.getPT;
    Mpl115A2.prototype.getTemperature = Mpl115A2.prototype.getPT;

    return Mpl115A2;

  })(Cylon.Driver);
});

module.exports = Cylon.Drivers.I2C.Mpl115A2;
