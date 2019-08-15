'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"release"',
  BASE_API: '"http://api.rls.kp/core/v0"',
  LESSON_API: '"http://api.rls.kp/lesson/v0"',
  KEEPWORK_PREFIX : '"http://rls.kp"',
})
