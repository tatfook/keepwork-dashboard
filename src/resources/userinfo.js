import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const crudAPI = resourceCRUD('users')

export default class Userinfo extends BaseResource {
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
        name: 'level',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'status',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'balance',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'coin',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'bean',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: true
      },
      {
        name: 'sex',
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
