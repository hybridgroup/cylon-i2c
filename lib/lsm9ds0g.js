/*
 * LSM9DS0G I2C gyroscope driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A LSM9DS0G Driver
 *
 * @constructor lsm9ds0g
 * @param {Object} [opts] options object
 * @param {Number} opts.scale gyroscope scale
 * @param {Number} opts.odr ODR setting
 */
var LSM9DS0G = module.exports = function LSM9DS0G(opts) {
  LSM9DS0G.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x6b;

  this.scale = opts.scale || LSM9DS0G.G_SCALE_245DPS;
  this.odr = opts.odr || LSM9DS0G.G_ODR_95_BW_125;

  this.commands = {
    getGyro: this.getGyro
  };
};

Cylon.Utils.subclass(LSM9DS0G, I2CDriver);

LSM9DS0G.WHO_AM_I_G = 0x0F;
LSM9DS0G.CTRL_REG1_G = 0x20;
LSM9DS0G.CTRL_REG2_G = 0x21;
LSM9DS0G.CTRL_REG3_G = 0x22;
LSM9DS0G.CTRL_REG4_G = 0x23;
LSM9DS0G.CTRL_REG5_G = 0x24;
LSM9DS0G.REFERENCE_G = 0x25;
LSM9DS0G.STATUS_REG_G = 0x27;
LSM9DS0G.OUT_X_L_G = 0x28;
LSM9DS0G.OUT_X_H_G = 0x29;
LSM9DS0G.OUT_Y_L_G = 0x2A;
LSM9DS0G.OUT_Y_H_G = 0x2B;
LSM9DS0G.OUT_Z_L_G = 0x2C;
LSM9DS0G.OUT_Z_H_G = 0x2D;
LSM9DS0G.FIFO_CTRL_REG_G = 0x2E;
LSM9DS0G.FIFO_SRC_REG_G = 0x2F;
LSM9DS0G.INT1_CFG_G = 0x30;
LSM9DS0G.INT1_SRC_G = 0x31;
LSM9DS0G.INT1_THS_XH_G = 0x32;
LSM9DS0G.INT1_THS_XL_G = 0x33;
LSM9DS0G.INT1_THS_YH_G = 0x34;
LSM9DS0G.INT1_THS_YL_G = 0x35;
LSM9DS0G.INT1_THS_ZH_G = 0x36;
LSM9DS0G.INT1_THS_ZL_G = 0x37;
LSM9DS0G.INT1_DURATION_G = 0x38;

LSM9DS0G.G_SCALE_245DPS = 0;  // 245 degrees per second
LSM9DS0G.G_SCALE_500DPS = 1;  // 500 dps
LSM9DS0G.G_SCALE_2000DPS = 2; // 2000 dps

LSM9DS0G.G_ODR_95_BW_125 = 0x0;  //   95         12.5
LSM9DS0G.G_ODR_95_BW_25 = 0x1;   //   95          25

    // 0x2 and 0x3 define the same data rate and bandwidth
LSM9DS0G.G_ODR_190_BW_125 = 0x4; //   190        12.5
LSM9DS0G.G_ODR_190_BW_25 = 0x5;  //   190         25
LSM9DS0G.G_ODR_190_BW_50 = 0x6;  //   190         50
LSM9DS0G.G_ODR_190_BW_70 = 0x7;  //   190         70
LSM9DS0G.G_ODR_380_BW_20 = 0x8;  //   380         20
LSM9DS0G.G_ODR_380_BW_25 = 0x9;  //   380         25
LSM9DS0G.G_ODR_380_BW_50 = 0xA;  //   380         50
LSM9DS0G.G_ODR_380_BW_100 = 0xB; //   380         100
LSM9DS0G.G_ODR_760_BW_30 = 0xC;  //   760         30
LSM9DS0G.G_ODR_760_BW_35 = 0xD;  //   760         35
LSM9DS0G.G_ODR_760_BW_50 = 0xE;  //   760         50
LSM9DS0G.G_ODR_760_BW_100 = 0xF; //   760         100

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
LSM9DS0G.prototype.start = function(callback) {
  this._initGyro();
  callback();
};

