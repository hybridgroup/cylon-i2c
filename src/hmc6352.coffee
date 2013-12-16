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
  class @Hmc6352 extends Cylon.Drivers.Driver
    constructor: (opts) ->
      super
      @connection = @device.connection
      @address = 0x42

    commands: ->
      ['heading']

    start: (callback) ->
      Logger.debug "Hmc6352 started"
      @connection.i2cConfig(50)

      super

    heading: (callback) ->
      @connection.i2cWrite @address, @commandBytes('A')
      @connection.i2cRead @address, 2, (data) =>
        (callback)(parseHeading(data))

    commandBytes: (s) ->
      new Buffer(s, 'ascii')

    parseHeading: (val) ->
      (val[1] + val[0] * 256) / 10.0
