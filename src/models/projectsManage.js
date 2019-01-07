import { resourceCRUD } from '@/api/keepwork'

const usersCRUD = resourceCRUD('projects')

export default function projectsManageModel() {
  return {
    async list(params) {
      return usersCRUD.list(params)
    },
    async create(params) {
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
    }
  }
}
