var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/tty.usbmodem1421' },

  device: { name: 'gyro', driver: 'lsm9ds0g' }
})

.on('ready', function(robot) {
  setInterval(function() {
    robot.gyro.getGyro(function(err, data) {
      console.log(data);
    });
  }, 1000);
})

.start();
