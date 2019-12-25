import createService from '@/utils/request'
import { resourceCRUD } from '@/api/lesson'
const lessonOrganizations = resourceCRUD('lessonOrganization')
const _request = createService(process.env.LESSON_API)
import _ from 'lodash'

export default {
  async list(params) {
    const res = await lessonOrganizations.list(params)
    const now = Date.now()
    res.rows = res.rows.map(item => {
      const memberObj = _.reduce(item.lessonOrganizationClassMembers, (temp, cur) => {
        if (cur.roleId & 64) {
          temp['admin'].push(_.get(cur, 'users.username', ''))
        }
        if (cur.roleId & 2) {
          temp['teacherList'].push(cur)
        }
        return temp
      }, { admin: [], teacherList: [] })

      const activateCodeUsed = _.reduce(item.lessonOrganizationActivateCode, (temp, cur) => {
        if (cur.type === null) {
          temp['old'] = temp['old'] + 1
        } else {
          temp[cur.type] = (temp[cur.type] || 0) + 1
        }
        return temp
      }, { 'old': 0 })
      const { startDate, endDate } = item
      const startTimestamp = +new Date(startDate)
      const endTimestamp = +new Date(endDate)
      const status = now >= startTimestamp && now <= endTimestamp ? '开启' : '结束'
      const teacherCount = _.uniqBy(memberObj.teacherList, item => item.memberId).length
      return {
        ...item,
        status,
        usernames: memberObj.admin.filter(v => v).join(','),
        teacherCount,
        activateCodeUsed
      }
    })
    return res
  },
  async create(data) {
    data['usernames'] = [...data['usernames'].split(',')]
    data['packages'] = data['lessonOrganizationPackages']
    data['privilege'] = 3
    return _request({
      method: 'post',
      url: 'lessonOrganizations',
      data: data
    })
  },
  async update(data) {
    data['usernames'] = [...data['usernames'].split(',')]
    data['packages'] = data['lessonOrganizationPackages']
    return _request({
      method: 'PUT',
      url: `lessonOrganizations/${data.id}`,
      data: data
    })
  }
}
