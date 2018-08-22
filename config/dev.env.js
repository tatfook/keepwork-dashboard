'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://stage.keepwork.com/api/wiki/models"',
  LESSON_API: '"https://api-stage.keepwork.com/lesson/v0"',
})