/**
 * Gets the value of Gyroscope.
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
LSM9DS0G.prototype.getGyro = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          LSM9DS0G.OUT_X_L_G,
                          6,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        var data = new Buffer(d);
        result.x = data.readInt16LE(0); // Store x-axis values into gx
        result.y = data.readInt16LE(2); // Store y-axis values into gy
        result.z = data.readInt16LE(4); // Store z-axis values into gz
        callback(null, result);
      }
    }
  );

};

LSM9DS0G.prototype._initGyro = function() {
  /* CTRL_REG1_G sets output data rate, bandwidth, power-down and enables
  Bits[7:0]: DR1 DR0 BW1 BW0 PD Zen Xen Yen
  DR[1:0] - Output data rate selection
    00=95Hz, 01=190Hz, 10=380Hz, 11=760Hz
  BW[1:0] - Bandwidth selection (sets cutoff frequency)
     Value depends on ODR. See datasheet table 21.
  PD - Power down enable (0=power down mode, 1=normal or sleep mode)
  Zen, Xen, Yen - Axis enable (o=disabled, 1=enabled) */
  // Normal mode, enable all axes
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG1_G, 0x0F);

  /* CTRL_REG2_G sets up the HPF
  Bits[7:0]: 0 0 HPM1 HPM0 HPCF3 HPCF2 HPCF1 HPCF0
  HPM[1:0] - High pass filter mode selection
    00=normal (reset reading HP_RESET_FILTER, 01=ref signal for filtering,
    10=normal, 11=autoreset on interrupt
  HPCF[3:0] - High pass filter cutoff frequency
    Value depends on data rate. See datasheet table 26.
  */
  // Normal mode, high cutoff frequency
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG2_G, 0x00);

  /* CTRL_REG3_G sets up interrupt and DRDY_G pins
  Bits[7:0]: I1_IINT1 I1_BOOT H_LACTIVE PP_OD I2_DRDY I2_WTM I2_ORUN I2_EMPTY
  I1_INT1 - Interrupt enable on INT_G pin (0=disable, 1=enable)
  I1_BOOT - Boot status available on INT_G (0=disable, 1=enable)
  H_LACTIVE - Interrupt active configuration on INT_G (0:high, 1:low)
  PP_OD - Push-pull/open-drain (0=push-pull, 1=open-drain)
  I2_DRDY - Data ready on DRDY_G (0=disable, 1=enable)
  I2_WTM - FIFO watermark interrupt on DRDY_G (0=disable 1=enable)
  I2_ORUN - FIFO overrun interrupt on DRDY_G (0=disable 1=enable)
  I2_EMPTY - FIFO empty interrupt on DRDY_G (0=disable 1=enable) */
  // Int1 enabled (pp, active low), data read on DRDY_G:
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG3_G, 0x88);

  /* CTRL_REG4_G sets the scale, update mode
  Bits[7:0] - BDU BLE FS1 FS0 - ST1 ST0 SIM
  BDU - Block data update (0=continuous, 1=output not updated until read
  BLE - Big/little endian (0=data LSB @ lower address, 1=LSB @ higher add)
  FS[1:0] - Full-scale selection
    00=245dps, 01=500dps, 10=2000dps, 11=2000dps
  ST[1:0] - Self-test enable
    00=disabled, 01=st 0 (x+, y-, z-), 10=undefined, 11=st 1 (x-, y+, z+)
  SIM - SPI serial interface mode select
    0=4 wire, 1=3 wire */
  // Set scale to 245 dps
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG4_G, 0x00);

  /* CTRL_REG5_G sets up the FIFO, HPF, and INT1
  Bits[7:0] - BOOT FIFO_EN - HPen INT1_Sel1 INT1_Sel0 Out_Sel1 Out_Sel0
  BOOT - Reboot memory content (0=normal, 1=reboot)
  FIFO_EN - FIFO enable (0=disable, 1=enable)
  HPen - HPF enable (0=disable, 1=enable)
  INT1_Sel[1:0] - Int 1 selection configuration
  Out_Sel[1:0] - Out selection configuration */
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG5_G, 0x00);
};
