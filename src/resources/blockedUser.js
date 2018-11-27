import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const crudAPI = resourceCRUD('users')

export default class BlockedUser extends BaseResource {
  static attributes() {
    return [
      {
        name: 'username',
        title: true
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
        name: 'createdAt',
        type: 'Date',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'level',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'reason',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'operator',
        type: 'String',
        required: true,
        component: 'text',
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
      disabled: []
    }
  }
}
