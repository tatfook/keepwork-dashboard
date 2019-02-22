import createService from '@/utils/request'
import _ from 'lodash'

const request = createService()

export default {
  list() {
    return request({
      method: 'get',
      url: 'games/members'
    })
  },
  update(data) {
    const params = {}
    _.forEach(data, (value, key) => {
      _.set(params, key, value)
    })
    return request({
      method: 'put',
      url: '/admins/userinfos/' + data.userinfosId,
      data: params
    })
  }
}
