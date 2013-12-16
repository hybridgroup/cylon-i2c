'use strict';

blinkm = source("blinkm")

describe "Cylon.Drivers.I2C.BlinkM", ->
  button = new Cylon.Drivers.I2C.BlinkM(name: 'blinkm', device: {connection: 'connect', pin: 13})

  it "needs tests"
