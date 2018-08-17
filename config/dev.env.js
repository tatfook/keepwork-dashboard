'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  LESSON_API: '"http://easymock-node.keepwork.com/mock/5b596b61c0a3ad0022b14b12"',
})
