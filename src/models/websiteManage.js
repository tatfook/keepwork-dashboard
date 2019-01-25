import { resourceCRUD } from '../api/keepwork'
const websitesCRUD = resourceCRUD('sites')
const groupsCRUD = resourceCRUD('groups')
const sitegroupsCRUD = resourceCRUD('siteGroups')
const membersCRUD = resourceCRUD('members')
const usersCRUD = resourceCRUD('users')
import _ from 'lodash'

export default function websiteManageModel() {
  return {
    async list(params) {
      const websitesList = await websitesCRUD.list(params)

      websitesList.rows.map(item => {
        const base = process.env.KEEPWORK_PREFIX
        item.siteUrl = base + item.username + '/' + item.sitename
      })

      return websitesList
    },
    async checkAuthority(params) {
      const sitegroup = await sitegroupsCRUD.list({ 'siteId-eq': params }, 'search')

      const groupIds = _.map(sitegroup.rows, 'groupId')
      const groups = await groupsCRUD.list({ 'id-in': groupIds }, 'search')

      const groupMap = new Map()
      for (const item of groups.rows) {
        groupMap.set(item.id, item)
      }
      sitegroup.rows.map(item => {
        const groupInfo = groupMap.get(item.groupId)
        if (groupInfo) {
          item.groupName = groupInfo.groupname
        }
      })

      const membersList = await membersCRUD.list({ where: { 'objectType': 3, 'objectId': groupIds }}, 'query')

      const memberIds = _.map(membersList.rows, 'memberId')
      const users = await usersCRUD.list({ 'id-in': memberIds }, 'search')
      const userMap = new Map()
      for (const item of users.rows) {
        userMap.set(item.id, item)
      }
      membersList.rows.map(item => {
        const userInfo = userMap.get(item.memberId)
        if (userInfo) {
          item.userName = userInfo.username
        }
      })

      sitegroup.rows.map(item => {
        const listArr = []
        for (const each of membersList.rows) {
          if (each.objectId === item.groupId) {
            listArr.push(each.userName)
          }
        }
        item.userName = listArr
        switch (item.level) {
          case 128:
            item.level = '拒绝'
            break
          case 32:
            item.level = '浏览'
            break
          case 64:
            item.level = '编辑'
            break
          default:
            break
        }
      })

      return sitegroup
    },
    async create(params) {
      return websitesCRUD.create(params)
    },
    async update(params) {
      return websitesCRUD.update(params)
    },
    async destroy(params) {
      return websitesCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
