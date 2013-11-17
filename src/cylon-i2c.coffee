###
 * cylon-gpio
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require('./blinkm')

module.exports =
  driver: (opts) ->
    if opts.name is 'blinkm'
      new Cylon.Driver.I2C.BlinkM(opts)
    else
      null

  register: (robot) ->
    Logger.debug "Registering i2c BlinkM driver for #{robot.name}"
    robot.registerDriver 'cylon-i2c', 'blinkm'
