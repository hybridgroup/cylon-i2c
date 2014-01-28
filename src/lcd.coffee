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

    commands: ->
      ['clear', 'home', 'setCursor', 'displayOff', 'displayOn', 'cursorOff', 'cursorOn',
       'blinkOff', 'blinkOn', 'backlightOff', 'backlightOn', 'print']

    start: (callback) ->
      @displayfunction = FOURBITMODE | ONELINE | FIVExEIGHTDOTS
      @connection.i2cConfig(50)

      write4bits(0x03 << 4)
      sleep(4)
      write4bits(0x03 << 4)
      sleep(4)
      write4bits(0x03 << 4)

      sendCommand(FUNCTIONSET | @displayfunction)

      @displaycontrol = DISPLAYON | CURSOROFF | BLINKOFF
      display()
        
      clear()
        
      # Initialize to default text direction (for roman languages) & set the entry mode
      @displaymode = ENTRYLEFT | ENTRYSHIFTDECREMENT
      sendCommand(ENTRYMODESET | @displaymode)
        
      home()

      super

    commandBytes: (s) ->
      new Buffer(s, 'ascii')

    # clear display
    clear: () ->
      sendCommand(CLEARDISPLAY)
      sleep(2000)

    # move display cursor to home
    home: () ->
      sendCommand(RETURNHOME)
      sleep(2000)

    # move display cursor to col, row
    setCursor: (col, row) ->
      row_offsets = [0x00, 0x40, 0x14, 0x54]
      if row > numlines
        row = numlines - 1

      sendCommand(SETDDRAMADDR | (col + row_offsets[row]))

    displayOff: ->
      @displaycontrol &= ~DISPLAYON;
      sendCommand(DISPLAYCONTROL | @displaycontrol)

    displayOn: ->
      @displaycontrol |= DISPLAYON;
      sendCommand(DISPLAYCONTROL | @displaycontrol)

    cursorOff: ->
      @displaycontrol &= ~CURSORON;
      sendCommand(DISPLAYCONTROL | @displaycontrol)

    cursorOn: ->
      @displaycontrol |= CURSORON;
      sendCommand(DISPLAYCONTROL | @displaycontrol)

    blinkOff: ->
      @displaycontrol &= ~BLINKON;
      sendCommand(DISPLAYCONTROL | @displaycontrol)

    blinkOn: ->
      @displaycontrol |= BLIKON;
      sendCommand(DISPLAYCONTROL | @displaycontrol)

    backlightOff: ->
      @backlightVal = NOBACKLIGHT
      expanderWrite(0)

    backlightOn: ->
      @backlightVal = BACKLIGHT
      expanderWrite(0)

    backlighting: ->
      @backlightVal ?= NOBACKLIGHT

    write4bits: (val) ->
      expanderWrite(val)
      pulseEnable(val)

    expanderWrite: (data) ->
      @connection.i2cWrite @address, (data | backlighting())

    pulseEnable: (data) ->
      expanderWrite(data | En)
      sleep(1)
        
      expanderWrite(data & ~En)
      sleep(50)

    sendCommand: (value) ->
      sendData(value, 0)

    writeData: (value) ->
      sendData(value, Rs)

    sendData: (val, mode) ->
      highnib = val & 0xf0
      lownib = (val << 4) & 0xf0
      write4bits(highnib | mode)
      write4bits(lownib | mode)

    print: (str) ->
      for char, index in str.split ''
        writeData(char)

    # commands
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
    FIVExTENDOTS = 0x00

    # flags for backlight control
    BACKLIGHT = 0x08
    NOBACKLIGHT = 0x00

    En = 0x01 << 2  # Enable bit
    Rw = 0x01 << 1  # Read/Write bit
    Rs = 0x01       # Register select bit
