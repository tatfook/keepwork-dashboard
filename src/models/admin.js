import { resourceCRUD } from '@/api/keepwork'

const adminsCRUD = resourceCRUD('admins')

export default function adminModel() {
  return {
    async list(params) {
      const userList = await adminsCRUD.list(params)

      return userList
    },
    async create() {},
    async update() {},
    async destory() {}
  }
}
