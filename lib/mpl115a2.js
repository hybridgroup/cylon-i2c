/*
 * MPL115A2 I2C Barometric Pressure + Temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A MPL115A2 Driver
 *
 * @constructor mpl115a2
 */
var Mpl115A2 = module.exports = function Mpl115A2() {
  Mpl115A2.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x60;
  this.commands = {
    get_pressure: this.getPressure,
    get_temperature: this.getTemperature
  };
};

Cylon.Utils.subclass(Mpl115A2, I2CDriver);

Mpl115A2.REGISTER_PRESSURE_MSB = 0x00;
Mpl115A2.REGISTER_PRESSURE_LSB = 0x01;
Mpl115A2.REGISTER_TEMP_MSB = 0x02;
Mpl115A2.REGISTER_TEMP_LSB = 0x03;
Mpl115A2.REGISTER_A0_COEFF_MSB = 0x04;
Mpl115A2.REGISTER_A0_COEFF_LSB = 0x05;
Mpl115A2.REGISTER_B1_COEFF_MSB = 0x06;
Mpl115A2.REGISTER_B1_COEFF_LSB = 0x07;
Mpl115A2.REGISTER_B2_COEFF_MSB = 0x08;
Mpl115A2.REGISTER_B2_COEFF_LSB = 0x09;
Mpl115A2.REGISTER_C12_COEFF_MSB = 0x0A;
Mpl115A2.REGISTER_C12_COEFF_LSB = 0x0B;
Mpl115A2.REGISTER_STARTCONVERSION = 0x12;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Mpl115A2.prototype.start = function(callback) {
  this.readCoefficients(callback);
};

Mpl115A2.prototype.readCoefficients = function(callback) {
  var self = this;

  this.connection.i2cRead(
    this.address,
    Mpl115A2.REGISTER_A0_COEFF_MSB,
    8,
    function(err, d) {
      var data = new Buffer(d);

      var a0coeff = data.readUInt16BE(0),
          b1coeff = data.readUInt16BE(2),
          b2coeff = data.readUInt16BE(4),
          c12coeff = (data.readUInt16BE(6)) >> 2;

      self.a0 = a0coeff / 8;
      self.b1 = b1coeff / 8192;
      self.b2 = b2coeff / 16384;
      self.c12 = c12coeff / 4194304.0;

      callback(err, data);
      self.emit("start");
    }
  );
};


Mpl115A2.prototype.getPT = function(callback) {
  var self = this;

  this.connection.i2cWrite(this.address,
                           Mpl115A2.REGISTER_STARTCONVERSION, [0x00]);
  this.connection.i2cWrite(this.address, 0x00);

  Cylon.Utils.sleep(5);

  this.connection.i2cRead(
    this.address,
    Mpl115A2.REGISTER_PRESSURE_MSB,
    4,
    function(err, d) {
      var pressure, temp, pressureComp;
      var data = new Buffer(d);

      pressure = (data.readUInt16BE(0)) >> 6;

      temp = (data.readUInt16BE(2)) >> 6;

      pressureComp = self.a0 + (self.b1 + self.c12 * temp) * pressure;

      pressureComp += self.b2 * temp * 1.0;

      self.pressure = ((65.0 / 1023.0) * pressureComp) + 50.0;
      self.temperature = ((temp - 498.0) / -5.35) + 25.0;

      var values = {
        pressure: self.pressure,
        temperature: self.temperature
      };

      callback(err, values);
    }
  );
};

/**
 * Gets value of the pressure.
 *
 * @param {Function} callback
 * @return {integer}
 * @publish
 */
Mpl115A2.prototype.getPressure = Mpl115A2.prototype.getPT;

/**
 * Gets value of the temperature.
 *
 * @param {Function} callback
 * @return {integer}
 * @publish
 */
Mpl115A2.prototype.getTemperature = Mpl115A2.prototype.getPT;
