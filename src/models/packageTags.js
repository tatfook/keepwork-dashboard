import { resourceCRUD } from '@/api/keepwork'
import store from '@/store'

const CRUD = resourceCRUD('systemTags')

export default function systemTagsModel() {
  return {
    async list(params) {
      params['where']['classify'] = { $eq: 2 }
      return CRUD.list(params)
    },
    async create(params) {
      params['extra.username'] = store.getters.name || ''
      params['classify'] = 2
      return CRUD.create(params)
    }
  }
}
