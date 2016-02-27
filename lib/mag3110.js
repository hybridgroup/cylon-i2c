/*
 * MAG3110 I2C magnotrometer driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2016 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A MAG3110 Driver
 *
 * @constructor mag3110
 */

var MAG3110 = module.exports = function MAG3110() {
    MAG3110.__super__.constructor.apply(this, arguments);
    this.address = this.address || 0x0E;

    this.commands = {
        getMag: this.getMag
    };
};


Cylon.Utils.subclass(MAG3110, I2CDriver);

MAG3110.REG_DR_STATUS = 0x00
MAG3110.REG_OUT_X_MSB = 0x01
MAG3110.REG_OUT_X_LSB = 0x02
MAG3110.REG_OUT_Y_MSB = 0x03
MAG3110.REG_OUT_Y_LSB = 0x04
MAG3110.REG_OUT_Z_MSB = 0x05
MAG3110.REG_OUT_Z_LSB = 0x06

MAG3110.REG_WHO_AM_I  = 0x07
MAG3110.REG_SYSMOD    = 0x08

MAG3110.REG_OFF_X_MSB = 0x09
MAG3110.REG_OFF_X_LSB = 0x0A
MAG3110.REG_OFF_Y_MSB = 0x0B
MAG3110.REG_OFF_Y_LSB = 0x0C
MAG3110.REG_OFF_Z_MSB = 0x0D
MAG3110.REG_OFF_Z_LSB = 0x0E
MAG3110.REG_DIE_TEMP  = 0x0F
MAG3110.REG_CTRL_REG1 = 0X10
MAG3110.REG_CTRL_REG2 = 0X11


//maschere
MAG3110.MASK_DR       = 0xE0
MAG3110.MASK_OSR      = 0x18
//posizioni bit
MAG3110.BIT_ACTIVE     = 0x0
MAG3110.BIT_AUTO_RESET = 0x7
MAG3110.BIT_RAW	   = 0x5
MAG3110.BIT_RESET	   = 0x4


//Valori
MAG3110.SYSMOD_STANDBY	 = 0x0
MAG3110.SYSMOD_ACTIVE_RAW = 0x1
MAG3110.SYSMOD_ACTIVE	 = 0x2
/*
#define DR_0				B00000000
#define DR_1				B00100000
#define DR_2				B01000000
#define DR_3				B01100000
#define DR_4				B10000000
#define DR_5				B10100000
#define DR_6				B11000000
#define DR_7				B11100000
#define OSR_16				B00000000
#define OSR_32				B00001000
#define OSR_64				B00010000
#define OSR_128			B00011000
*/

MAG3110.prototype.getMag = function (callback) {
    var self = this;

    self.connection.i2cRead(self.address,
                            MAG3110.OUT_X_L_M,
                            6,
      function (err, d) {
          if (err) {
              callback(err, null);
          } else {
              var result = {};
              var data = new Buffer(d);
              result.x = data.readInt16LE(0);
              result.y = data.readInt16LE(2);
              result.z = data.readInt16LE(4);
              callback(null, result);
          }
      }
    );
};

MAG3110.prototype._initMag = function () {


    //data ready status per axis
    this.connection.i2cRead(this.address,MAG3110.REG_DR_STATUS, 0x00)

    //temp sensor signed 8bits in Celcius 
    this.connection.i2cRead(this.address, MAG3110.REG_DIE_TEMP, 0x0F);



    
    //x most significant byte
    this.connection.i2cRead(this.address, MAG3110.REG_OUT_X_MSB, 0x01);
    //x least significant byte
    this.connection.i2cRead(this.address, MAG3110.REG_OUT_X_LSB, 0x02);
    
    //y most signifigant byte
    this.connection.i2cRead(this.address, MAG3110.REG_OUT_Y_MSB, 0x03);
    //y least significant byte
    this.connection.i2cRead(this.address, MAG3110.REG_OUT_Y_LSB, 0x04);

    //z most significant bit 
    this.connection.i2cRead(this.address, MAG3110.REG_OUT_Z_MSB, 0x05);
    //z least significant bit
    this.connection.i2cRead(this.address, MAG3110.REG_OUT_Z_MSB, 0x06);



}

