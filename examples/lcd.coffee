Cylon = require('cylon')

Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  device:
    name: 'lcd', driver: 'lcd'

  work: (my) ->
    my.lcd.on 'start', ->
      my.lcd.print "Hello!"

.start()
