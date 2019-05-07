'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://api-release.keepwork.com/core/v0"',
  LESSON_API: '"https://api-release.keepwork.com/lesson/v0"',
  KEEPWORK_PREFIX : '"https://release.keepwork.com/"',
})
