import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'

const issuesManageCRUD = resourceCRUD('issues')
const projectCRUD = resourceCRUD('projects')
const usersCRUD = resourceCRUD('users')

export default function issuesManageModel() {
  return {
    async list(params) {
      const issuesManageList = await issuesManageCRUD.list(params)

      if (!issuesManageList || !issuesManageList.count || !issuesManageList.rows) {
        return { count: 0, rows: [] }
      }
      const issuesUserIds = _.map(issuesManageList.rows, 'userId')

      const issuesUsersList = await usersCRUD.list({ 'id-in': issuesUserIds }, 'search')

      if (!issuesUsersList || !issuesUsersList.count || !issuesUsersList.rows) {
        return { count: 0, rows: [] }
      }

      const issuesUserMap = new Map()

      for (const item of issuesUsersList.rows) {
        issuesUserMap.set(item.id, item)
      }

      issuesManageList.rows.map(item => {
        const issuesUserInfo = issuesUserMap.get(item.userId)
        if (issuesUserInfo) {
          item.issuesUserName = issuesUserInfo.username
        }
      })

      const objectIds = _.map(issuesManageList.rows, 'objectId')

      const projectsList = await projectCRUD.list({ 'id-in': objectIds }, 'search')

      if (!projectsList || !projectsList.count || !projectsList.rows) {
        return { count: 0, rows: [] }
      }

      const projectMap = new Map()

      for (const item of projectsList.rows) {
        projectMap.set(item.id, item)
      }

      issuesManageList.rows.map(item => {
        const projectInfo = projectMap.get(item.objectId)
        if (projectInfo) {
          item.projectUserId = projectInfo.userId
        }
      })

      const userIds = _.map(issuesManageList.rows, 'projectUserId')

      const usersList = await usersCRUD.list({ 'id-in': userIds }, 'search')

      if (!usersList || !usersList.count || !usersList.rows) {
        return { count: 0, rows: [] }
      }

      const userMap = new Map()
      for (const item of usersList.rows) {
        userMap.set(item.id, item)
      }

      issuesManageList.rows.map(item => {
        const userInfo = userMap.get(item.projectUserId)
        if (userInfo) {
          item.userName = userInfo.username
        }
      })
      return issuesManageList
    },
    async create(params) {
      return issuesManageCRUD.create(params)
    },
    async update(params) {
      return issuesManageCRUD.update(params)
    },
    async get(params) {
      return issuesManageCRUD.get(params)
    },
    async destroy(params) {
      return issuesManageCRUD.destroy(params)
    }
  }
}
