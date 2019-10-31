'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://api-dev.kp-para.cn/core/v0"',
  LESSON_API: '"http://api-dev.kp-para.cn/lessonapi/v0"',
  KEEPWORK_PREFIX : '"http://dev.kp-para.cn/"',
})
