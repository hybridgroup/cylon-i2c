/*
 * LCD display driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('./cylon-i2c');

  namespace = require('node-namespace');

  namespace("Cylon.Drivers.I2C", function() {
    return this.LCD = (function(_super) {
      var BACKLIGHT, BLINKOFF, BLINKON, CLEARDISPLAY, CURSORMOVE, CURSOROFF, CURSORON, CURSORSHIFT, DISPLAYCONTROL, DISPLAYMOVE, DISPLAYOFF, DISPLAYON, EIGHTBITMODE, ENTRYLEFT, ENTRYMODESET, ENTRYRIGHT, ENTRYSHIFTDECREMENT, ENTRYSHIFTINCREMENT, En, FIVExEIGHTDOTS, FIVExTENDOTS, FOURBITMODE, FUNCTIONSET, MOVELEFT, MOVERIGHT, NOBACKLIGHT, ONELINE, RETURNHOME, Rs, Rw, SETCGRAMADDR, SETDDRAMADDR, TWOLINE;

      __extends(LCD, _super);

      function LCD(opts) {
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
        this._sendCommand(ENTRYMODESET | this._displaymode);
        this.home();
        return LCD.__super__.start.apply(this, arguments);
      };

      LCD.prototype.clear = function() {
        this._sendCommand(CLEARDISPLAY);
        return sleep(2);
      };

      LCD.prototype.home = function() {
        this._sendCommand(RETURNHOME);
        return sleep(2);
      };

      LCD.prototype.setCursor = function(col, row) {
        var row_offsets;
        row_offsets = [0x00, 0x40, 0x14, 0x54];
        return this._sendCommand(SETDDRAMADDR | (col + row_offsets[row]));
      };

      LCD.prototype.displayOff = function() {
        this._displaycontrol &= ~DISPLAYON;
        return this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
      };

      LCD.prototype.displayOn = function() {
        this._displaycontrol |= DISPLAYON;
        return this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
      };

      LCD.prototype.cursorOff = function() {
        this._displaycontrol &= ~CURSORON;
        return this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
      };

      LCD.prototype.cursorOn = function() {
        this._displaycontrol |= CURSORON;
        return this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
      };

      LCD.prototype.blinkOff = function() {
        this._displaycontrol &= ~BLINKON;
        return this._sendCommand(DISPLAYCONTROL | this._displaycontrol);
      };

      LCD.prototype.blinkOn = function() {
        this._displaycontrol |= BLINKON;
        return this.sendCommand(DISPLAYCONTROL | this._displaycontrol);
      };

      LCD.prototype.backlightOff = function() {
        this._backlightVal = NOBACKLIGHT;
        return this.expanderWrite(0);
      };

      LCD.prototype.backlightOn = function() {
        this._backlightVal = BACKLIGHT;
        return this._expanderWrite(0);
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
        return this._pulseEnable(val);
      };

      LCD.prototype._expanderWrite = function(data) {
        return this.connection.i2cWrite(this.address, data | this._backlightVal);
      };

      LCD.prototype._pulseEnable = function(data) {
        this._expanderWrite(data | En);
        return this._expanderWrite(data & ~En);
      };

      LCD.prototype._sendCommand = function(value) {
        return this._sendData(value, 0);
      };

      LCD.prototype._writeData = function(value) {
        return this._sendData(value, Rs);
      };

      LCD.prototype._sendData = function(val, mode) {
        var highnib, lownib;
        highnib = val & 0xf0;
        lownib = (val << 4) & 0xf0;
        this._write4bits(highnib | mode);
        return this._write4bits(lownib | mode);
      };

      CLEARDISPLAY = 0x01;

      RETURNHOME = 0x02;

      ENTRYMODESET = 0x04;

      DISPLAYCONTROL = 0x08;

      CURSORSHIFT = 0x10;

      FUNCTIONSET = 0x20;

      SETCGRAMADDR = 0x40;

      SETDDRAMADDR = 0x80;

      ENTRYRIGHT = 0x00;

      ENTRYLEFT = 0x02;

      ENTRYSHIFTINCREMENT = 0x01;

      ENTRYSHIFTDECREMENT = 0x00;

      DISPLAYON = 0x04;

      DISPLAYOFF = 0x00;

      CURSORON = 0x02;

      CURSOROFF = 0x00;

      BLINKON = 0x01;

      BLINKOFF = 0x00;

      DISPLAYMOVE = 0x08;

      CURSORMOVE = 0x00;

      MOVERIGHT = 0x04;

      MOVELEFT = 0x00;

      EIGHTBITMODE = 0x10;

      FOURBITMODE = 0x00;

      TWOLINE = 0x08;

      ONELINE = 0x00;

      FIVExTENDOTS = 0x04;

      FIVExEIGHTDOTS = 0x00;

      BACKLIGHT = 0x08;

      NOBACKLIGHT = 0x00;

      En = 0x04;

      Rw = 0x02;

      Rs = 0x01;

      return LCD;

    })(Cylon.Driver);
  });

}).call(this);
