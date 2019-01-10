import { resourceCRUD } from '@/api/keepwork'

const illegalsCRUD = resourceCRUD('illegals')

export default function blockedProjectsModel() {
  return {
    async list(params) {
      params.where['objectType'] = 5
      const blockedProjectsParams = params
      const blockedProjectsList = await illegalsCRUD.list(blockedProjectsParams)
      return blockedProjectsList
    },
    async create(params) {
      if (typeof params === 'object') {
        params['objectType'] = 5
        params['handler'] = 1
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
