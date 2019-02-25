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
    const _worksArr = _.map(_works, (i, index) => ({ ...i, serial: index + 1 }))
    return {
      count: works.count,
      rows: _worksArr
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
