/*
 * LCD display driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A LCD Driver
 *
 * @constructor lcd
 */
var LCD = module.exports = function LCD() {
  LCD.__super__.constructor.apply(this, arguments);

  this.address = this.address || 0x27;
  this._backlightVal = LCD.NOBACKLIGHT;
  this._displayfunction = LCD.FOURBITMODE | LCD.TWOLINE | LCD.FIVExEIGHTDOTS;
  this._displaycontrol = LCD.DISPLAYON | LCD.CURSOROFF | LCD.BLINKOFF;
  this._displaymode = LCD.ENTRYLEFT | LCD.ENTRYSHIFTDECREMENT;

  this.setupCommands([
    "clear", "home", "setCursor", "displayOff", "displayOn",
    "cursorOff", "cursorOn", "blinkOff", "blinkOn", "backlightOff",
    "backlightOn", "print"
  ]);
};

Cylon.Utils.subclass(LCD, I2CDriver);

// i2c commands
LCD.CLEARDISPLAY = 0x01;
LCD.RETURNHOME = 0x02;
LCD.ENTRYMODESET = 0x04;
LCD.DISPLAYCONTROL = 0x08;
LCD.CURSORSHIFT = 0x10;
LCD.FUNCTIONSET = 0x20;
LCD.SETCGRAMADDR = 0x40;
LCD.SETDDRAMADDR = 0x80;

// flags for display entry mode
LCD.ENTRYRIGHT = 0x00;
LCD.ENTRYLEFT = 0x02;
LCD.ENTRYSHIFTINCREMENT = 0x01;
LCD.ENTRYSHIFTDECREMENT = 0x00;

// flags for display on/off control
LCD.DISPLAYON = 0x04;
LCD.DISPLAYOFF = 0x00;
LCD.CURSORON = 0x02;
LCD.CURSOROFF = 0x00;
LCD.BLINKON = 0x01;
LCD.BLINKOFF = 0x00;

// flags for display/cursor shift
LCD.DISPLAYMOVE = 0x08;
LCD.CURSORMOVE = 0x00;
LCD.MOVERIGHT = 0x04;
LCD.MOVELEFT = 0x00;

// flags for function set
LCD.EIGHTBITMODE = 0x10;
LCD.FOURBITMODE = 0x00;
LCD.TWOLINE = 0x08;
LCD.ONELINE = 0x00;
LCD.FIVExTENDOTS = 0x04;
LCD.FIVExEIGHTDOTS = 0x00;

// flags for backlight control
LCD.BACKLIGHT = 0x08;
LCD.NOBACKLIGHT = 0x00;

LCD.En = 0x04; // Enable bit
LCD.Rw = 0x02; // Read/Write bit
LCD.Rs = 0x01; // Register select bit

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
LCD.prototype.start = function(callback) {
  this._init();

  this.displayOn();
  this.clear();
  this.home();

  // Turn backlight on by default
  this.backlightOn();

  every(0, function() {
    this._expanderWrite(this._backlightVal);
  }.bind(this));

  callback();
};

/**
 * Clears display and returns cursor to the home position (address 0).
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.clear = function(callback) {
  this._sendCommand(LCD.CLEARDISPLAY);
  Cylon.Utils.sleep(2);

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
LCD.prototype.home = function(callback) {
  this._sendCommand(LCD.RETURNHOME);
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
LCD.prototype.setCursor = function(col, row, callback) {
  var rowOffsets = [0x00, 0x40, 0x14, 0x54];
  this._sendCommand(LCD.SETDDRAMADDR | (col + rowOffsets[row]));
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
LCD.prototype.displayOff = function(callback) {
  this._displaycontrol &= ~LCD.DISPLAYON;
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
LCD.prototype.displayOn = function(callback) {
  this._displaycontrol |= LCD.DISPLAYON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns off the cursor.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.cursorOff = function(callback) {
  this._displaycontrol &= ~LCD.CURSORON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns on the cursor.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.cursorOn = function(callback) {
  this._displaycontrol |= LCD.CURSORON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns off the cursor blinking character.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.blinkOff = function(callback) {
  this._displaycontrol &= ~LCD.BLINKON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns on the cursor blinking character.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.blinkOn = function(callback) {
  this._displaycontrol |= LCD.BLINKON;
  this._sendDisplayCommand(callback);
};

/**
 * Turns off the back light.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.backlightOff = function(callback) {
  this._backlightVal = LCD.NOBACKLIGHT;
  this._expanderWrite(0);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Turns on the back light.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.backlightOn = function(callback) {
  this._backlightVal = LCD.BACKLIGHT;
  this._expanderWrite(0);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Prints characters on the LCD.
 *
 * @param {String} str string to print on the LCD
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.print = function(str, callback) {
  var chars = str.split("");

  for (var i = 0; i < chars.length; i++) {
    this._writeData(chars[i].charCodeAt(0));
  }

  if (typeof callback === "function") {
    callback();
  }
};

LCD.prototype._write4bits = function(val) {
  this._expanderWrite(val);
  this._pulseEnable(val);
};

LCD.prototype._expanderWrite = function(data) {
  this.connection.i2cWrite(this.address, (data | this._backlightVal) & 0xFF);
};

LCD.prototype._pulseEnable = function(data) {
  this._expanderWrite(data | LCD.En);
  Cylon.Utils.sleep(0.0001);
  this._expanderWrite(data & ~LCD.En);
  Cylon.Utils.sleep(0.05);
};

LCD.prototype._sendCommand = function(value) {
  this._sendData(value, 0);
};

LCD.prototype._writeData = function(value) {
  this._sendData(value, LCD.Rs);
};

LCD.prototype._sendData = function(val, mode) {
  var highnib = val & 0xf0,
      lownib = (val << 4) & 0xf0;

  this._write4bits(highnib | mode);
  this._write4bits(lownib | mode);
};

LCD.prototype._init = function() {
  Cylon.Utils.sleep(50);

  this._expanderWrite(this._backlightVal);
  Cylon.Utils.sleep(100);

  this._write4bits(0x03 << 4);
  Cylon.Utils.sleep(4);

  this._write4bits(0x03 << 4);
  Cylon.Utils.sleep(4);

  this._write4bits(0x03 << 4);
  this._write4bits(0x02 << 4);
  this._sendCommand(LCD.FUNCTIONSET | this._displayfunction);

  // Initialize to default text direction (for roman languages), set entry mode
  this._sendCommand(LCD.ENTRYMODESET | this._displaymode);
};

LCD.prototype._sendDisplayCommand = function(callback) {
  this._sendCommand(LCD.DISPLAYCONTROL | this._displaycontrol);
  if (typeof callback === "function") {
    callback();
  }
};
