import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('users')

export default class User extends BaseResource {
  static attributes() {
    return []
  }

  static api() {
    return crudAPI
  }

  static actions() {
    return {
      disabled: ['create', 'delete', 'update']
    }
  }
}
