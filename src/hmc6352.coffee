###
 * HMC6352 Digital Compass driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require './cylon-i2c'

namespace = require 'node-namespace'

namespace "Cylon.Drivers.I2C", ->
  class @Hmc6352 extends Cylon.Driver
    constructor: (opts) ->
      super
      @address = 0x42

    commands: ->
      ['heading']

    # Public: Starts the driver.
    #
    # Returns null.
    start: (callback) ->
      @connection.i2cConfig(50)

      super

    # Public: Returns the heading data for the compass
    #
    # callback - params
    #
    # Returns null.
    heading: (callback) ->
      @connection.i2cRead @address, @commandBytes('A'), 2, (data) =>
        (callback)(parseHeading(data))

    # Public: commandBytes
    #
    # s - params
    #
    # Returns null.
    commandBytes: (s) ->
      new Buffer(s, 'ascii')

    # Public: parseHeading
    #
    # val - params
    #
    # Returns null.
    parseHeading: (val) ->
      (val[1] + val[0] * 256) / 10.0
