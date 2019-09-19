'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://api.dev.kp/core/v0"',
  LESSON_API: '"http://api.dev.kp/lesson/v0"',
  KEEPWORK_PREFIX : '"http://dev.kp.com/"',
})
