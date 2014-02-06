# Commands

## goToRGB

Sets the color of the BlinkM RGB LED to the specified combination of RGB color provided. 
(red, green and blue values should be between `0` and `255`)

##### Returns 

`(r, g, b, cb)`

## fadeToRGB

Fades the color of the BlinkM RGB LED to the specified combination of RGB color provided. 
(red, green and blue values should be between `0` and `255`)

##### Returns 

`(r, g, b, cb)`

## fadeToHSB

Fades the color of the BlinkM RGB LED to the specified combination of HSB provided.

##### Returns 

`(h, s, b, cb)`

## fadeToRandomRGB

Fades the color of the BlinkM RGB LED to a random combination of RGB color. 
(red, green and blue values should be between `0` and `255`)

##### Returns 

`(r, g, b, cb)`

## fadeToRandomHSB

Fades the color of the BlinkM RGB LED to a random combination of HSB .

##### Returns 

`(h, s, b, cb)`

## playLightScript

Plays a light script for the BlinkM RGB LED.

##### Returns 

`(id, repeats, startAtLine, cb)`

## stopScript

Stops an specific script for the BlinkM RGB LED.

##### Returns 

`cb`

## setFadeSpeed

Sets a time adjust for the BlinkM RGB LED.

##### Returns 

`(time, cb)`

## getRGBColor

Returns an array containing the RGB values for the current color
(all integer between `0` and `255`).

##### Returns 

`integer_array` (cb).

## setAddress

Returns an sring describing the I2C addresss being used.

##### Returns 

`(address, cb)`

## getFirmware

Returns an sring describing the I2C firmware version being used.

##### Returns 

`integer_value`