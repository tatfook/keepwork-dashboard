import { resourceCRUD } from '../api/keepwork'
import _ from 'lodash'

const usersCRUD = resourceCRUD('users')
const illegalsCRUD = resourceCRUD('illegals')

export default function blockedUserModel() {
  return {
    async list(params) {
      if (typeof params !== 'object') {
        return { count: 0, rows: [] }
      }

      if (params['x-order'] === 'cellphone-desc') {
        delete params['x-order']
      }

      if (params['cellphone-eq']) {
        const cellphone = params['cellphone-eq']

        try {
          const response = await usersCRUD.get('?cellphone=' + cellphone)
          params['objectId-eq'] = response[0].id
        } catch (error) {
          console.log(error)
        }

        params['objectId-eq'] = params['objectId-eq'] || 0

        delete params['cellphone-eq']
      }

      params.where['objectType'] = 1
      const originList = await illegalsCRUD.list(params)

      _.map(
        originList.rows,
        (item) => {
          item.level = 'ordinary'
        }
      )

      if (!originList || !originList.count || !Array.isArray(originList.rows)) {
        return { count: 0, rows: [] }
      }

      const blockedUserIds = _.map(originList.rows, 'objectId')

      const usersParams = { 'id-in': blockedUserIds }
      const userList = await usersCRUD.list(usersParams)

      if (!userList || !userList.count || !Array.isArray(userList.rows)) {
        return { count: 0, rows: [] }
      }

      const usersMap = new Map()

      for (const item of userList.rows) {
        usersMap.set(item.id, item)
      }

      // originList.rows.map(
      //   item => {
      //     const curUser = usersMap.get(item.objectId)

      //     if (!curUser) {
      //       return true
      //     }

      //     item.cellphone = curUser.cellphone || ''
      //     item.username = curUser.username || ''
      //   }
      // )

      return originList
    },
    async create(params) {
      if (typeof params === 'object') {
        params['objectType'] = 1
      }

      return illegalsCRUD.create(params)
    },
    async update(params) {
      return illegalsCRUD.update(params)
    },
    async get(params) {
      return illegalsCRUD.get(params)
    },
    async destroy(params) {
      return illegalsCRUD.destroy(params)
    }
  }
}
