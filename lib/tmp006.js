/*
 * TMP006 I2C ir temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2016 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");


/**
 * A TMP006 Driver
 *
 * @constructor tmp006
 */
var TMP006 = module.exports = function TMP006() {
    TMP006.__super__.constructor.apply(this, arguments);
    this.address = this.address || 0x40;

    this.commands = {
        getTmp: this.getTmp
    };
};

Cylon.Utils.subclass(TMP006, I2CDriver);


// Constants for calculating object temperature
TMP006.B0 = -0.0000294;
TMP006.B1 = -0.00000057;
TMP006.B2 = 0.00000000463;
TMP006.C2 = 13.4;
TMP006.TREF = 298.15;
TMP006.A2 = -0.00001678;
TMP006.A1 = 0.00175;
TMP006.S0 = 6.4; // * 10^-14

// Configuration Settings
TMP006.CONFIG = 0x02;
TMP006.CFG_RESET = 0x8000;
TMP006.CFG_MODEON = 0x7000;
TMP006.CFG_1SAMPLE = 0x0000;
TMP006.CFG_2SAMPLE = 0x0200;
TMP006.CFG_4SAMPLE = 0x0400;
TMP006.CFG_8SAMPLE = 0x0600;
TMP006.CFG_16SAMPLE = 0x0800;
TMP006.CFG_DRDYEN = 0x0100;
TMP006.CFG_DRDY = 0x0080;

TMP006.addr = 0x40;
TMP006.MANID = 0xFE;
TMP006.DEVID = 0xFF;

// Registers to read thermopile voltage and sensor temperature
TMP006.VOBJ = 0x00;
TMP006.TAMB = 0x01;



TMP006.prototype.start = function(callback) {
  this.getTmp();
  callback();
};


function readDieTemperature() {
  var self = this;

  self.connection.i2cRead(self.address, 
                          TMP006.TAMB,
                          2,
    function(err, d, result) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        result = data.readInt16LE(0);
        return result;
      }
    }
  );

};

function readRawVoltage() {
  var self = this;

  self.connection.i2cRead(self.address,
                          TMP006.VOBJ,
                          2,
    function(err, d, result) {
      if (err) {
        callback(err, null);
      } else {
        var result = {}; 
        result = data.readInt16LE(0);
        return result;
      }
    }
  );
};

TMP006.prototype.readObjTempC = function(callback) {
  var self = this;
  
  var Tdie = self.readRawDieTemperature;
  var Vobj = self.readRawVoltage;
  Vobj *= 156.25;  // 156.25 nV per LSB
  Vobj /= 1000; // nV -> uV
  Vobj /= 1000; // uV -> mV
  Vobj /= 1000; // mV -> V
  Tdie *= 0.03125; // convert to celsius
  Tdie += 273.15; // convert to kelvin

  self.connection.i2cRead(self.address,
                          TMP006.TREF,
                          2,
    function(err, d, result, finalRes) {
      if (err) {
        callback(err, null);
      } else {
        var data = new Buffer(d);
        var result = {};
        var finalRes = {}; 
        result = data.readInt16LE(0);
        var tdie_tref = Tdie - result;
        var S = (1 + TMP006.A1*tdie_tref + 
                     TMP006.A2*tdie_tref*tdie_tref);
        S *= TMP006.S0;
        S /= 10000000;
        S /= 10000000;
   
        var Vos = TMP006.B0 + TMP006.B1*tdie_tref + 
                TMP006.B2*tdie_tref*tdie_tref;
   
        var fVobj = (Vobj - Vos) + TMP006.C2*(Vobj-Vos)*(Vobj-Vos);
   
        var Tobj = Math.sqrt(Math.sqrt(Tdie * Tdie * Tdie * Tdie + fVobj/S));
   
        Tobj -= 273.15; // Kelvin -> *C
        result.temp = Tobj;
        callback(null, result);
      }
    }
  );
};

TMP006.prototype.getTmp = TMP006.prototype.readObjTempC;