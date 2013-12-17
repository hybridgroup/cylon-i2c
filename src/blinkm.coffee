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

    TO_RGB        = 0x6e
    FADE_TO_RGB   = 0x63
    FADE_TO_HSB   = 0x68
    FADE_TO_RND_RGB = 0x63
    FADE_TO_RND_HSB = 0x68
    PLAY_LIGHT_SCRIPT   = 0x70
    STOP_SCRIPT   = 0x6f
    SET_FADE      = 0x66
    SET_TIME      = 0x74
    GET_RGB       = 0x67
    SET_ADDRESS   = 0x41
    GET_ADDRESS   = 0x61
    GET_FIRMWARE  = 0x5a

    constructor: (opts) ->
      super
      @address = 0x09

    commands: ->
      ['goToRGB', 'fadeToRGB', 'fadeToHSB', 'fadeToRandomRGB', 'fadeToRandomSHB',
       'playLightScript', 'stopScript', 'setFadeSpeed', 'setTimeAdjust',
       'getRGBColor', 'setAddress', 'getAddress', 'getFirmware']


    start: (callback) ->
      super

    goToRGB: (r, g, b) ->
      @connection.i2cWrite(@address, TO_RGB, [r,g,b], null)

    fadeToRGB: (r, g, b) ->
      @connection.i2cWrite(@address, FADE_TO_RGB, [r,g,b], null)

    fadeToHSB: (h, s, b) ->
      @connection.i2cWrite(@address, FADE_TO_HSB, [h,s,b], null)

    fadeToRandomRGB: (r, g, b) ->
      @connection.i2cWrite(@address, FADE_TO_RND_RGB, [r,g,b], null)

    fadeToRandomHSB: (h, s, b) ->
      @connection.i2cWrite(@address, FADE_TO_RND_HSB, [h,s,b], null)

    # A repeat value of 0 causes the script to execute until receiving the stopScript command.
    # light script ids available in the blinkM datasheet.
    playLightScript: (id, repeats, startAtLine) ->
      @connection.i2cWrite(@address, PLAY_LIGHT_SCRIPT, [id, repeats, startAtLine], null)

    stopScript: ->
      @connection.i2cWrite(@address, STOP_SCRIPT, [], null)

    # Speed must be an integer from 1 to 255
    setFadeSpeed: (speed) ->
      @connection.i2cWrite(@address, STOP_SCRIPT, [], null)

    # Time must be an integer betweeb -128 and 127, 0 resets the time.
    # This affects the duration of the scripts being played.
    setTimeAdjust: (time) ->
      @connection.i2cWrite(@address, STOP_SCRIPT, [], null)

    getRGBColor: (callback) ->
      @connection.i2cRead(@address, GET_RGB, 3, callback)

    getAddress: (callback) ->
      @connection.i2cRead(@address, GET_ADDRESS, 1, callback)

    setAddress: (address, callback) ->
      @connection.i2cRead(@address, GET_ADDRESS, 1, (err, data) =>
        @address = data[0]
        callback() if typeof(callback is "function")
      )

    getFirmware: (callback) ->
      @connection.i2cRead(@address, GET_FIRMWARE, 2, callback)
