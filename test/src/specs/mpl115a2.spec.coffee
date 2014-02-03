'use strict';

blinkm = source("mpl115a2")

describe "Cylon.Drivers.I2C.Mpl115A2", ->
  button = new Cylon.Drivers.I2C.Mpl115A2(name: 'mpl115a2', device: {connection: 'connect', pin: 13})

  it "needs tests"
