import _ from 'lodash'
import createService from '@/utils/request'

const request = createService(process.env.LESSON_API)

// teacher cdkeys
// FIXME missing query
export function getTeacherCDKeys(query) {
  return request({
    method: 'get',
    url: '/admins/teacherCDKeys',
    params: query
  })
}

export function generateTeacherCDKeys(count) {
  return request({
    method: 'post',
    url: '/admins/teacherCDKeys/generate',
    params: {
      count
    }
  })
}

export function resourceCRUD(resource) {
  const base = '/admins/' + resource
  return {
    list(data, method = 'query') {
      let url = base

      if (method === 'query') {
        url = url + '/' + method + `?t=${Date.now()}`
      } else if (method === 'search') {
        url = url + '/' + method
      }

      return request({
        method: 'post',
        url,
        data
      })
    },
    create(data) {
      return request({
        method: 'post',
        url: base,
        data
      })
    },
    update(data) {
      const params = {}
      _.forEach(data, (value, key) => {
        _.set(params, key, value)
      })
      return request({
        method: 'put',
        url: base + '/' + data.id,
        data: params
      })
    },
    destroy(data) {
      return request({
        method: 'delete',
        url: base + '/' + data.id,
        data
      })
    },
    get(id) {
      return request({
        method: 'get',
        url: base + '/' + id
      })
    }
  }
}
