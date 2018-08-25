import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('users')

export default class User extends BaseResource {
  resource() {
    return 'user'
  }

  attributes() {
    return []
  }

  api() {
    return crudAPI
  }

  actions() {
    return {
      disabled: ['create', 'delete', 'update']
    }
  }
}
