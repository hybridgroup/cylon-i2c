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

    start: (callback) ->
      @connection.i2cConfig(50)

      super

    heading: (callback) ->
      @connection.i2cRead @address, @commandBytes('A'), 2, (data) =>
        (callback)(parseHeading(data))

    commandBytes: (s) ->
      new Buffer(s, 'ascii')

    parseHeading: (val) ->
      (val[1] + val[0] * 256) / 10.0
