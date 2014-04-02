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

    function toUShort(b1, b2) {
        return (b1 << 8) | b2;
    }

    function toSShort(b1, b2) {
        return ((((b1 << 8) | b2) << 16) >> 16);
    }

    return this.Bmp180 = (function(klass) {
        var
            BMP180_REGISTER_CALIBRATION,
            BMP180_REGISTER_CONTROL,
            BMP180_REGISTER_TEMPDATA,
            BMP180_REGISTER_PRESSUREDATA,
            BMP180_REGISTER_READTEMPCMD,
            BMP180_REGISTER_READPRESSURECMD;

        subclass(Bmp180, klass);

        function Bmp180() {
            Bmp180.__super__.constructor.apply(this, arguments);
            this.address = 0x77;
        }

        Bmp180.prototype.commands = function() {
            return ['getPressure', 'getTemperature', 'getAltitude'];
        };

        Bmp180.prototype.start = function(callback) {
            this.readCoefficients(callback);
        };

        Bmp180.prototype.getPressure = function(mode, callback) {
            var _this = this;
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
                if(err) callback(err, null);
                else {
                    x1 = ((rawTemp - _this.ac6) * _this.ac5) >> 15;
                    x2 = Math.ceil((_this.mc << 11) / (x1 + _this.md));
                    b5 = x1 + x2;
                    temp = ((b5 + 8) >> 4) / 10.0;

                    _this.getRawPressure(mode, function(err, rawPress) {
                        if(err) callback(err);
                        else {

                            var modeVal = parseInt(mode);
                            b6 = b5 - 4000;
                            x1 = (_this.b2 * (b6 * b6) >> 12) >> 11;
                            x2 = (_this.ac2 * b6) >> 11;
                            x3 = x1 + x2;
                            b3 = Math.ceil((((_this.ac1 * 4 + x3) << modeVal) + 2) / 4);

                            x1 = (_this.ac3 * b6) >> 13;
                            x2 = (_this.b1 * ((b6 * b6) >> 12)) >> 16;
                            x3 = ((x1 + x2) + 2) >> 2;
                            b4 = (_this.ac4 * (x3 + 32768)) >> 15;
                            b7 = (rawPress - b3) * (50000 >> modeVal);

                            if(b7 < 0x80000000) {
                                p = Math.ceil((b7 * 2) / b4);
                            }
                            else {
                                p = Math.ceil((b7 / b4) * 2);
                            }

                            x1 = (p >> 8) * (p >> 8);
                            x1 = (x1 * 3038) >> 16;
                            x2 = (-7357 * p) >> 16;

                            p = p + ((x1 + x2 + 3791) >> 4);

                            callback(null, {temp: temp, press:p});
                        }
                    });
                }
            });
        };

        Bmp180.prototype.getTemperature = function(callback) {
            var _this = this;
            var x1 = 0,
                x2 = 0,
                b5 = 0,
                temp = 0.0;

            this.getRawTemp(function(err, rawTemp) {
                if(err) callback(err, null);
                else {
                    x1 = ((rawTemp - _this.ac6) * _this.ac5) >> 15;
                    x2 = Math.ceil((_this.mc << 11) / (x1 + _this.md));
                    b5 = x1 + x2;
                    temp = ((b5 + 8) >> 4) / 10.0;

                    callback(null, {temp:temp});
                }
            });
        };

        Bmp180.prototype.getAltitude = function(mode, seaLevelPressure, callback) {
            if(seaLevelPressure == null) seaLevelPressure = 101325;
            this.getPressure(mode, function(err, vals) {
                if(err) callback(err);
                else {
                    var altitude = 44330.0 * (1.0 - Math.pow(vals.press / seaLevelPressure, 0.1903));
                    callback(null, {temp: vals.temp, press:vals.press, alt: altitude});
                }
            });
        };

        Bmp180.prototype.readCoefficients = function(callback) {
            var _this = this;
            return this.connection.i2cRead(this.address, BMP180_REGISTER_CALIBRATION, 22, function(err, data) {
                if(err) callback(err);
                else {
                    _this.ac1 = toSShort(data[0],  data[1]);
                    _this.ac2 = toSShort(data[2],  data[3]);
                    _this.ac3 = toSShort(data[4],  data[5]);
                    _this.ac4 = toUShort(data[6],  data[7]);
                    _this.ac5 = toUShort(data[8],  data[9]);
                    _this.ac6 = toUShort(data[10], data[11]);

                    _this.b1 = toSShort(data[12], data[13]);
                    _this.b2 = toSShort(data[14], data[15]);

                    _this.mb = toSShort(data[16], data[17]);
                    _this.mc = toSShort(data[18], data[19]);
                    _this.md = toSShort(data[20], data[21]);

                    callback();
                    _this.device.emit('start');
                }
            });
        };

        Bmp180.prototype.getRawTemp = function(callback) {
            var _this = this;
            this.connection.i2cWrite(_this.address, BMP180_REGISTER_CONTROL, [BMP180_REGISTER_READTEMPCMD], function(err) {
                if(err) callback(err, null);
                else {
                    setTimeout(function() {
                        _this.connection.i2cRead(_this.address, BMP180_REGISTER_TEMPDATA, 2, function(err, data) {
                            if(err) callback(err, null);
                            else {
                                var rawTemp = toUShort(data[0], data[1]);
                                callback(null, rawTemp);
                            }
                        })
                    }, 5);
                }
            });
        };

        Bmp180.prototype.getRawPressure = function(mode, callback) {
            var _this = this;
            var modeVal = parseInt(mode);
            if(isNaN(modeVal) || modeVal < 0 || modeVal > 3) callback(new Error("Invalid pressure sensing mode."));
            this.connection.i2cWrite(_this.address, BMP180_REGISTER_CONTROL, [BMP180_REGISTER_READPRESSURECMD], function(err) {
                if(err) callback(err, null);
                else {
                    var waitTime;
                    switch(mode) {
                        case 0:
                            waitTime = 5;
                            break;
                        case 1:
                            waitTime = 8;
                            break;
                        case 2:
                            waitTime = 14;
                            break;
                        case 3:
                            waitTime = 26
                            break;
                        default:
                            waitTime = 8;
                            break;
                    }
                    setTimeout(function() {
                        _this.connection.i2cRead(_this.address, BMP180_REGISTER_PRESSUREDATA, 3, function(err, data) {
                            if(err) callback(err, null);
                            else {
                                var msb = data[0];
                                var lsb = data[1];
                                var xlsb = data[2];
                                var rawPress = ((msb << 16) + (lsb << 8) + xlsb) >> (8-modeVal);
                                callback(null, rawPress);
                            }
                        })
                    }, waitTime);
                }
            });
        };

        BMP180_REGISTER_CALIBRATION = 0xAA;
        BMP180_REGISTER_CONTROL = 0xF4;
        BMP180_REGISTER_TEMPDATA = 0xF6;
        BMP180_REGISTER_PRESSUREDATA = 0xF6;
        BMP180_REGISTER_READTEMPCMD = 0x2E;
        BMP180_REGISTER_READPRESSURECMD = 0x34;

        return Bmp180;

    })(Cylon.Driver);
});
