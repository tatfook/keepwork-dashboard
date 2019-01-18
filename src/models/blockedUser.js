import { resourceCRUD } from '../api/keepwork'
import _ from 'lodash'
import { getAdminInfo } from '@/utils/auth'

const adminsCRUD = resourceCRUD('admins')
const illegalsCRUD = resourceCRUD('illegals')

export default function blockedUserModel() {
  return {
    async list(params) {
      if (typeof params !== 'object') {
        return { count: 0, rows: [] }
      }

      params.where['objectType'] = 0
      const originList = await illegalsCRUD.list(params)

      if (!originList || !originList.count || !Array.isArray(originList.rows)) {
        return { count: 0, rows: [] }
      }

      _.map(originList.rows, item => {
        item.level = 'ordinary'
      })

      const handlerIds = _.map(originList.rows, 'handler')

      const admins = await adminsCRUD.list({ 'id-in': handlerIds }, 'search')

      const adminMap = new Map()

      for (const item of admins.rows) {
        adminMap.set(item.id, item)
      }

      originList.rows.map(item => {
        const handlerInfo = adminMap.get(item.handler)

        if (handlerInfo) {
          item.handlerName = handlerInfo.username
        }
      })

      return originList
    },
    async create(params) {
      if (typeof params === 'object') {
        params['objectType'] = 0

        const adminInfo = getAdminInfo()
        params['handler'] = adminInfo.userId
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
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
