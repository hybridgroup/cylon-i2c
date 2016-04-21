/*
 * BMP180 I2C Barometric Pressure + Temperature sensor driver
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
 * A BMP180 Driver
 *
 * @constructor bmp180
 */
var Bmp180 = module.exports = function Bmp180() {
  Bmp180.__super__.constructor.apply(this, arguments);

  this.address = this.address || 0x77;

  this.commands = {
    get_pressure: this.getPressure,
    get_temperature: this.getTemperature,
    get_altitude: this.getAltitude
  };
};

Cylon.Utils.subclass(Bmp180, I2CDriver);

Bmp180.REGISTER_CALIBRATION = 0xAA;
Bmp180.REGISTER_CONTROL = 0xF4;
Bmp180.REGISTER_TEMPDATA = 0xF6;
Bmp180.REGISTER_PRESSUREDATA = 0xF6;
Bmp180.REGISTER_READTEMPCMD = 0x2E;
Bmp180.REGISTER_READPRESSURECMD = 0x34;

Bmp180.MODE_LOWRES = 0;
Bmp180.MODE_MEDIUMRES = 1;
Bmp180.MODE_HIGHRES = 2;
Bmp180.MODE_UHIGHRES = 3;

function waitTime(mode) {
  switch (mode) {
    case Bmp180.MODE_LOWRES:
      return 5;
    case Bmp180.MODE_MEDIUMRES:
      return 8;
    case Bmp180.MODE_HIGHRES:
      return 14;
    case Bmp180.MODE_UHIGHRES:
      return 26;
    default:
      return 8;
  }
}

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Bmp180.prototype.start = function(callback) {
  var that = this;
  this.readCoefficients(function() {
    that.emit("start");
    callback();
  });
};

