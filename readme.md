# human-duration [![Build Status](https://travis-ci.org/WatchBeam/human-duration.svg?branch=master)](https://travis-ci.org/WatchBeam/human-duration)

human-duration formats a duration as a human-readable duration, like `2d 6h`. There are other utilities similar to this, but this one aims to be compact (standing at 600 bytes), entirely configurable, and usable with internationalization.

### Installation

```
npm install --save human-duration
```

### Usage

See the test cases for quick usage examples.

```js
const duration = require('human-duration')

duration.fmt(second * 1.2) // => '1s'
duration.fmt(second * 90) // => '1m 30s'
duration.fmt(minute * 70 + second * 13) // => '1h 10m 13s'
duration.fmt(hour * 30 + minute * 70 + second * 13) // => '1d 7h 10m 13s'

duration.fmt(hour * 30).segments(2) // => '1d 7h'
duration.fmt(hour * 30).separator(':') // => '1d:7h:0m:0s'
duration.fmt(hour * 30).grading([duration.minutes, duration.hour]) // => '0m 30h'
duration.fmt(1040)
  .grading([
    { unit: '% seconds' },
    { unit: x => x === 1 ? 'a jiffy' : `${x} jiffies}`, milliseconds: 5 }
  ])
  .separator(' and ') // => '1s and 8 jiffies'
```
