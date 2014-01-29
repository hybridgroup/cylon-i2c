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
      }

      LCD.prototype.commands = function() {
        return ['clear', 'home', 'setCursor', 'displayOff', 'displayOn', 'cursorOff', 'cursorOn', 'blinkOff', 'blinkOn', 'backlightOff', 'backlightOn', 'print'];
      };

      LCD.prototype.start = function(callback) {
        sleep(50);
        this.expanderWrite(this.backlighting);
        sleep(1000);
        this.displayfunction = FOURBITMODE | TWOLINE | FIVExEIGHTDOTS;
        this.write4bits(0x03 << 4);
        sleep(4);
        this.write4bits(0x03 << 4);
        sleep(4);
        this.write4bits(0x03 << 4);
        this.write4bits(0x02 << 4);
        this.sendCommand(FUNCTIONSET | this.displayfunction);
        this.displaycontrol = DISPLAYON | CURSOROFF | BLINKOFF;
        this.displayOn();
        this.clear();
        this.displaymode = ENTRYLEFT | ENTRYSHIFTDECREMENT;
        this.sendCommand(ENTRYMODESET | this.displaymode);
        this.home();
        return LCD.__super__.start.apply(this, arguments);
      };

      LCD.prototype.commandBytes = function(s) {
        return new Buffer(s, 'ascii');
      };

      LCD.prototype.clear = function() {
        this.sendCommand(CLEARDISPLAY);
        return sleep(2);
      };

      LCD.prototype.home = function() {
        this.sendCommand(RETURNHOME);
        return sleep(2);
      };

      LCD.prototype.setCursor = function(col, row) {
        var row_offsets;
        row_offsets = [0x00, 0x40, 0x14, 0x54];
        if (row > numlines) {
          row = numlines - 1;
        }
        return this.sendCommand(SETDDRAMADDR | (col + row_offsets[row]));
      };

      LCD.prototype.displayOff = function() {
        this.displaycontrol &= ~DISPLAYON;
        return this.sendCommand(DISPLAYCONTROL | this.displaycontrol);
      };

      LCD.prototype.displayOn = function() {
        this.displaycontrol |= DISPLAYON;
        return this.sendCommand(DISPLAYCONTROL | this.displaycontrol);
      };

      LCD.prototype.cursorOff = function() {
        this.displaycontrol &= ~CURSORON;
        return this.sendCommand(DISPLAYCONTROL | this.displaycontrol);
      };

      LCD.prototype.cursorOn = function() {
        this.displaycontrol |= CURSORON;
        return this.sendCommand(DISPLAYCONTROL | this.displaycontrol);
      };

      LCD.prototype.blinkOff = function() {
        this.displaycontrol &= ~BLINKON;
        return this.sendCommand(DISPLAYCONTROL | this.displaycontrol);
      };

      LCD.prototype.blinkOn = function() {
        this.displaycontrol |= BLIKON;
        return this.sendCommand(DISPLAYCONTROL | this.displaycontrol);
      };

      LCD.prototype.backlightOff = function() {
        this.backlightVal = NOBACKLIGHT;
        return this.expanderWrite(0);
      };

      LCD.prototype.backlightOn = function() {
        this.backlightVal = BACKLIGHT;
        return this.expanderWrite(0);
      };

      LCD.prototype.backlighting = function() {
        return this.backlightVal != null ? this.backlightVal : this.backlightVal = NOBACKLIGHT;
      };

      LCD.prototype.write4bits = function(val) {
        this.expanderWrite(val);
        return this.pulseEnable(val);
      };

      LCD.prototype.expanderWrite = function(data) {
        return this.connection.i2cWrite(this.address, data | this.backlighting());
      };

      LCD.prototype.pulseEnable = function(data) {
        this.expanderWrite(data | En);
        return this.expanderWrite(data & ~En);
      };

      LCD.prototype.sendCommand = function(value) {
        return this.sendData(value, 0);
      };

      LCD.prototype.writeData = function(value) {
        return this.sendData(value, Rs);
      };

      LCD.prototype.sendData = function(val, mode) {
        var highnib, lownib;
        highnib = val & 0xf0;
        lownib = (val << 4) & 0xf0;
        this.write4bits(highnib | mode);
        return this.write4bits(lownib | mode);
      };

      LCD.prototype.print = function(str) {
        var char, index, _i, _len, _ref, _results;
        _ref = str.split('');
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          char = _ref[index];
          console.log(char);
          _results.push(this.writeData(char.charCodeAt(0)));
        }
        return _results;
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

      En = 0x01 << 2;

      Rw = 0x01 << 1;

      Rs = 0x01;

      return LCD;

    })(Cylon.Driver);
  });

}).call(this);
