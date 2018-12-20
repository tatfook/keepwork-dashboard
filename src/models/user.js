import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'

const usersCRUD = resourceCRUD('users')
const illegalsCRUD = resourceCRUD('illegals')

export default function userModel() {
  return {
    async list(params) {
      const usersParams = params

      const usersList = await usersCRUD.list(usersParams)

      const userIds = _.map(usersList.rows, 'id')

      const illegalsParams = { 'objectId-in': userIds, 'objectType-eq': 1 }
      const illegalsList = await illegalsCRUD.list(illegalsParams)

      const illegalsMap = new Map()

      for (const item of illegalsList.rows) {
        illegalsMap.set(item.objectId, item)
      }

      usersList.rows.map(
        item => {
          const curIllegal = illegalsMap.get(item.id)

          if (curIllegal) {
            item.status = 1
          } else {
            item.status = 0
          }
        }
      )

      return usersList
    },
    async create(params) {
      return usersCRUD.create(params)
    },
    async update(params) {
      return usersCRUD.update(params)
    },
    async destory(params) {
      return usersCRUD.destory(params)
    }
  }
}
