/*
 * LCD display driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


'use strict';

require('./cylon-i2c');

var namespace = require('node-namespace');

namespace("Cylon.Drivers.I2C", function() {
  return this.LCD = (function(_parent) {

    var BACKLIGHT, BLINKOFF, BLINKON, CLEARDISPLAY, CURSORMOVE, CURSOROFF, CURSORON, CURSORSHIFT,
        DISPLAYCONTROL, DISPLAYMOVE, DISPLAYOFF, DISPLAYON, EIGHTBITMODE, ENTRYLEFT, ENTRYMODESET,
        ENTRYRIGHT, ENTRYSHIFTDECREMENT, ENTRYSHIFTINCREMENT, En, FIVExEIGHTDOTS, FIVExTENDOTS,
        FOURBITMODE, FUNCTIONSET, MOVELEFT, MOVERIGHT, NOBACKLIGHT, ONELINE, RETURNHOME, Rs, Rw,
        SETCGRAMADDR, SETDDRAMADDR, TWOLINE;

    subclass(LCD, _parent);

    function LCD() {
      LCD.__super__.constructor.apply(this, arguments);
      this.address = 0x27;
      this._backlightVal = NOBACKLIGHT;
      this._displayfunction = FOURBITMODE | TWOLINE | FIVExEIGHTDOTS;
      this._displaycontrol = DISPLAYON | CURSOROFF | BLINKOFF;
      this._displaymode = ENTRYLEFT | ENTRYSHIFTDECREMENT;
    }

    LCD.prototype.commands = function() {
      return ['clear', 'home', 'setCursor', 'displayOff', 'displayOn', 'cursorOff', 'cursorOn', 'blinkOff', 'blinkOn', 'backlightOff', 'backlightOn', 'print'];
    };

    LCD.prototype.start = function(callback) {
      sleep(50);
      this._expanderWrite(this._backlightVal);
      sleep(1000);
      this._write4bits(0x03 << 4);
      sleep(4);
      this._write4bits(0x03 << 4);
      sleep(4);
      this._write4bits(0x03 << 4);
      this._write4bits(0x02 << 4);
      this._sendCommand(FUNCTIONSET | this._displayfunction);
      this.displayOn();
      this.clear();
      // Initialize to default text direction (for roman languages) & set the entry mode
      this._sendCommand(ENTRYMODESET | this._displaymode);
      this.home();
      return LCD.__super__.start.apply(this, arguments);
    };

    // clear display
    LCD.prototype.clear = function() {
      this._sendCommand(CLEARDISPLAY);
      sleep(2);
    };

    // move display cursor to home
    LCD.prototype.home = function() {
      this._sendCommand(RETURNHOME);
      sleep(2);
    };

    // move display cursor to col, row
    LCD.prototype.setCursor = function(col, row) {
      var row_offsets;
      row_offsets = [0x00, 0x40, 0x14, 0x54];
      this._sendCommand(SETDDRAMADDR | (col + row_offsets[row]));
    };

    LCD.prototype.displayOff = function() {
      this._displaycontrol &= ~DISPLAYON;
      this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
    };

    LCD.prototype.displayOn = function() {
      this._displaycontrol |= DISPLAYON;
      this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
    };

    LCD.prototype.cursorOff = function() {
      this._displaycontrol &= ~CURSORON;
      this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
    };

    LCD.prototype.cursorOn = function() {
      this._displaycontrol |= CURSORON;
      this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
    };

    LCD.prototype.blinkOff = function() {
      this._displaycontrol &= ~BLINKON;
      this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
    };

    LCD.prototype.blinkOn = function() {
      this._displaycontrol |= BLINKON;
      this.sendCommand(DISPLAYCONTROL | this._displaycontrol);
    };

    LCD.prototype.backlightOff = function() {
      this._backlightVal = NOBACKLIGHT;
      this.expanderWrite(0);
    };

    LCD.prototype.backlightOn = function() {
      this._backlightVal = BACKLIGHT;
      this._expanderWrite(0);
    };

    LCD.prototype.print = function(str) {
      var char, index, _i, _len, _ref, _results;
      _ref = str.split('');
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        char = _ref[index];
        _results.push(this._writeData(char.charCodeAt(0)));
      }
      return _results;
    };

    LCD.prototype._write4bits = function(val) {
      this._expanderWrite(val);
      this._pulseEnable(val);
    };

    LCD.prototype._expanderWrite = function(data) {
      this.connection.i2cWrite(this.address, data | this._backlightVal);
    };

    LCD.prototype._pulseEnable = function(data) {
      this._expanderWrite(data | En);
      this._expanderWrite(data & ~En);
    };

    LCD.prototype._sendCommand = function(value) {
      this._sendData(value, 0);
    };

    LCD.prototype._writeData = function(value) {
      this._sendData(value, Rs);
    };

    LCD.prototype._sendData = function(val, mode) {
      var highnib, lownib;
      highnib = val & 0xf0;
      lownib = (val << 4) & 0xf0;
      this._write4bits(highnib | mode);
      this._write4bits(lownib | mode);
    };

    // i2c commands
    CLEARDISPLAY = 0x01;
    RETURNHOME = 0x02;
    ENTRYMODESET = 0x04;
    DISPLAYCONTROL = 0x08;
    CURSORSHIFT = 0x10;
    FUNCTIONSET = 0x20;
    SETCGRAMADDR = 0x40;
    SETDDRAMADDR = 0x80;

    // flags for display entry mode
    ENTRYRIGHT = 0x00;
    ENTRYLEFT = 0x02;
    ENTRYSHIFTINCREMENT = 0x01;
    ENTRYSHIFTDECREMENT = 0x00;

    // flags for display on/off control
    DISPLAYON = 0x04;
    DISPLAYOFF = 0x00;
    CURSORON = 0x02;
    CURSOROFF = 0x00;
    BLINKON = 0x01;
    BLINKOFF = 0x00;

    // flags for display/cursor shift
    DISPLAYMOVE = 0x08;
    CURSORMOVE = 0x00;
    MOVERIGHT = 0x04;
    MOVELEFT = 0x00;

    // flags for function set
    EIGHTBITMODE = 0x10;
    FOURBITMODE = 0x00;
    TWOLINE = 0x08;
    ONELINE = 0x00;
    FIVExTENDOTS = 0x04;
    FIVExEIGHTDOTS = 0x00;

    // flags for backlight control
    BACKLIGHT = 0x08;
    NOBACKLIGHT = 0x00;

    En = 0x04; // Enable bit
    Rw = 0x02; // Read/Write bit
    Rs = 0x01; // Register select bit

    return LCD;

  })(Cylon.Driver);
});
