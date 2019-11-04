import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

export default function createService(baseUrl, timeout) {
  const service = axios.create({
    baseURL: baseUrl || process.env.BASE_API,
    timeout: timeout || 10000
  })

  service.interceptors.request.use(
    config => {
      if (store.getters.token) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
      return config
    },
    error => {
      // Do something with request error
      console.log(error) // for debug
      Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    response => {
      // 为了兼容旧的不规范的api
      // lesson 的api会多个data
      const res = response.data.data || response.data
      if (response.status >= 400) {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 2000
        })
        return Promise.reject('error')
      } else {
        return res
      }
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  )

  return service
}
