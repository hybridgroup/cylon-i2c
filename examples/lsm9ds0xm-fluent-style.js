var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/tty.usbmodem1421' },

  device: { name: 'accel', driver: 'lsm9ds0xm' },
})

.on('ready', function(robot) {
  setInterval(function() {
    robot.accel.getAccel(function(err, data) {
      console.log(data);
    });
  }, 1000);
})

.start();
