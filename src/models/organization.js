import createService from '@/utils/request'
import { resourceCRUD } from '@/api/keepwork'
const lessonOrganizations = resourceCRUD('lessonOrganizations')
const request = createService()
import _ from 'lodash'

const getMemberCount = async id => {
  const res = await request({
    method: 'post',
    url: 'graphql',
    data: {
      query:
				'query($id: Int, $name: String) {organization(id: $id, name: $name) {id, studentCount, teacherCount, count }}',
      variables: {
        id: id
      }
    }
  })
  return res
}

export default {
  async list(params) {
    const res = await lessonOrganizations.list(params)
    const now = Date.now()
    const memberRequests = _.map(_.map(res.rows, item => item.id), getMemberCount)
    const memberCountList = await Promise.all(memberRequests)
    const orgMemberCount = _.reduce(
      memberCountList,
      (obj, cur) => {
        const org = _.get(cur, 'data.organization', {})
        const orgId = _.get(org, 'id')
        obj[orgId] = org
        return obj
      },
      {}
    )
    res.rows = res.rows.map(item => {
      const usernames = item.lessonOrganizationClassMembers.map(u => _.get(u, 'users.username', ''))
      const { startDate, endDate } = item
      const startTimestamp = +new Date(startDate)
      const endTimestamp = +new Date(endDate)
      const status = now >= startTimestamp && now <= endTimestamp ? '开启' : '结束'
      const memberCount = _.get(orgMemberCount, item.id, {})
      return {
        ...item,
        location: item.location.split(','),
        status,
        usernames: _.isArray(usernames) ? usernames.join(',') : usernames,
        studentCount: _.get(memberCount, 'studentCount', 0),
        teacherCount: _.get(memberCount, 'teacherCount', 0)
      }
    })
    return res
  },
  async create(data) {
    data['usernames'] = [...data['usernames'].split(',')]
    data['packages'] = data['lessonOrganizationPackages']
    data['privilege'] = 3
    data['location'] = data['location'].join(',')
    return request({
      method: 'post',
      url: 'lessonOrganizations',
      data: data
    })
  },
  async update(data) {
    data['usernames'] = [...data['usernames'].split(',')]
    data['packages'] = data['lessonOrganizationPackages']
    data['location'] = data['location'].join(',')
    return request({
      method: 'PUT',
      url: `lessonOrganizations/${data.id}`,
      data: data
    })
  }
}
