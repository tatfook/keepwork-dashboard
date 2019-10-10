'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://api-rls.kp-para.cn/core/v0"',
  LESSON_API: '"http://api-rls.kp-para.cn/lesson/v0"',
  KEEPWORK_PREFIX : '"http://rls.kp-para.cn"',
})
