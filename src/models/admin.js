import { resourceCRUD } from '@/api/keepwork'
import md5 from 'blueimp-md5'

const adminsCRUD = resourceCRUD('admins')

export default function adminModel() {
  return {
    async list(params) {
      const userList = await adminsCRUD.list(params)

      for (const item of userList.rows) {
        delete item.password
      }

      return userList
    },
    async create(params) {
      params.password = md5(params.password)

      return adminsCRUD.create(params)
    },
    async update(params) {
      params.password = md5(params.password)

      return adminsCRUD.update(params)
    },
    async destroy(params) {
      return adminsCRUD.destroy(params)
    }
  }
}
