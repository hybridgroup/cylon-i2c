###
 * BlinkM driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require './cylon-i2c'

namespace = require 'node-namespace'

namespace "Cylon.Drivers.I2C", ->
  class @BlinkM extends Cylon.Driver

    TO_RGB            = 0x6e
    FADE_TO_RGB       = 0x63
    FADE_TO_HSB       = 0x68
    FADE_TO_RND_RGB   = 0x43
    FADE_TO_RND_HSB   = 0x48
    PLAY_LIGHT_SCRIPT = 0x70
    STOP_SCRIPT       = 0x6f
    SET_FADE          = 0x66
    SET_TIME          = 0x74
    GET_RGB           = 0x67
    SET_ADDRESS       = 0x41
    GET_ADDRESS       = 0x61
    GET_FIRMWARE      = 0x5a

    constructor: (opts) ->
      super
      @address = 0x09

    commands: ->
      ['goToRGB', 'fadeToRGB', 'fadeToHSB', 'fadeToRandomRGB', 'fadeToRandomHSB',
       'playLightScript', 'stopScript', 'setFadeSpeed', 'setTimeAdjust',
       'getRGBColor', 'setAddress', 'getAddress', 'getFirmware']


    start: (callback) ->
      super

    goToRGB: (r, g, b, cb = null) ->
      @connection.i2cWrite(@address, TO_RGB, [r,g,b], cb)

    fadeToRGB: (r, g, b, cb = null) ->
      @connection.i2cWrite(@address, FADE_TO_RGB, [r,g,b], cb)

    fadeToHSB: (h, s, b, cb = null) ->
      @connection.i2cWrite(@address, FADE_TO_HSB, [h,s,b], cb)

    fadeToRandomRGB: (r, g, b, cb = null) ->
      @connection.i2cWrite(@address, FADE_TO_RND_RGB, [r,g,b], cb)

    fadeToRandomHSB: (h, s, b, cb = null) ->
      @connection.i2cWrite(@address, FADE_TO_RND_HSB, [h,s,b], cb)

    # A repeat value of 0 causes the script to execute until receiving the stopScript command.
    # light script ids available in the blinkM datasheet.
    playLightScript: (id, repeats, startAtLine, cb = null) ->
      @connection.i2cWrite(@address, PLAY_LIGHT_SCRIPT, [id, repeats, startAtLine], cb)

    stopScript: (cb = null) ->
      @connection.i2cWrite(@address, STOP_SCRIPT, [], cb)

    # Speed must be an integer from 1 to 255
    setFadeSpeed: (speed, cb = null) ->
      @connection.i2cWrite(@address, STOP_SCRIPT, [speed], cb)

    # Time must be an integer betweeb -128 and 127, 0 resets the time.
    # This affects the duration of the scripts being played.
    setTimeAdjust: (time, cb = null) ->
      @connection.i2cWrite(@address, STOP_SCRIPT, [time], cb)

    getRGBColor: (cb = null) ->
      @connection.i2cRead(@address, GET_RGB, 3, cb)

    getAddress: (cb = null) ->
      @connection.i2cRead(@address, GET_ADDRESS, 1, cb)

    setAddress: (address, cb = null) ->
      @connection.i2cWrite(@address, SET_ADDRESS, [address, 0xd0, 0x0d, address], cb)
      @address = address

    getFirmware: (cb = null) ->
      @connection.i2cRead(@address, GET_FIRMWARE, 1, cb)
