import {
  resourceCRUD
} from '@/api/keepwork'
import BaseResource from './base'

const crudAPI = resourceCRUD('admins')

export default class Admin extends BaseResource {
  static attributes() {
    return [
      {
        name: 'username',
        type: 'String',
        required: true,
        title: true
      },
      {
        name: 'password',
        type: 'String',
        required: true,
        show: false,
        edit: true,
        search: false
      }
    ]
  }

  static api() {
    return crudAPI
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
