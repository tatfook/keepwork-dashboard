import { resourceCRUD } from '@/api/keepwork'
import store from '@/store'
import _ from 'lodash'

const usersCRUD = resourceCRUD('systemTags')

export default function projectsManageModel() {
  return {
    async list(params) {
      params['where']['classify'] = { $eq: 1 }
      return usersCRUD.list(params)
    },
    async create(params) {
      params['extra']['username'] = store.getters.name || ''
      params['classify'] = 1
      const sn = params['extra']['sn']
      if (sn) {
        params['extra']['sn'] = _.toNumber(sn)
      }
      return usersCRUD.create(params)
    },
    async update(params) {
      const sn = params['extra']['sn']
      if (sn) {
        params['extra']['sn'] = _.toNumber(sn)
      }
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
