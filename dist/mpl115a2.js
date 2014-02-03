/*
 * MPL115A2 I2C Barometric Pressure + Temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-14 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('./cylon-i2c');

  namespace = require('node-namespace');

  namespace("Cylon.Drivers.I2C", function() {
    return this.Mpl115A2 = (function(_super) {
      var MPL115A2_REGISTER_A0_COEFF_LSB, MPL115A2_REGISTER_A0_COEFF_MSB, MPL115A2_REGISTER_B1_COEFF_LSB, MPL115A2_REGISTER_B1_COEFF_MSB, MPL115A2_REGISTER_B2_COEFF_LSB, MPL115A2_REGISTER_B2_COEFF_MSB, MPL115A2_REGISTER_C12_COEFF_LSB, MPL115A2_REGISTER_C12_COEFF_MSB, MPL115A2_REGISTER_PRESSURE_LSB, MPL115A2_REGISTER_PRESSURE_MSB, MPL115A2_REGISTER_STARTCONVERSION, MPL115A2_REGISTER_TEMP_LSB, MPL115A2_REGISTER_TEMP_MSB;

      __extends(Mpl115A2, _super);

      function Mpl115A2(opts) {
        Mpl115A2.__super__.constructor.apply(this, arguments);
        this.address = 0x60;
      }

      Mpl115A2.prototype.commands = function() {
        return ['getPressure', 'getTemperature'];
      };

      Mpl115A2.prototype.start = function(callback) {
        return this.readCoefficients(callback);
      };

      Mpl115A2.prototype.getPressure = function(callback) {
        if (callback == null) {
          callback = null;
        }
        return this.getPT(callback);
      };

      Mpl115A2.prototype.getTemperature = function(callback) {
        if (callback == null) {
          callback = null;
        }
        return this.getPT(callback);
      };

      Mpl115A2.prototype.readCoefficients = function(callback) {
        var _this = this;
        return this.connection.i2cRead(this.address, MPL115A2_REGISTER_A0_COEFF_MSB, 8, function(data) {
          var a0coeff, b1coeff, b2coeff, c12coeff;
          a0coeff = (data[0] << 8) | data[1];
          b1coeff = (data[2] << 8) | data[3];
          b2coeff = (data[4] << 8) | data[5];
          c12coeff = ((data[6] << 8) | data[7]) >> 2;
          _this.a0 = a0coeff / 8;
          _this.b1 = b1coeff / 8192;
          _this.b2 = b2coeff / 16384;
          _this.c12 = c12coeff / 4194304.0;
          callback();
          return _this.device.emit('start');
        });
      };

      Mpl115A2.prototype.getPT = function(callback) {
        var _this = this;
        if (callback == null) {
          callback = null;
        }
        this.connection.i2cWrite(this.address, MPL115A2_REGISTER_STARTCONVERSION);
        this.connection.i2cWrite(this.address, 0x00);
        sleep(5);
        return this.connection.i2cRead(this.address, MPL115A2_REGISTER_PRESSURE_MSB, 4, function(data) {
          var pressure, pressureComp, temp;
          pressure = ((data[0] << 8) | data[1]) >> 6;
          temp = ((data[2] << 8) | data[3]) >> 6;
          pressureComp = _this.a0 + (_this.b1 + _this.c12 * temp) * pressure + _this.b2 * temp;
          _this.pressure = ((65.0 / 1023.0) * pressureComp) + 50.0;
          _this.temperature = ((temp - 498.0) / -5.35) + 25.0;
          return callback({
            'pressure': _this.pressure,
            'temperature': _this.temperature
          });
        });
      };

      MPL115A2_REGISTER_PRESSURE_MSB = 0x00;

      MPL115A2_REGISTER_PRESSURE_LSB = 0x01;

      MPL115A2_REGISTER_TEMP_MSB = 0x02;

      MPL115A2_REGISTER_TEMP_LSB = 0x03;

      MPL115A2_REGISTER_A0_COEFF_MSB = 0x04;

      MPL115A2_REGISTER_A0_COEFF_LSB = 0x05;

      MPL115A2_REGISTER_B1_COEFF_MSB = 0x06;

      MPL115A2_REGISTER_B1_COEFF_LSB = 0x07;

      MPL115A2_REGISTER_B2_COEFF_MSB = 0x08;

      MPL115A2_REGISTER_B2_COEFF_LSB = 0x09;

      MPL115A2_REGISTER_C12_COEFF_MSB = 0x0A;

      MPL115A2_REGISTER_C12_COEFF_LSB = 0x0B;

      MPL115A2_REGISTER_STARTCONVERSION = 0x12;

      return Mpl115A2;

    })(Cylon.Driver);
  });

}).call(this);
