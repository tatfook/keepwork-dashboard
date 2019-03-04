import { resourceCRUD } from '@/api/keepwork'
import store from '@/store'

const usersCRUD = resourceCRUD('systemTags')

export default function projectsManageModel() {
  return {
    async list(params) {
      return usersCRUD.list(params)
    },
    async create(params) {
      params['extra.username'] = store.getters.name || ''
      params['classify'] = 1
      return usersCRUD.create(params)
    },
    async update(params) {
      return usersCRUD.update(params)
    },
    async get(params) {
      return usersCRUD.get(params)
    },
    async destroy(params) {
      return usersCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
