/*
 * BPM180 I2C Barometric Pressure + Temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-14 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');
var BMP180_REGISTER_CALIBRATION = 0xAA,
    BMP180_REGISTER_CONTROL = 0xF4,
    BMP180_REGISTER_TEMPDATA = 0xF6,
    BMP180_REGISTER_PRESSUREDATA = 0xF6,
    BMP180_REGISTER_READTEMPCMD = 0x2E,
    BMP180_REGISTER_READPRESSURECMD = 0x34;

var BPM180_MODE_LOWRES = 0,
    BPM180_MODE_MEDIUMRES = 1,
    BPM180_MODE_HIGHRES = 2,
    BPM180_MODE_UHIGHRES = 3;

var Bmp180 = module.exports = function Bmp180() {
  Bmp180.__super__.constructor.apply(this, arguments);

  this.address = 0x77;

  this.commands = {
    get_pressure: this.getPressure,
    get_temperature: this.getTemperature,
    get_altitude: this.getAltitude
  };
};

Cylon.Utils.subclass(Bmp180, Cylon.Driver);

Bmp180.prototype.start = function(callback) {
  this.readCoefficients(callback);
};

Bmp180.prototype.halt = function(callback) {
  callback();
};

Bmp180.prototype.getPressure = function(mode, callback) {
  var self = this;
  // need temperature for calibration
  var x1 = 0,
      x2 = 0,
      x3 = 0,
      b3 = 0,
      b5 = 0,
      b6 = 0,
      p = 0,
      b4 = 0,
      b7 = 0,
      temp = 0.0;

  this.getRawTemp(function(err, rawTemp) {
    if (err) {
      callback(err, null);
    } else {
      x1 = ((rawTemp - self.ac6) * self.ac5) >> 15;
      x2 = Math.ceil((self.mc << 11) / (x1 + self.md));
      b5 = x1 + x2;
      temp = ((b5 + 8) >> 4) / 10.0;

      self.getRawPressure(mode, function(err, rawPress) {
          if (err) {
            callback(err, null);
          } else {
            var modeVal = parseInt(mode);

            b6 = b5 - 4000;
            x1 = (self.b2 * (b6 * b6) >> 12) >> 11;
            x2 = (self.ac2 * b6) >> 11;
            x3 = x1 + x2;
            b3 = Math.ceil((((self.ac1 * 4 + x3) << modeVal) + 2) / 4);

            x1 = (self.ac3 * b6) >> 13;
            x2 = (self.b1 * ((b6 * b6) >> 12)) >> 16;
            x3 = ((x1 + x2) + 2) >> 2;
            b4 = (self.ac4 * (x3 + 32768)) >> 15;
            b7 = (rawPress - b3) * (50000 >> modeVal);

            if (b7 < 0x80000000) {
                p = Math.ceil((b7 * 2) / b4);
            } else {
                p = Math.ceil((b7 / b4) * 2);
            }

            x1 = (p >> 8) * (p >> 8);
            x1 = (x1 * 3038) >> 16;
            x2 = (-7357 * p) >> 16;

            p = p + ((x1 + x2 + 3791) >> 4);

            callback(err, { temp: temp, press:p });
          }
      });
    }
  });
};

Bmp180.prototype.getTemperature = function(callback) {
  var self = this;

  var x1 = 0,
      x2 = 0,
      b5 = 0,
      temp = 0.0;

  this.getRawTemp(function(err, rawTemp) {
      if (err) {
        callback(err, null);
      } else {
        x1 = ((rawTemp - self.ac6) * self.ac5) >> 15;
        x2 = Math.ceil((self.mc << 11) / (x1 + self.md));
        b5 = x1 + x2;
        temp = ((b5 + 8) >> 4) / 10.0;

        callback(err, { temp:temp });
      }
  });
};

Bmp180.prototype.getAltitude = function(mode, seaLevelPressure, callback) {
  if (seaLevelPressure == null) { seaLevelPressure = 101325; }

  this.getPressure(mode, function(err, values) {
      if (err) {
        callback(err, null);
      } else {
        var altitude = 44330.0 * (1.0 - Math.pow(values.press / seaLevelPressure, 0.1903));
        callback(err, { temp: values.temp, press: values.press, alt: altitude });
      }
  });
};

Bmp180.prototype.readCoefficients = function(callback) {
    var self = this;

    this.connection.i2cRead(this.address, BMP180_REGISTER_CALIBRATION, 22, function(err, d) {
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
          self.emit('start');
        }
    });
};

Bmp180.prototype.getRawTemp = function(callback) {
  var self = this;

  this.connection.i2cWrite(self.address, BMP180_REGISTER_CONTROL, [BMP180_REGISTER_READTEMPCMD], function(err) {
      if (err) {
        callback(err, null);
      } else {
        setTimeout(function() {
          self.connection.i2cRead(self.address, BMP180_REGISTER_TEMPDATA, 2, function(err, d) {
            if (err) {
              callback(err, null);
            } else {
              var data = new Buffer(d);
              var rawTemp = data.readUInt16BE(0);
              callback(null, rawTemp);
            }
          });
        }, 5);
      }
  });
};

Bmp180.prototype.getRawPressure = function(mode, callback) {
    var self = this;

    var modeVal = parseInt(mode);

    if (isNaN(modeVal) || modeVal < 0 || modeVal > 3) {
      callback(new Error("Invalid pressure sensing mode."));
    }

    this.connection.i2cWrite(self.address, BMP180_REGISTER_CONTROL, [BMP180_REGISTER_READPRESSURECMD], function(err) {
        if (err) {
          callback(err, null);
        } else {
          setTimeout(function() {
            self.connection.i2cRead(self.address, BMP180_REGISTER_PRESSUREDATA, 3, function(err, data) {
              if (err) {
                callback(err, null);
              } else {
                var msb = data[0];
                var lsb = data[1];
                var xlsb = data[2];
                var rawPress = ((msb << 16) + (lsb << 8) + xlsb) >> (8-modeVal);
                callback(null, rawPress);
              }
            });
          }, waitTime(modeVal));
        }
    });
};

function waitTime(mode) {
  switch(mode) {
    case BPM180_MODE_LOWRES:
      return 5;
    case BPM180_MODE_MEDIUMRES:
      return 8;
    case BPM180_MODE_HIGHRES:
      return 14;
    case BPM180_MODE_UHIGHRES:
      return 26;
    default:
      return 8;
  }
};
