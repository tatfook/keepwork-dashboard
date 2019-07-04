import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'

const issuesManageCRUD = resourceCRUD('issues')
const projectCRUD = resourceCRUD('projects')
const usersCRUD = resourceCRUD('users')
const commentCRUD = resourceCRUD('comments')

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
      issuesManageList.rows.map(item => {
        const base = process.env.KEEPWORK_PREFIX || 'https://keepwork.com/'
        item.issueUrl = base + 'pbl/project/' + item.objectId + '/whiteboard'
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
    },
    async commentsDestroy(params) {
      return commentCRUD.destroy(params)
    },
    async comments(params) {
      const commentsList = await commentCRUD.sql('SELECT * FROM `comments` WHERE `objectType`=4 AND `objectId` =' + params)

      if (!commentsList) {
        return { count: 0, rows: [] }
      }

      const commentsUserIds = _.map(commentsList, 'userId')

      const commentsUsersList = await usersCRUD.list({ 'id-in': commentsUserIds }, 'search')

      const commentsUserMap = new Map()
      for (const item of commentsUsersList.rows) {
        commentsUserMap.set(item.id, item)
      }

      commentsList.map(item => {
        const commentsUserInfo = commentsUserMap.get(item.userId)
        if (commentsUserInfo) {
          item.commentsUserName = commentsUserInfo.username
        }
      })

      return commentsList
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
