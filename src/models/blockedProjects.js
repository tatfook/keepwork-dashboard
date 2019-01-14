import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'
import { getAdminInfo } from '@/utils/auth'

const illegalsCRUD = resourceCRUD('illegals')
const adminsCRUD = resourceCRUD('admins')

export default function blockedProjectsModel() {
  return {
    async list(params) {
      params.where['objectType'] = 5
      const blockedProjectsParams = params
      const blockedProjectsList = await illegalsCRUD.list(blockedProjectsParams)

      const projectsHandlerIds = _.map(blockedProjectsList.rows, 'handler')

      const projectsAdmins = await adminsCRUD.list({ 'id-in': projectsHandlerIds }, 'search')

      const adminMap = new Map()

      for (const item of projectsAdmins.rows) {
        adminMap.set(item.id, item)
      }

      blockedProjectsList.rows.map(item => {
        const handlerInfo = adminMap.get(item.handler)

        if (handlerInfo) {
          item.handlerName = handlerInfo.username
        }
      })
      return blockedProjectsList
    },
    async create(params) {
      if (typeof params === 'object') {
        params['objectType'] = 5

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
