import { resourceCRUD } from '@/api/keepwork'

const issuesManageCRUD = resourceCRUD('issues')

export default function issuesManageModel() {
  return {
    async list(params) {
      return issuesManageCRUD.list(params)
    },
    async create(params) {
      return issuesManageCRUD.create(params)
    },
    async update(params) {
      return issuesManageCRUD.update(params)
    },
    async get(params) {
      return issuesManageCRUD.get(params)
    },
    async destroy(params) {
      return issuesManageCRUD.destroy(params)
    }
  }
}
