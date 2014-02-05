###
 * cylon-gpio
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

require 'cylon'
require './blinkm'
require './hmc6352'
require './mpl115a2'
require './lcd'

module.exports =
  driver: (opts) ->
    switch opts.name
      when 'blinkm' then new Cylon.Drivers.I2C.BlinkM(opts)
      when 'hmc6352' then new Cylon.Drivers.I2C.Hmc6352(opts)
      when 'mpl115a2' then new Cylon.Drivers.I2C.Mpl115A2(opts)
      when 'lcd' then new Cylon.Drivers.I2C.LCD opts
      else null

  register: (robot) ->
    Logger.debug "Registering i2c BlinkM driver for #{robot.name}"
    robot.registerDriver 'cylon-i2c', 'blinkm'
    Logger.debug "Registering i2c HMC6352 driver for #{robot.name}"
    robot.registerDriver 'cylon-i2c', 'hmc6352'
    Logger.debug "Registering i2c MPL115A2 driver for #{robot.name}"
    robot.registerDriver 'cylon-i2c', 'mpl115a2'
    Logger.debug "Registering i2c LCD driver for #{robot.name}"
    robot.registerDriver 'cylon-i2c', 'lcd'
