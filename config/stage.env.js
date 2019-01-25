'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"stage"',
  BASE_API: '"https://api-stage.keepwork.com/core/v0"',
  LESSON_API: '"https://api-stage.keepwork.com/lesson/v0"',
  KEEPWORK_PREFIX : '"https://stage.keepwork.com/"',
})
