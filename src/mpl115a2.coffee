###
 * MPL115A2 I2C Barometric Pressure + Temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-14 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require './cylon-i2c'

namespace = require 'node-namespace'

namespace "Cylon.Drivers.I2C", ->
  class @Mpl115A2 extends Cylon.Driver
    constructor: (opts) ->
      super
      @address = 0x60

    commands: ->
      ['getPressure', 'getTemperature']

    start: (callback) ->
      @readCoefficients(callback)

    getPressure: (callback = null) ->
      @getPT(callback)

    getTemperature: (callback = null) ->
      @getPT(callback)

    readCoefficients: (callback) ->
      @connection.i2cRead @address, MPL115A2_REGISTER_A0_COEFF_MSB, 8, (data) =>
        a0coeff = (data[0] << 8) | data[1]
        b1coeff = (data[2] << 8) | data[3]
        b2coeff = (data[4] << 8) | data[5]
        c12coeff = ((data[6] << 8) | data[7]) >> 2;

        @a0 = a0coeff / 8
        @b1 = b1coeff / 8192
        @b2 = b2coeff / 16384
        @c12 = c12coeff / 4194304.0
        
        (callback)()
        @device.emit 'start'

    getPT: (callback = null) ->
      @connection.i2cWrite @address, MPL115A2_REGISTER_STARTCONVERSION
      @connection.i2cWrite @address, 0x00
      sleep 5

      @connection.i2cRead @address, MPL115A2_REGISTER_PRESSURE_MSB, 4, (data) =>
        pressure = ((data[0] << 8) | data[1]) >> 6
        temp = ((data[2] << 8) | data[3]) >> 6
        pressureComp = @a0 + (@b1 + @c12 * temp ) * pressure + @b2 * temp
        @pressure = ((65.0 / 1023.0) * pressureComp) + 50.0 # kPa
        @temperature = ((temp - 498.0) / -5.35) + 25.0      # C

        (callback)({'pressure': @pressure, 'temperature': @temperature})

    MPL115A2_REGISTER_PRESSURE_MSB = 0x00
    MPL115A2_REGISTER_PRESSURE_LSB = 0x01
    MPL115A2_REGISTER_TEMP_MSB = 0x02
    MPL115A2_REGISTER_TEMP_LSB = 0x03
    MPL115A2_REGISTER_A0_COEFF_MSB = 0x04
    MPL115A2_REGISTER_A0_COEFF_LSB = 0x05
    MPL115A2_REGISTER_B1_COEFF_MSB = 0x06
    MPL115A2_REGISTER_B1_COEFF_LSB = 0x07
    MPL115A2_REGISTER_B2_COEFF_MSB = 0x08
    MPL115A2_REGISTER_B2_COEFF_LSB = 0x09
    MPL115A2_REGISTER_C12_COEFF_MSB = 0x0A
    MPL115A2_REGISTER_C12_COEFF_LSB = 0x0B
    MPL115A2_REGISTER_STARTCONVERSION = 0x12
