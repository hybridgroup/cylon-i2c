# Commands

## readTemperature

Gets the value of the temperature in degrees Celsius.  Returns it as an object:

##### Return

`object`
```
{
    temp: 19.9
}
```
## readPressure

Gets the value of the pressure in Pascals.  Since temperature is also calculated to determine pressure, it returns the temperature as well:

##### Return

`object`
```
{
    temp: 19.9,
    press: 101325
}
```
## readAltitude

Calculates the altitude from the pressure and temperature, in meters.  Since temperature and pressure are calculated to determine altitude, it returns all three.

##### Return

`object`
```
{
    temp: 19.9,
    press: 101325,
    alt: 0.54
}
```
## readHumidity

Calculates the Relative Humidity, in %.

##### Return
```
`object`

{
    hum: 51.4
}
```
