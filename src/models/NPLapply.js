import createService from '@/utils/request'
import _ from 'lodash'

const request = createService()

export default {
  async list() {
    const works = await request({
      method: 'get',
      url: 'games/members'
    })
    // _.forEach(works.rows, i => i.id === i.userinfosId)
    const _works = _.map(works.rows, i => ({ ...i, id: i.userinfosId }))
    return {
      count: works.count,
      rows: _works
    }
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
