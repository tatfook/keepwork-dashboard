import { resourceCRUD } from './keepwork'
import _ from 'lodash'

const usersCRUD = resourceCRUD('users')
const illegalsCRUD = resourceCRUD('illegals')

export function userinfoCRUD() {
  return {
    async list(params) {
      const originList = await usersCRUD.list(params)

      if (!originList || !originList.count || !originList.rows) {
        return { count: 0, rows: [] }
      }

      _.map(
        originList.rows,
        (item) => {
          item.level = 'ordinary'
        }
      )

      const usersIds = _.map(originList.rows, 'id')

      let blockedUserList

      try {
        blockedUserList = await illegalsCRUD.list({ 'objectId-in': usersIds })
      } catch (error) {
        console.log(error)
      }

      const blockedUserMap = new Map()

      for (const item of blockedUserList.rows) {
        blockedUserMap.set(item.objectId, item)
      }

      originList.rows.map(
        item => {
          const curBlockedUser = blockedUserMap.get(item.id)

          if (curBlockedUser) {
            item.status = false
          } else {
            item.status = true
          }
        }
      )

      return originList
    },
    create(params) {
      return usersCRUD.create(params)
    },
    update(params) {
      return usersCRUD.update(params)
    },
    get(params) {
      return usersCRUD.get(params)
    },
    destory(params) {
      return usersCRUD.destroy(params)
    }
  }
}
