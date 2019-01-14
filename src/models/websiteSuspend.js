import { resourceCRUD } from '../api/keepwork'
import _ from 'lodash'
import { getAdminInfo } from '@/utils/auth'

const websiteSuspendCRUD = resourceCRUD('illegals')
const adminsCRUD = resourceCRUD('admins')

export default function websiteSuspendModel() {
  return {
    async list(params) {
      params.where['objectType'] = 1
      const websiteSuspendParams = params

      const websiteSuspendList = await websiteSuspendCRUD.list(websiteSuspendParams)

      if (!websiteSuspendList || !websiteSuspendList.count || !Array.isArray(websiteSuspendList.rows)) {
        return { count: 0, rows: [] }
      }

      const handlerIds = _.map(websiteSuspendList.rows, 'handler')
      const admins = await adminsCRUD.list({ 'id-in': handlerIds }, 'search')
      const adminMap = new Map()
      for (const item of admins.rows) {
        adminMap.set(item.id, item)
      }

      websiteSuspendList.rows.map(item => {
        const handlerInfo = adminMap.get(item.handler)
        if (handlerInfo) {
          item.handlerName = handlerInfo.username
        }
      })

      return websiteSuspendList
    },
    async create(params) {
      if (typeof params === 'object') {
        params['objectType'] = 1

        const adminInfo = getAdminInfo()
        params['handler'] = adminInfo.userId
      }
      return websiteSuspendCRUD.create(params)
    },
    async update(params) {
      return websiteSuspendCRUD.update(params)
    },
    async destroy(params) {
      return websiteSuspendCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
