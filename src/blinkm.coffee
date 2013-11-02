###
 * BlinkM driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';
namespace = require 'node-namespace'

namespace "Cylon.Driver.I2C", ->
  class @BlinkM
    constructor: (opts) ->
      @self = this
      @device = opts.device
      @connection = @device.connection
      @address = 0x09

    commands: ->
      ['off', 'rgb', 'fade', 'color']

    start: (callback) ->
      Logger.debug "BlinkM started"
      @connection.i2cConfig(50)

      (callback)(null)
      @device.emit 'start'

    off: ->
      @connection.i2cWrite @address, @commandBytes('o')

    rgb: (r, g, b) ->
      @connection.i2cWrite @address, @commandBytes('n')
      @connection.i2cWrite @address, [r, g, b]

    fade: (r, g, b) ->
      @connection.i2cWrite @address, @commandBytes('c')
      @connection.i2cWrite @address, [r, g, b]

    commandBytes: (s) ->
      new Buffer(s, 'ascii')
