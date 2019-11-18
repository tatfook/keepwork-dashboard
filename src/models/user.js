import { resourceCRUD } from '../api/keepwork'
import _ from 'lodash'

const usersCRUD = resourceCRUD('users')
const illegalsCRUD = resourceCRUD('illegals')

export default function userinfoModel() {
  return {
    async list(params) {
      if (params.where['tLevel']) {
        _.forEach(params.where['tLevel'], (value, key) => {
          params.where['tLevel'][key] = `${value}`.match(/\d/)[0]
        })
      }

      if (params.where['vip']) {
        _.forEach(params.where['vip'], (value, key) => {
          value = _.lowerCase(value)
          value = value === 'vip' ? 1 : 0
          params.where['vip'][key] = value
        })
      }

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
        blockedUserList = await illegalsCRUD.list({ 'objectId-in': usersIds }, 'search')
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
            item.status = 1
          } else {
            item.status = 0
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
    destroy(params) {
      return usersCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
