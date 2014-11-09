var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/tty.usbmodem1421' },
  device: { name: 'mpu6050', driver: 'mpu6050' },
})

.on('ready', function(robot) {
  setInterval(function() {
    robot.mpu6050.getMotionAndTemp(function(err, data) {
      console.log(err, data);
    });
  }, 1000);
})

.start();
