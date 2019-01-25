import { resourceCRUD } from '@/api/keepwork'
import store from '@/store'
import _ from 'lodash'

const usersCRUD = resourceCRUD('systemTags')

export default function projectsManageModel() {
  return {
    async list(params) {
      return usersCRUD.list(params)
    },
    async create(params) {
      const username = _.get(store, 'getters.name', '')
      params['classify'] = 1
      params['extra'] = { username }
      return usersCRUD.create(params)
    },
    async update(params) {
      const username = _.get(store, 'getters.name', '')
      params['classify'] = 1
      params['extra'] = { username }
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
