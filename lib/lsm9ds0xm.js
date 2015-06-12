/*
 * LSM9DS0XM I2C accelerometer driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A LSM9DS0XM Driver
 *
 * @constructor lsm9ds0xm
 */
var LSM9DS0XM = module.exports = function LSM9DS0XM() {
  LSM9DS0XM.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x1d;

  this.commands = {
    getAccel: this.getAccel,
    getMag: this.getMag
  };
};

Cylon.Utils.subclass(LSM9DS0XM, I2CDriver);

LSM9DS0XM.OUT_TEMP_L_XM = 0x05;
LSM9DS0XM.OUT_TEMP_H_XM = 0x06;
LSM9DS0XM.STATUS_REG_M = 0x07;
LSM9DS0XM.OUT_X_L_M = 0x08;
LSM9DS0XM.OUT_X_H_M = 0x09;
LSM9DS0XM.OUT_Y_L_M = 0x0A;
LSM9DS0XM.OUT_Y_H_M = 0x0B;
LSM9DS0XM.OUT_Z_L_M = 0x0C;
LSM9DS0XM.OUT_Z_H_M = 0x0D;
LSM9DS0XM.WHO_AM_I_XM = 0x0F;
LSM9DS0XM.INT_CTRL_REG_M = 0x12;
LSM9DS0XM.INT_SRC_REG_M = 0x13;
LSM9DS0XM.INT_THS_L_M = 0x14;
LSM9DS0XM.INT_THS_H_M = 0x15;
LSM9DS0XM.OFFSET_X_L_M = 0x16;
LSM9DS0XM.OFFSET_X_H_M = 0x17;
LSM9DS0XM.OFFSET_Y_L_M = 0x18;
LSM9DS0XM.OFFSET_Y_H_M = 0x19;
LSM9DS0XM.OFFSET_Z_L_M = 0x1A;
LSM9DS0XM.OFFSET_Z_H_M = 0x1B;
LSM9DS0XM.REFERENCE_X = 0x1C;
LSM9DS0XM.REFERENCE_Y = 0x1D;
LSM9DS0XM.REFERENCE_Z = 0x1E;
LSM9DS0XM.CTRL_REG0_XM = 0x1F;
LSM9DS0XM.CTRL_REG1_XM = 0x20;
LSM9DS0XM.CTRL_REG2_XM = 0x21;
LSM9DS0XM.CTRL_REG3_XM = 0x22;
LSM9DS0XM.CTRL_REG4_XM = 0x23;
LSM9DS0XM.CTRL_REG5_XM = 0x24;
LSM9DS0XM.CTRL_REG6_XM = 0x25;
LSM9DS0XM.CTRL_REG7_XM = 0x26;
LSM9DS0XM.STATUS_REG_A = 0x27;
LSM9DS0XM.OUT_X_L_A = 0x28;
LSM9DS0XM.OUT_X_H_A = 0x29;
LSM9DS0XM.OUT_Y_L_A = 0x2A;
LSM9DS0XM.OUT_Y_H_A = 0x2B;
LSM9DS0XM.OUT_Z_L_A = 0x2C;
LSM9DS0XM.OUT_Z_H_A = 0x2D;
LSM9DS0XM.FIFO_CTRL_REG = 0x2E;
LSM9DS0XM.FIFO_SRC_REG = 0x2F;
LSM9DS0XM.INT_GEN_1_REG = 0x30;
LSM9DS0XM.INT_GEN_1_SRC = 0x31;
LSM9DS0XM.INT_GEN_1_THS = 0x32;
LSM9DS0XM.INT_GEN_1_DURATION = 0x33;
LSM9DS0XM.INT_GEN_2_REG = 0x34;
LSM9DS0XM.INT_GEN_2_SRC = 0x35;
LSM9DS0XM.INT_GEN_2_THS = 0x36;
LSM9DS0XM.INT_GEN_2_DURATION = 0x37;
LSM9DS0XM.CLICK_CFG = 0x38;
LSM9DS0XM.CLICK_SRC = 0x39;
LSM9DS0XM.CLICK_THS = 0x3A;
LSM9DS0XM.TIME_LIMIT = 0x3B;
LSM9DS0XM.TIME_LATENCY = 0x3C;
LSM9DS0XM.TIME_WINDOW = 0x3D;
LSM9DS0XM.ACT_THS = 0x3E;
LSM9DS0XM.ACT_DUR = 0x3F;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
LSM9DS0XM.prototype.start = function(callback) {
  this._initAccel();
  this._initMag();
  callback();
};

/**
 * Gets the value of Accelerometer.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */
