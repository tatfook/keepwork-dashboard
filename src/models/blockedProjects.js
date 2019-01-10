import { resourceCRUD } from '@/api/keepwork'

const illegalsCRUD = resourceCRUD('illegals')

export default function projectsManageModel() {
  return {
    async list(params) {
      return illegalsCRUD.list(params)
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
    }
  }
}
