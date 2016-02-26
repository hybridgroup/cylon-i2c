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


MAG3110.prototype._initMag = function () {
    var mx;
    var my;
    var mz;
    var temp;

    MAG3110();
    void init( sysmod);
    void read();
    void reset();

    void setDataRate( dataRate, osRatio);

    void setOffsetX(offset);
    void setOffsetY(offset);
    void setOffsetZ(offset);

    void setOperatingMode(isActive);
    getOperatingMode();

    getSysMod();

    void setRawMode(isRaw);
    getRawMode();

    void writeTo(address, val);
    void readFrom(address, num, buffer([]));
    void setRegisterBit(regAdress, bitPos, state);
    getRegisterBit( regAdress,bitPos);

}

/*
#include <Wire.h>
#include "Header1.h"



MAG3110::MAG3110()
{
    mx = my = mz = 0;
    temp = 0;
}

void MAG3110::writeTo(byte address, byte val)
{
    Wire.beginTransmission(MAG3110_ADDR);
    Wire.write(address);
    Wire.write(val);
    Wire.endTransmission();
}

void MAG3110::readFrom(byte address, int num, byte buff[])
{
    Wire.beginTransmission(MAG3110_ADDR);
    Wire.write(address);
    Wire.endTransmission();

    Wire.beginTransmission(MAG3110_ADDR);
    Wire.requestFrom(MAG3110_ADDR, num);

    int i = 0;
    while (Wire.available())
    {
        buff[i] = Wire.read();
        i++;
    }
    Wire.endTransmission();
}


void MAG3110::setRegisterBit(byte regAdress, int bitPos, bool state)
{
    byte _b;
    readFrom(regAdress, 1, &_b);
    if (state) {
        _b |= (1 << bitPos);
    }
    else {
        _b &= ~(1 << bitPos);
    }
    writeTo(regAdress, _b);
}

bool MAG3110::getRegisterBit(byte regAdress, int bitPos)
{
    byte _b;
    readFrom(regAdress, 1, &_b);
    return ((_b >> bitPos) & 1);
}


void MAG3110::init(byte sysmod)
{
    Wire.begin();
    setRegisterBit(MAG3110_REG_CTRL_REG2,
        MAG3110_BIT_AUTO_RESET,
        1);
    switch (sysmod)
    {
    case SYSMOD_STANDBY:
        setRegisterBit(MAG3110_REG_CTRL_REG1,
            MAG3110_BIT_ACTIVE,
            0);
        break;
    case SYSMOD_ACTIVE_RAW:
        setRegisterBit(MAG3110_REG_CTRL_REG1,
            MAG3110_BIT_ACTIVE,
            1);
        setRegisterBit(MAG3110_REG_CTRL_REG2,
            MAG3110_BIT_RAW,
            1);
        break;
    case SYSMOD_ACTIVE:
        setRegisterBit(MAG3110_REG_CTRL_REG1,
            MAG3110_BIT_ACTIVE,
            1);
        setRegisterBit(MAG3110_REG_CTRL_REG2,
            MAG3110_BIT_RAW,
            0);
        break;
    }
}

void MAG3110::read()
{
    byte buf[6];
    readFrom(MAG3110_REG_OUT_X_MSB, 6, buf);
    mx = buf[0] << 8 | buf[1];
    my = buf[2] << 8 | buf[3];
    mz = buf[4] << 8 | buf[5];
    readFrom(MAG3110_REG_DIE_TEMP, 6, &temp);
}

void MAG3110::reset()
{
    setRegisterBit(MAG3110_REG_CTRL_REG2,
        MAG3110_BIT_RESET,
        true);
}

void MAG3110::setDataRate(byte dataRate, byte osRatio)
{
    byte dr;
    readFrom(MAG3110_REG_CTRL_REG1, 1, &dr);

    dr &= ~(MAG3110_MASK_DR | MAG3110_MASK_OSR);
    dr |= dataRate;
    dr |= osRatio;

    writeTo(MAG3110_REG_CTRL_REG1, dr);

}


void MAG3110::setOperatingMode(bool isActive)
{
    setRegisterBit(MAG3110_REG_CTRL_REG1,
        MAG3110_BIT_ACTIVE,
        isActive);
}

bool MAG3110::getOperatingMode()
{
    return getRegisterBit(MAG3110_REG_CTRL_REG1,
        MAG3110_BIT_ACTIVE);
}

byte MAG3110::getSysMod()
{
    byte out;
    readFrom(MAG3110_REG_SYSMOD, 1, &out);
    return out;
}

void MAG3110::setRawMode(bool isRaw)
{
    setRegisterBit(MAG3110_REG_CTRL_REG2,
        MAG3110_BIT_RAW,
        isRaw ? 1 : 0);
}

bool MAG3110::getRawMode()
{
    return getRegisterBit(MAG3110_REG_CTRL_REG2,
        MAG3110_BIT_RAW);

}


//Impostazione offset non funziona
void  MAG3110::setOffsetX(int offset)
{
    writeTo(MAG3110_REG_OFF_X_MSB, offset << 9);
    writeTo(MAG3110_REG_OFF_X_LSB, offset << 1);
}

void  MAG3110::setOffsetY(int offset)
{
    writeTo(MAG3110_REG_OFF_Y_MSB, offset << 9);
    writeTo(MAG3110_REG_OFF_Y_LSB, offset << 1);
}

void  MAG3110::setOffsetZ(int offset)
{
    writeTo(MAG3110_REG_OFF_Z_MSB, offset << 9);
    writeTo(MAG3110_REG_OFF_Z_LSB, offset << 1);
}
*/