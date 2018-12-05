import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const crudAPI = resourceCRUD('users')

export default class User extends BaseResource {
  static attributes() {
    return [
      {
        name: 'username',
        title: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      },
      {
        name: 'cellphone',
        type: 'String',
        required: true,
        component: 'text',
        edit: true
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        component: 'select',
        edit: true
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