/**
 * Gets the value of the pressure in Pascals.
 *
 * Since temperature is also calculated to determine pressure, it returns the
 * temperature as well.
 *
 * @param {Number} mode mode to use
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bmp180.prototype.getPressure = function(mode, callback) {
  var self = this;
  // need temperature for calibration
  var p = 0,
      temp = 0.0;

  this.getRawTemp(function(err, rawTemp) {
    if (err) {
      callback(err, null);
    } else {
      var result = self.calculateTemperature(rawTemp);
      temp = result.temp;

      self.getRawPressure(mode, function(error, rawPress) {
        if (error) {
          callback(error, null);
        } else {
          var modeVal = parseInt(mode, 10);
          p = self.calculatePressure(modeVal, rawPress, result.b5);

          callback(null, { temp: temp, press: p });
        }
      });
    }
  });
};

/**
 * Gets the value of the temperature in degrees Celsius.
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bmp180.prototype.getTemperature = function(callback) {
  var self = this;

  var temp = 0.0;

  this.getRawTemp(function(err, rawTemp) {
    if (err) {
      callback(err, null);
    } else {
      temp = self.calculateTemperature(rawTemp).temp;

      callback(err, { temp: temp });
    }
  });
};

/**
 * Calculates the altitude from the pressure and temperature.
 *
 * Since temperature and pressure are calculated to determine altitude, it
 * returns all three.
 *
 * @param {Number} mode which mode to use
 * @param {Number} seaLevelPressure the pressure at sea level
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bmp180.prototype.getAltitude = function(mode, seaLevelPressure, callback) {
  if (seaLevelPressure == null) { seaLevelPressure = 101325; }

  this.getPressure(mode, function(err, v) {
    if (err) {
      callback(err, null);
    } else {
      var altitude = 44330.0 *
        (1.0 - Math.pow(v.press / seaLevelPressure, 0.1903));

      callback(null, { temp: v.temp, press: v.press, alt: altitude });
    }
  });
};

Bmp180.prototype.readCoefficients = function(callback) {
  var self = this;

  this.connection.i2cRead(
    this.address,
    Bmp180.REGISTER_CALIBRATION,
    22,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var data = new Buffer(d);

        self.ac1 = data.readInt16BE(0);
        self.ac2 = data.readInt16BE(2);
        self.ac3 = data.readInt16BE(4);
        self.ac4 = data.readUInt16BE(6);
        self.ac5 = data.readUInt16BE(8);
        self.ac6 = data.readUInt16BE(10);

        self.b1 = data.readInt16BE(12);
        self.b2 = data.readInt16BE(14);

        self.mb = data.readInt16BE(16);
        self.mc = data.readInt16BE(18);
        self.md = data.readInt16BE(20);

        callback(err, data);
      }
    }
  );
};

Bmp180.prototype.getRawTemp = function(callback) {
  var self = this;

  this.connection.i2cWrite(
    self.address,
    Bmp180.REGISTER_CONTROL,
    [Bmp180.REGISTER_READTEMPCMD],
    function(err) {
      if (err) {
        callback(err, null);
      } else {
        setTimeout(function() {
          self.connection.i2cRead(
            self.address,
            Bmp180.REGISTER_TEMPDATA,
            2,
            function(error, d) {
              if (error) {
                callback(error, null);
              } else {
                var data = new Buffer(d);
                var rawTemp = data.readUInt16BE(0);
                callback(null, rawTemp);
              }
            }
          );
        }, 5);
      }
    }
  );
};

Bmp180.prototype.getRawPressure = function(mode, callback) {
  var self = this;

  var modeVal = parseInt(mode, 10);

  if (isNaN(modeVal) || modeVal < 0 || modeVal > 3) {
    callback(new Error("Invalid pressure sensing mode."));
  }

  this.connection.i2cWrite(
    self.address,
    Bmp180.REGISTER_CONTROL,
    [Bmp180.REGISTER_READPRESSURECMD],
    function(err) {
      if (err) {
        callback(err, null);
      } else {
        setTimeout(function() {
          self.connection.i2cRead(
            self.address,
            Bmp180.REGISTER_PRESSUREDATA,
            3,
            function(error, data) {
              if (error) {
                callback(error, null);
              } else {
                var msb = data[0];
                var lsb = data[1];
                var xlsb = data[2];
                var press = ((msb << 16) + (lsb << 8) + xlsb) >> (8 - modeVal);
                callback(null, press);
              }
            }
          );
        }, waitTime(modeVal));
      }
    }
  );
};

Bmp180.prototype.calculateTemperature = function(rawTemp) {
  var x1 = 0,
      x2 = 0,
      b5 = 0,
      temp = 0.0;

  x1 = ((rawTemp - this.ac6) * this.ac5) >> 15;
  x2 = Math.ceil((this.mc << 11) / (x1 + this.md));
  b5 = x1 + x2;
  temp = ((b5 + 8) >> 4) / 10.0;

  return {temp: temp, b5: b5};
};

Bmp180.prototype.calculatePressure = function(mode, rawPress, b5) {
  var x1 = 0,
      x2 = 0,
      x3 = 0,
      b3 = 0,
      b4 = 0,
      b6 = 0,
      b7 = 0,
      p = 0;

  b6 = b5 - 4000;
  x1 = (this.b2 * (b6 * b6) >> 12) >> 11;
  x2 = (this.ac2 * b6) >> 11;
  x3 = x1 + x2;
  b3 = Math.ceil((((this.ac1 * 4 + x3) << mode) + 2) / 4);

  x1 = (this.ac3 * b6) >> 13;
  x2 = (this.b1 * ((b6 * b6) >> 12)) >> 16;
  x3 = ((x1 + x2) + 2) >> 2;
  b4 = (this.ac4 * (x3 + 32768)) >> 15;
  b7 = (rawPress - b3) * (50000 >> mode);

  if (b7 < 0x80000000) {
    p = Math.ceil((b7 * 2) / b4);
  } else {
    p = Math.ceil((b7 / b4) * 2);
  }

  x1 = (p >> 8) * (p >> 8);
  x1 = (x1 * 3038) >> 16;
  x2 = (-7357 * p) >> 16;

  p = p + ((x1 + x2 + 3791) >> 4);
  return p;
};
