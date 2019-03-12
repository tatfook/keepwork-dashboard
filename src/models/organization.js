import createService from '@/utils/request'
import { resourceCRUD } from '@/api/keepwork'
const lessonOrganizations = resourceCRUD('lessonOrganizations')
const request = createService()
import _ from 'lodash'

export default {
  async list(params) {
    const res = await lessonOrganizations.list(params)
    const now = Date.now()
    res.rows = res.rows.map((item) => {
      const usernames = item.lessonOrganizationClassMembers.map((u) => _.get(u, 'users.username', ''))
      const { startDate, endDate } = item
      const startTimestamp = +new Date(startDate)
      const endTimestamp = +new Date(endDate)
      const status = now >= startTimestamp && now <= endTimestamp ? '开启' : '结束'
      return {
        ...item,
        status,
        usernames: _.isArray(usernames) ? usernames.join(',') : usernames
      }
    })
    return res
  },
  async create(data) {
    data['usernames'] = [...data['usernames'].split(',')]
    return request({
      method: 'post',
      url: 'lessonOrganizations',
      data: data
    })
  },
  async update(data) {
    data['privilege'] = 3
    data['usernames'] = [...data['usernames'].split(',')]
    return request({
      method: 'PUT',
      url: `lessonOrganizations/${data.id}`,
      data: data
    })
  }
}
