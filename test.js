'use strict'

/* eslint-env mocha */

const duration = require('./')
const assert = require('assert')

const jiffy = { milliseconds: 5, unit: x => x === 1 ? 'a jiffy' : `${x} jiffies` }
const second = 1000
const minute = second * 60
const hour = minute * 60

describe('human-duration', () => {
  const cases = [
    // Base duration cases:
    [duration.fmt(0), '0s'],
    [duration.fmt(second * 1.2), '1s'],
    [duration.fmt(second * 90), '1m 30s'],
    [duration.fmt(minute * 70 + second * 13), '1h 10m 13s'],
    [duration.fmt(hour * 30 + minute * 70 + second * 13), '1d 7h 10m 13s'],
    [duration.fmt(hour), '1h 0m 0s'],

    // Correctly limits segments:
    [duration.fmt(minute * 60), 0, ''],
    [duration.fmt(minute * 60), 1, '1h'],
    [duration.fmt(minute * 60), 2, '1h 0m'],

    // Swaps around formatting
    [duration.fmt(hour + second * 1.2).grading([duration.millisecond, duration.hour]), '1200ms 1h'],
    [duration.fmt(5).grading([jiffy]), 'a jiffy'],
    [duration.fmt(40).grading([jiffy]), '8 jiffies'],
    [duration.fmt(hour).separator(':'), '1h:0m:0s']
  ]

  cases.forEach(([src, separators, expected], i) => {
    if (expected === undefined) {
      expected = separators
    }

    it(`#${i}: formats duration(${src._duration}).toString(${separators})`, () => {
      assert.equal(src.toString(separators), expected)
    })
  })
})
