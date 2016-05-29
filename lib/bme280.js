/*
 * BME280 I2C Barometric Pressure + Temperature + Humidity sensor driver
 * @author Olivier LeDiouris
 * Licensed under the Apache 2.0 license.
 *
 * Note: The BME280 also has a SPI interface. This code is for I2C.
 *
 * On the BME280:
 *   3V, GND
 *   Clock is SCK
 *   Data is SDI
 */

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

var DEFAULT_BME280_ADDR = 0x77;
var verbose = false; // Display for debugging.

/**
 * A Bme280 Driver
 *
 * @constructor Bme280
 */
var Bme280 = module.exports = function Bme280() {
  Bme280.__super__.constructor.apply(this, arguments);

  this.address = this.address || DEFAULT_BME280_ADDR;

  this.commands = {
    get_pressure:    this.readPressure,
    get_temperature: this.readTemperature,
    get_altitude:    this.readAltitude,
    get_humidity:    this.readHumidity
  };
};

Cylon.Utils.subclass(Bme280, I2CDriver);

// Operating Modes
Bme280.BME280_OSAMPLE_1  = 1;
Bme280.BME280_OSAMPLE_2  = 2;
Bme280.BME280_OSAMPLE_4  = 3;
Bme280.BME280_OSAMPLE_8  = 4;
Bme280.BME280_OSAMPLE_16 = 5;

// Registers
Bme280.BME280_REGISTER_DIG_T1 = 0x88;  // 16 bits
Bme280.BME280_REGISTER_DIG_T2 = 0x8A;  // 16 bits
Bme280.BME280_REGISTER_DIG_T3 = 0x8C;  // 16 bits

Bme280.BME280_REGISTER_DIG_P1 = 0x8E;  // 16 bits
Bme280.BME280_REGISTER_DIG_P2 = 0x90;  // 16 bits
Bme280.BME280_REGISTER_DIG_P3 = 0x92;  // 16 bits
Bme280.BME280_REGISTER_DIG_P4 = 0x94;  // 16 bits
Bme280.BME280_REGISTER_DIG_P5 = 0x96;  // 16 bits
Bme280.BME280_REGISTER_DIG_P6 = 0x98;  // 16 bits
Bme280.BME280_REGISTER_DIG_P7 = 0x9A;  // 16 bits
Bme280.BME280_REGISTER_DIG_P8 = 0x9C;  // 16 bits
Bme280.BME280_REGISTER_DIG_P9 = 0x9E;  // 16 bits

Bme280.BME280_REGISTER_DIG_H1 = 0xA1;  //  8 bits
Bme280.BME280_REGISTER_DIG_H2 = 0xE1;  // 16 bits
Bme280.BME280_REGISTER_DIG_H3 = 0xE3;  //  8 bits
Bme280.BME280_REGISTER_DIG_H4 = 0xE4;  //  8 bits
Bme280.BME280_REGISTER_DIG_H5 = 0xE5;  //  8 bits
Bme280.BME280_REGISTER_DIG_H6 = 0xE6;  //  8 bits
Bme280.BME280_REGISTER_DIG_H7 = 0xE7;  //  8 bits

Bme280.BME280_REGISTER_CHIPID    = 0xD0;
Bme280.BME280_REGISTER_VERSION   = 0xD1;
Bme280.BME280_REGISTER_SOFTRESET = 0xE0;

Bme280.BME280_REGISTER_CONTROL_HUM   = 0xF2;
Bme280.BME280_REGISTER_CONTROL       = 0xF4;
Bme280.BME280_REGISTER_CONFIG        = 0xF5;
Bme280.BME280_REGISTER_PRESSURE_DATA = 0xF7;
Bme280.BME280_REGISTER_TEMP_DATA     = 0xFA;
Bme280.BME280_REGISTER_HUMIDITY_DATA = 0xFD;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Bme280.prototype.start = function(callback) {
  this.tFine = 0.0;
  this.mode  = Bme280.BME280_OSAMPLE_8;    

  var that = this;
  this.readCalibrationData(function() {
    that.emit("start");
    callback();
  });

  this.connection.i2cWrite(this.address, Bme280.BME280_REGISTER_CONTROL, [ 0x3F ], function(err) {
    if (err) {
      callback(err, null);
    } else {
      that.tFine = 0.0;
    }
  });
};

