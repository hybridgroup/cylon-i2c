'use strict';

var Mpu6050 = source('mpu6050');

describe('Cylon.Drivers.I2C.Mpu6050', function() {
  var driver = new Mpu6050({
    name: 'Mpu6050',
    device: {
      connection: {},
      pin: 13,
      emit: spy()
    }
  });
})