LSM9DS0XM.prototype.getAccel = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          LSM9DS0XM.OUT_X_L_A,
                          6,
    function(err, d) {
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

/**
 * Gets the value of Magnetometer.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */
LSM9DS0XM.prototype.getMag = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          LSM9DS0XM.OUT_X_L_M,
                          6,
    function(err, d) {
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

LSM9DS0XM.prototype._initAccel = function() {
  /* CTRL_REG0_XM (0x1F) (Default value: 0x00)
  Bits (7-0): BOOT FIFO_EN WTM_EN 0 0 HP_CLICK HPIS1 HPIS2
  BOOT - Reboot memory content (0: normal, 1: reboot)
  FIFO_EN - Fifo enable (0: disable, 1: enable)
  WTM_EN - FIFO watermark enable (0: disable, 1: enable)
  HP_CLICK - HPF enabled for click (0: filter bypassed, 1: enabled)
  HPIS1 - HPF enabled for interrupt generator 1 (0: bypassed, 1: enabled)
  HPIS2 - HPF enabled for interrupt generator 2 (0: bypassed, 1 enabled)   */
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG0_XM, 0x00);

  /* CTRL_REG1_XM (0x20) (Default value: 0x07)
  Bits (7-0): AODR3 AODR2 AODR1 AODR0 BDU AZEN AYEN AXEN
  AODR[3:0] - select the acceleration data rate:
    0000=power down, 0001=3.125Hz, 0010=6.25Hz, 0011=12.5Hz,
    0100=25Hz, 0101=50Hz, 0110=100Hz, 0111=200Hz, 1000=400Hz,
    1001=800Hz, 1010=1600Hz, (remaining combinations undefined).
  BDU - block data update for accel AND mag
    0: Continuous update
    1: Output registers aren't updated until MSB and LSB have been read.
  AZEN, AYEN, and AXEN - Acceleration x/y/z-axis enabled.
    0: Axis disabled, 1: Axis enabled                  */
  // 100Hz data rate, x/y/z all enabled
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG1_XM, 0x57);

  /* CTRL_REG2_XM (0x21) (Default value: 0x00)
  Bits (7-0): ABW1 ABW0 AFS2 AFS1 AFS0 AST1 AST0 SIM
  ABW[1:0] - Accelerometer anti-alias filter bandwidth
    00=773Hz, 01=194Hz, 10=362Hz, 11=50Hz
  AFS[2:0] - Accel full-scale selection
    000=+/-2g, 001=+/-4g, 010=+/-6g, 011=+/-8g, 100=+/-16g
  AST[1:0] - Accel self-test enable
    00=normal (no self-test), 01=positive st, 10=negative st, 11=not allowed
  SIM - SPI mode selection
    0=4-wire, 1=3-wire                           */
  this.connection.i2cWrite(this.address,
                           LSM9DS0XM.CTRL_REG2_XM,
                           0x00); // Set scale to 2g

  /* CTRL_REG3_XM is used to set interrupt generators on INT1_XM
  Bits (7-0): P1_BOOT P1_TAP P1_INT1 P1_INT2 P1_INTM P1_DRDYA P1_DRDYM P1_EMPTY
  */
  // Accelerometer data ready on INT1_XM (0x04)
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG3_XM, 0x04);
};

LSM9DS0XM.prototype._initMag = function() {
  /* CTRL_REG5_XM enables temp sensor, sets mag resolution and data rate
  Bits (7-0): TEMP_EN M_RES1 M_RES0 M_ODR2 M_ODR1 M_ODR0 LIR2 LIR1
  TEMP_EN - Enable temperature sensor (0=disabled, 1=enabled)
  M_RES[1:0] - Magnetometer resolution select (0=low, 3=high)
  M_ODR[2:0] - Magnetometer data rate select
    000=3.125Hz, 001=6.25Hz, 010=12.5Hz, 011=25Hz, 100=50Hz, 101=100Hz
  LIR2 - Latch interrupt request on INT2_SRC (cleared by reading INT2_SRC)
    0=interrupt request not latched, 1=interrupt request latched
  LIR1 - Latch interrupt request on INT1_SRC (cleared by readging INT1_SRC)
    0=irq not latched, 1=irq latched                   */
  // Mag data rate - 100 Hz, enable temperature sensor
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG5_XM, 0x94);

  /* CTRL_REG6_XM sets the magnetometer full-scale
  Bits (7-0): 0 MFS1 MFS0 0 0 0 0 0
  MFS[1:0] - Magnetic full-scale selection
  00:+/-2Gauss, 01:+/-4Gs, 10:+/-8Gs, 11:+/-12Gs               */
  // Mag scale to +/- 2GS
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG6_XM, 0x00);

  /* CTRL_REG7_XM sets magnetic sensor mode, low power mode, and filters
  AHPM1 AHPM0 AFDS 0 0 MLP MD1 MD0
  AHPM[1:0] - HPF mode selection
    00=normal (resets reference registers), 01=reference signal for filtering,
    10=normal, 11=autoreset on interrupt event
  AFDS - Filtered acceleration data selection
    0=internal filter bypassed, 1=data from internal filter sent to FIFO
  MLP - Magnetic data low-power mode
    0=data rate is set by M_ODR bits in CTRL_REG5
    1=data rate is set to 3.125Hz
  MD[1:0] - Magnetic sensor mode selection (default 10)
    00=continuous-conversion, 01=single-conversion, 10 and 11=power-down */
  // Continuous conversion mode
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG7_XM, 0x00);

  /* CTRL_REG4_XM is used to set interrupt generators on INT2_XM
  Bits (7-0): P2_TAP P2_INT1 P2_INT2 P2_INTM P2_DRDYA P2_DRDYM P2_Overrun P2_WTM
  */
  // Magnetometer data ready on INT2_XM (0x08)
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG4_XM, 0x04);

  /* INT_CTRL_REG_M to set push-pull/open drain, and active-low/high
  Bits[7:0] - XMIEN YMIEN ZMIEN PP_OD IEA IEL 4D MIEN
  XMIEN, YMIEN, ZMIEN - Enable interrupt recognition on axis for mag data
  PP_OD - Push-pull/open-drain interrupt configuration (0=push-pull, 1=od)
  IEA - Interrupt polarity for accel and magneto
    0=active-low, 1=active-high
  IEL - Latch interrupt request for accel and magneto
    0=irq not latched, 1=irq latched
  4D - 4D enable. 4D detection is enabled when 6D bit in INT_GEN1_REG is set
  MIEN - Enable interrupt generation for magnetic data
    0=disable, 1=enable) */
  // Enable interrupts for mag, active-low, push-pull
  this.connection.i2cWrite(this.address, LSM9DS0XM.INT_CTRL_REG_M, 0x09);
};
