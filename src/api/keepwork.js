import _ from 'lodash'
import createService from '@/utils/request'

const request = createService()

export function resourceCRUD(resource) {
  const url = '/admins/' + resource
  return {
    list(data, method = 'query') {
      return request({
        method: 'post',
        url: url + '/' + method,
        data
      })
    },
    create(data) {
      return request({
        method: 'post',
        url,
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
        url: url + '/' + data.id,
        data: params
      })
    },
    destroy(data) {
      return request({
        method: 'delete',
        url: url + '/' + data.id,
        data
      })
    },
    get(id) {
      return request({
        method: 'get',
        url: url + '/' + id
      })
    }
  }
}
