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
require './i2c-device'

module.exports =
  driver: (opts) ->
    if opts.name is 'blinkm'
      new Cylon.Drivers.I2C.BlinkM(opts)
    else if opts.name is 'hmc6352'
      new Cylon.Drivers.I2C.Hmc6352(opts)
    else
      null

  register: (robot) ->
    Logger.debug "Registering i2c BlinkM driver for #{robot.name}"
    robot.registerDriver 'cylon-i2c', 'blinkm'
    Logger.debug "Registering i2c HMC6352 driver for #{robot.name}"
    robot.registerDriver 'cylon-i2c', 'hmc6352'
