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
        title: true,
        type: 'Date',
        edit: false
      },
      {
        name: 'cellphone',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        component: 'select',
        title: true,
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
