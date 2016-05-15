/*
 * jhd1313m1 display driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2016 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A jhd1313m1 Driver
 *
 * @constructor Jhd1313m1
 * @param {Object} opts optional parameters
 */
var Jhd1313m1 = module.exports = function Jhd1313m1(opts) {
  Jhd1313m1.__super__.constructor.apply(this, arguments);

  this.address = this.address || 0x3E;
  this.rgbAddress = opts.rgbAddress || 0x62;

  this._backlightVal = Jhd1313m1.NOBACKLIGHT;
  this._displaycontrol = Jhd1313m1.DISPLAYON;

  this.setupCommands([
    "scroll", "setColor", "write", "setCursor", "clear", "home"
  ]);
};

Cylon.Utils.subclass(Jhd1313m1, I2CDriver);

// i2c commands
Jhd1313m1.CLEARDISPLAY = 0x01;
Jhd1313m1.RETURNHOME = 0x02;
Jhd1313m1.ENTRYMODESET = 0x04;
Jhd1313m1.DISPLAYCONTROL = 0x08;
Jhd1313m1.CURSORSHIFT = 0x10;
Jhd1313m1.FUNCTIONSET = 0x20;
Jhd1313m1.SETCGRAMADDR = 0x40;
Jhd1313m1.SETDDRAMADDR = 0x80;

// flags for display entry mode
Jhd1313m1.ENTRYRIGHT = 0x00;
Jhd1313m1.ENTRYLEFT = 0x02;
Jhd1313m1.ENTRYSHIFTINCREMENT = 0x01;
Jhd1313m1.ENTRYSHIFTDECREMENT = 0x00;

// flags for display on/off control
Jhd1313m1.DISPLAYON = 0x04;
Jhd1313m1.DISPLAYOFF = 0x00;
Jhd1313m1.CURSORON = 0x02;
Jhd1313m1.CURSOROFF = 0x00;
Jhd1313m1.BLINKON = 0x01;
Jhd1313m1.BLINKOFF = 0x00;

// flags for display/cursor shift
Jhd1313m1.DISPLAYMOVE = 0x08;
Jhd1313m1.CURSORMOVE = 0x00;
Jhd1313m1.MOVERIGHT = 0x04;
Jhd1313m1.MOVELEFT = 0x00;

// flags for function set
Jhd1313m1.EIGHTBITMODE = 0x10;
Jhd1313m1.FOURBITMODE = 0x00;
Jhd1313m1.TWOLINE = 0x08;
Jhd1313m1.ONELINE = 0x00;
Jhd1313m1.FIVExTENDOTS = 0x04;
Jhd1313m1.FIVExEIGHTDOTS = 0x00;

// flags for backlight control
Jhd1313m1.BACKLIGHT = 0x08;
Jhd1313m1.NOBACKLIGHT = 0x00;

Jhd1313m1.En = 0x04; // Enable bit
Jhd1313m1.Rw = 0x02; // Read/Write bit
Jhd1313m1.Rs = 0x01; // Register select bit

Jhd1313m1.LCD_COMMAND = 0x80;
Jhd1313m1.LCD_DATA = 0x40;

Jhd1313m1.REG_RED = 0x04;
Jhd1313m1.REG_GREEN = 0x03;
Jhd1313m1.REG_BLUE = 0x02;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Jhd1313m1.prototype.start = function(callback) {
  this._init();

  callback();
};

/**
 * Clears display and returns cursor to the home position (address 0).
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.clear = function(callback) {
  this._sendCommand(Jhd1313m1.CLEARDISPLAY);

  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Returns cursor to home position.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.home = function(callback) {
  this._sendCommand(Jhd1313m1.RETURNHOME);
  Cylon.Utils.sleep(2);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Sets cursor position.
 *
 * @param {Number} col cursor column to set
 * @param {Number} row cursor row to set
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.setCursor = function(col, row, callback) {
  var rowOffsets = [0x00, 0x40, 0x14, 0x54];
  this._sendCommand(Jhd1313m1.SETDDRAMADDR | (col | rowOffsets[row]));
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Sets Off of all display (D), cursor Off (C) and blink of cursor position
 * character (B).
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.displayOff = function(callback) {
  this._displaycontrol &= ~Jhd1313m1.DISPLAYON;
  this._sendDisplayCommand(callback);
};

/**
 * Sets On of all display (D), cursor On (C) and blink of cursor position
 * character (B).
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.displayOn = function(callback) {
  this._displaycontrol |= Jhd1313m1.DISPLAYON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns off the cursor.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.cursorOff = function(callback) {
  this._displaycontrol &= ~Jhd1313m1.CURSORON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns on the cursor.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.cursorOn = function(callback) {
  this._displaycontrol |= Jhd1313m1.CURSORON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns off the cursor blinking character.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.blinkOff = function(callback) {
  this._displaycontrol &= ~Jhd1313m1.BLINKON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns on the cursor blinking character.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.blinkOn = function(callback) {
  this._displaycontrol |= Jhd1313m1.BLINKON;
  this._sendDisplayCommand(callback);
};


/**
 * Display characters on the Jhd1313m1.
 *
 * @param {String} str string to print on the Jhd1313m1
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.write = function(str, callback) {
  var chars = str.split("");

  for (var i = 0; i < chars.length; i++) {
    this._writeData(chars[i].charCodeAt(0));
  }

  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Sets display RGB backlight color.
 *
 * @param {Number} r red color value
 * @param {Number} g green color value
 * @param {Number} b blue color value
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
Jhd1313m1.prototype.setColor = function(r, g, b, callback) {
  this._setRGBReg(Jhd1313m1.REG_RED, r);
  this._setRGBReg(Jhd1313m1.REG_GREEN, g);
  this._setRGBReg(Jhd1313m1.REG_BLUE, b);

  if (typeof callback === "function") {
    callback();
  }
};

Jhd1313m1.prototype._writeData = function(value) {
  this.connection.i2cWrite(this.address, Jhd1313m1.LCD_DATA, value);
};

Jhd1313m1.prototype._sendCommand = function(command) {
  this.connection.i2cWrite(this.address, Jhd1313m1.LCD_COMMAND, command);
};

Jhd1313m1.prototype._init = function() {
  Cylon.Utils.sleep(50);
  this._sendCommand(Jhd1313m1.FUNCTIONSET | Jhd1313m1.TWOLINE);

  Cylon.Utils.sleep(1);
  this._sendCommand(Jhd1313m1.DISPLAYCONTROL | Jhd1313m1.DISPLAYON);

  Cylon.Utils.sleep(1);
  this.clear();

  // Initialize to default text direction (for roman languages), set entry mode
  this._sendCommand(Jhd1313m1.ENTRYMODESET |
                    Jhd1313m1.ENTRYLEFT |
                    Jhd1313m1.ENTRYSHIFTDECREMENT);

  // init RGB backlight
  this.connection.i2cWrite(this.rgbAddress, 0, 0);
  this.connection.i2cWrite(this.rgbAddress, 1, 0);
  this.connection.i2cWrite(this.rgbAddress, 0x08, 0xAA);
  this.setColor(0xFF, 0xFF, 0xFF);
};

Jhd1313m1.prototype._sendDisplayCommand = function(callback) {
  this._sendCommand(Jhd1313m1.DISPLAYCONTROL | this._displaycontrol);
  if (typeof callback === "function") {
    callback();
  }
};

Jhd1313m1.prototype._setRGBReg = function(command, data) {
  this.connection.i2cWrite(this.rgbAddress, command, data);
};
