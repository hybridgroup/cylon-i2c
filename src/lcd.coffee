###
 * LCD display driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require './cylon-i2c'

namespace = require 'node-namespace'

namespace "Cylon.Drivers.I2C", ->
  class @LCD extends Cylon.Driver
    constructor: (opts) ->
      super
      @address = 0x27
      @_backlightVal = NOBACKLIGHT
      @_displayfunction = FOURBITMODE | TWOLINE | FIVExEIGHTDOTS
      @_displaycontrol = (DISPLAYON | CURSOROFF | BLINKOFF)
      @_displaymode = (ENTRYLEFT | ENTRYSHIFTDECREMENT)

    commands: ->
      ['clear', 'home', 'setCursor', 'displayOff', 'displayOn', 'cursorOff', 'cursorOn',
       'blinkOff', 'blinkOn', 'backlightOff', 'backlightOn', 'print']

    start: (callback) ->
      sleep(50)

      @_expanderWrite(@_backlightVal)
      sleep(1000)

      @_write4bits(0x03 << 4)
      sleep(4)

      @_write4bits(0x03 << 4)
      sleep(4)

      @_write4bits(0x03 << 4)

      @_write4bits(0x02 << 4)

      @_sendCommand(FUNCTIONSET | @_displayfunction)

      @displayOn()
        
      @clear()
        
      # Initialize to default text direction (for roman languages) & set the entry mode
      @_sendCommand(ENTRYMODESET | @_displaymode)
        
      @home()

      super

    # clear display
    clear: () ->
      @_sendCommand(CLEARDISPLAY)
      sleep(2)

    # move display cursor to home
    home: () ->
      @_sendCommand(RETURNHOME)
      sleep(2)

    # move display cursor to col, row
    setCursor: (col, row) ->
      row_offsets = [0x00, 0x40, 0x14, 0x54]
      @_sendCommand(SETDDRAMADDR | (col + row_offsets[row]))

    displayOff: ->
      @_displaycontrol &= ~DISPLAYON;
      @_sendCommand(DISPLAYCONTROL | @_displaycontrol)

    displayOn: ->
      @_displaycontrol |= DISPLAYON;
      @_sendCommand(DISPLAYCONTROL | @_displaycontrol)

    cursorOff: ->
      @_displaycontrol &= ~CURSORON;
      @_sendCommand(DISPLAYCONTROL | @_displaycontrol)

    cursorOn: ->
      @_displaycontrol |= CURSORON;
      @_sendCommand(DISPLAYCONTROL | @_displaycontrol)

    blinkOff: ->
      @_displaycontrol &= ~BLINKON;
      @_sendCommand(DISPLAYCONTROL | @_displaycontrol)

    blinkOn: ->
      @_displaycontrol |= BLINKON;
      @sendCommand(DISPLAYCONTROL | @_displaycontrol)

    backlightOff: ->
      @_backlightVal = NOBACKLIGHT
      @expanderWrite(0)

    backlightOn: ->
      @_backlightVal = BACKLIGHT
      @_expanderWrite(0)

    print: (str) ->
      for char, index in str.split ''
        @_writeData(char.charCodeAt(0))

    _write4bits: (val) ->
      @_expanderWrite(val)
      @_pulseEnable(val)

    _expanderWrite: (data) ->
      @connection.i2cWrite @address, (data | @_backlightVal)

    _pulseEnable: (data) ->
      @_expanderWrite(data | En)
      @_expanderWrite(data & ~En)

    _sendCommand: (value) ->
      @_sendData(value, 0)

    _writeData: (value) ->
      @_sendData(value, Rs)

    _sendData: (val, mode) ->
      highnib = val & 0xf0
      lownib = (val << 4) & 0xf0
      @_write4bits(highnib | mode)
      @_write4bits(lownib | mode)

    # i2c commands
    CLEARDISPLAY = 0x01
    RETURNHOME = 0x02
    ENTRYMODESET = 0x04
    DISPLAYCONTROL = 0x08
    CURSORSHIFT = 0x10
    FUNCTIONSET = 0x20
    SETCGRAMADDR = 0x40
    SETDDRAMADDR = 0x80

    # flags for display entry mode
    ENTRYRIGHT = 0x00
    ENTRYLEFT = 0x02
    ENTRYSHIFTINCREMENT = 0x01
    ENTRYSHIFTDECREMENT = 0x00

    # flags for display on/off control
    DISPLAYON = 0x04
    DISPLAYOFF = 0x00
    CURSORON = 0x02
    CURSOROFF = 0x00
    BLINKON = 0x01
    BLINKOFF = 0x00

    # flags for display/cursor shift
    DISPLAYMOVE = 0x08
    CURSORMOVE = 0x00
    MOVERIGHT = 0x04
    MOVELEFT = 0x00

    # flags for function set
    EIGHTBITMODE = 0x10
    FOURBITMODE = 0x00
    TWOLINE = 0x08
    ONELINE = 0x00
    FIVExTENDOTS = 0x04
    FIVExEIGHTDOTS = 0x00

    # flags for backlight control
    BACKLIGHT = 0x08
    NOBACKLIGHT = 0x00

    En = 0x04 # Enable bit
    Rw = 0x02 # Read/Write bit
    Rs = 0x01 # Register select bit