/**
 * Gets the value of the pressure in Pascals.
 *
 * Since temperature is also calculated to determine pressure, it returns the
 * temperature as well.
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bme280.prototype.readPressure = function(callback) {
  var self = this;
  // need temperature for calibration
  var p = 0,
      temp = 0.0;

  this.readRawTemp(function(err, rawTemp) {
    if (err) {
      callback(err, null);
    } else {
      var result = self.calculateTemperature(rawTemp);
      temp = result.temp;

      self.readRawPressure(function(error, rawPress) {
        if (error) {
          callback(error, null);
        } else {
          p = self.calculatePressure(rawPress);
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
Bme280.prototype.readTemperature = function(callback) {
  var self = this;
  var temp = 0.0;
  this.readRawTemp(function(err, rawTemp) {
    if (err) {
      callback(err, null);
    } else {
      temp = self.calculateTemperature(rawTemp).temp;
      callback(err, { temp: temp });
    }
  });
};

/**
 * Gets the value of the relative humidity in %
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bme280.prototype.readHumidity = function(callback) {
  var self = this;
  var hum = 0.0;
  this.readRawHumidity(function(err, rawHum) {
    if (err) {
      callback(err, null);
    } else {
      hum = self.calculateHumidity(rawHum);
      callback(err, { hum: hum });
    }
  });
};

/**
 * Calculates the altitude from the pressure and temperature.
 *
 * Since temperature and pressure are calculated to determine altitude, it
 * returns all three.
 *
 * @param {Number} seaLevelPressure the pressure at sea level, defaulted to 1013.25 hPa
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bme280.prototype.readAltitude = function(seaLevelPressure, callback) {
  if (seaLevelPressure == null) {
    seaLevelPressure = 101325; // in Pa
  }

  this.readPressure(function(err, v) {
    if (err) {
      callback(err, null);
    } else {
      var altitude = 44330.0 * (1.0 - Math.pow(v.press / seaLevelPressure, 0.1903));
      callback(null, { temp: v.temp, press: v.press, alt: altitude });
    }
  });
};

Bme280.prototype.readCalibrationData = function(callback) {
  var self = this;
  // Small hint: i2cRead will not read more that 32 bytes of data.
  this.connection.i2cRead(this.address,                  // Device i2c addr
                          Bme280.BME280_REGISTER_DIG_T1, // From this register
                          24,                            // read 12 registers of 2 bytes
                          function(err, d) {
    if (err) {
      callback(err, null);
    } else {
      var data = new Buffer(d);

      self.dig_T1 = data.readUInt16LE(0);
      self.dig_T2 = data.readInt16LE (2);
      self.dig_T3 = data.readInt16LE (4);

      self.dig_P1 = data.readUInt16LE(6);
      self.dig_P2 = data.readInt16LE (8);
      self.dig_P3 = data.readInt16LE (10);
      self.dig_P4 = data.readInt16LE (12);
      self.dig_P5 = data.readInt16LE (14);
      self.dig_P6 = data.readInt16LE (16);
      self.dig_P7 = data.readInt16LE (18);
      self.dig_P8 = data.readInt16LE (20);
      self.dig_P9 = data.readInt16LE (22);

      callback(err, data);
    }
  });
  this.connection.i2cRead(this.address,                  // Device i2c addr
                          Bme280.BME280_REGISTER_DIG_H1, // From this register
                          1,                             // read 1 register of 1 bytes
                          function(err, d) {
    if (err) {
      callback(err, null);
    } else {
      var data = new Buffer(d);

      self.dig_H1 = data.readUInt8(0);

      callback(err, data);
    }
  });
  this.connection.i2cRead(this.address,                  // Device i2c addr
                          Bme280.BME280_REGISTER_DIG_H2, // From this register
                          7,                             // read 1 register of 2 bytes, 6 of 1 byte.
                          function(err, d) {
    if (err) {
      callback(err, null);
    } else {
      var data = new Buffer(d);

      self.dig_H2 = data.readInt16LE (0);
      self.dig_H3 = data.readUInt8   (2);
      self.dig_H6 = data.readInt8    (6);

      var h4 = data.readInt8(3);
      h4 = (h4 << 24) >> 20;
      self.dig_H4 = h4 | (data.readUInt8(4) & 0x0F);

      var h5 = data.readInt8(5);
      h5 = (h5 << 24) >> 20;
      self.dig_H5 = h5 | (data.readUInt8(4) >> 4 & 0x0F);

      if (verbose) {
        self.showCalibrationData();
      }
      callback(err, data);
    }
  });
};

var displayRegister = function(reg) {
  return toHexString(reg) + ", (" + reg + ")";
};

Bme280.prototype.showCalibrationData = function() {
  console.log("T1 : " + displayRegister(this.dig_T1));
  console.log("T2 : " + displayRegister(this.dig_T2));
  console.log("T3 : " + displayRegister(this.dig_T3));
  console.log("------------------------------")
  console.log("P1 : " + displayRegister(this.dig_P1));
  console.log("P2 : " + displayRegister(this.dig_P2));
  console.log("P3 : " + displayRegister(this.dig_P3));
  console.log("P4 : " + displayRegister(this.dig_P4));
  console.log("P5 : " + displayRegister(this.dig_P5));
  console.log("P6 : " + displayRegister(this.dig_P6));
  console.log("P7 : " + displayRegister(this.dig_P7));
  console.log("P8 : " + displayRegister(this.dig_P8));
  console.log("P9 : " + displayRegister(this.dig_P9));
  console.log("------------------------------")
  console.log("H1 : " + displayRegister(this.dig_H1));
  console.log("H2 : " + displayRegister(this.dig_H2));
  console.log("H3 : " + displayRegister(this.dig_H3));
  console.log("H4 : " + displayRegister(this.dig_H4));
  console.log("H5 : " + displayRegister(this.dig_H5));
  console.log("H6 : " + displayRegister(this.dig_H6));
};

var getMask = function(num) {
  var maskDim = 2;
  for (var i=2; i<16; i+=2) {
    maskDim = i;
    if (Math.abs(num) < (Math.pow(16, i) - 1)) {
//    console.log("i=" + i + ", " + Math.abs(num) + " < " + (Math.pow(16, i) - 1));
      break;
    }
  }
  return Math.pow(16, maskDim) - 1;
};

var toHexString = function(num, len) {
  var l = (len !== undefined ? len : 4);
  return "0x" + lpad((num & getMask(num)).toString(16).trim().toUpperCase(), l, '0');
};

var lpad = function(str, len, pad) {
  var s = str;
  while (s.length < len) {
    s = (pad !== undefined ? pad : " ") + s;
  }
  return s;
};

Bme280.prototype.readRawTemp = function(callback) {
  var self = this;
  var meas = this.mode;
  if (verbose) {
    console.log("readRawTemp: 1 - meas=" + meas);
  }
  this.connection.i2cWrite(self.address, Bme280.BME280_REGISTER_CONTROL_HUM, [ meas ], function(err) {
    if (err) {
      callback(err, null);
    } else {
      meas = self.mode << 5 | self.mode << 2 | 1;
      if (verbose) {
        console.log("readRawTemp: 2 - meas=" + meas);
      }
      self.connection.i2cWrite(self.address, Bme280.BME280_REGISTER_CONTROL, [meas], function (err) {
        if (err) {
          callback(err, null);
        } else {
          var sleepTime = 0.00125 + 0.0023 * (1 << self.mode);
          sleepTime = sleepTime + 0.0023 * (1 << self.mode) + 0.000575;
          sleepTime = sleepTime + 0.0023 * (1 << self.mode) + 0.000575;
          setTimeout(function() {
            self.connection.i2cRead(self.address, Bme280.BME280_REGISTER_TEMP_DATA, 3, function(error, d) {
                  if (error) {
                    callback(error, null);
                  } else {
                    var data = new Buffer(d);
                    var msb  = data.readUInt8(0);
                    var lsb  = data.readUInt8(1);
                    var xlsb = data.readUInt8(2);
                    var rawTemp = ((msb << 16) | (lsb << 8) | xlsb) >> 4;
                    if (verbose) {
                      console.log("readRawTemp Buffer", d)
                      console.log("Raw temp:" + rawTemp + ", msb:", toHexString(msb) + " lsb:" + toHexString(lsb) + " xlsb:" + toHexString(xlsb));
                    }
                    callback(null, rawTemp);
                  }
                }
            );
          }, (sleepTime * 1000));
        }
      });
    }
  });
};

Bme280.prototype.readRawPressure = function(callback) {
  var self = this;
  self.connection.i2cRead(self.address, Bme280.BME280_REGISTER_PRESSURE_DATA, 3, function(error, d) {
      if (error) {
        callback(error, null);
      } else {
        var data = new Buffer(d);
        var msb  = data.readUInt8(0);
        var lsb  = data.readUInt8(1);
        var xlsb = data.readUInt8(2);
        var press = ((msb << 16) | (lsb << 8) | xlsb) >> 4;
        if (verbose) {
          console.log("readRawPressure Buffer", d)
          console.log("Raw press:" + press + ", msb:", toHexString(msb) + " lsb:" + toHexString(lsb) + " xlsb:" + toHexString(xlsb));
        }
        callback(null, press);
      }
    }
  );
};

Bme280.prototype.readRawHumidity = function(callback) {
  var self = this;
  self.connection.i2cRead(self.address, Bme280.BME280_REGISTER_HUMIDITY_DATA, 2, function(error, d) {
      if (error) {
        callback(error, null);
      } else {
        var data = new Buffer(d);
        var msb  = data.readUInt8(0);
        var lsb  = data.readUInt8(1);
        var hum = (msb << 8) | lsb;
        if (verbose) {
          console.log("readRawHumidity Buffer", d)
          console.log("Raw hum:" + hum + ", msb:", toHexString(msb) + " lsb:" + toHexString(lsb));
        }
        callback(null, hum);
      }
    }
  );
};

Bme280.prototype.calculateTemperature = function(rawTemp) {
  var UT = rawTemp;
  var var1 = 0;
  var var2 = 0;
  var temp = 0.0;

  // Read raw temp before aligning it with the calibration values
  var1 = (UT / 16384.0 - this.dig_T1 / 1024.0) * this.dig_T2;
  var2 = ((UT / 131072.0 - this.dig_T1 / 8192.0) * (UT / 131072.0 - this.dig_T1 / 8192.0)) * this.dig_T3;
  this.tFine = Math.floor(var1 + var2);
  temp = (var1 + var2) / 5120.0;

  return { temp: temp };
};

Bme280.prototype.calculatePressure = function(rawPress) {
  var adc = rawPress;
  var var1 = (this.tFine / 2.0) - 64000.0;
  var var2 = var1 * var1 * (this.dig_P6 / 32768.0);
  var2 = var2 + var1 * this.dig_P5 * 2.0;
  var2 = (var2 / 4.0) + (this.dig_P4 * 65536.0);
  var1 = (this.dig_P3 * var1 * var1 / 524288.0 + this.dig_P2 * var1) / 524288.0;
  var1 = (1.0 + var1 / 32768.0) * this.dig_P1;
  if (var1 == 0)
    return 0;
  var p = 1048576.0 - adc;
  p = ((p - var2 / 4096.0) * 6250.0) / var1;
  var1 = this.dig_P9 * p * p / 2147483648.0;
  var2 = p * this.dig_P8 / 32768.0;
  p = p + (var1 + var2 + this.dig_P7) / 16.0;
  return p;
};

Bme280.prototype.calculateHumidity = function(rawHum) {
  var adc = rawHum;
  var h = this.tFine - 76800.0;
  h = (adc - (this.dig_H4 * 64.0 + this.dig_H5 / 16384.8 * h)) *
      (this.dig_H2 / 65536.0 * (1.0 + this.dig_H6 / 67108864.0 * h * (1.0 + this.dig_H3 / 67108864.0 * h)));
  h = h * (1.0 - this.dig_H1 * h / 524288.0);
  if (h > 100) {
    h = 100;
  } else if (h < 0) {
    h = 0;
  }
  return h;
};
