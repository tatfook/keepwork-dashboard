import { blockedUserCRUD } from '@/api/blockedUser'
import BaseResource from './base'

const crudAPI = blockedUserCRUD()

export default class BlockedUser extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        show: false
      },
      {
        name: 'objectId',
        type: 'String',
        required: true,
        component: 'text',
        edit: true,
        associate: 'User'
      },
      {
        name: 'cellphone',
        type: 'String',
        required: true,
        component: 'text',
        edit: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        required: false,
        edit: false
      },
      {
        name: 'description',
        type: 'String',
        required: true,
        component: 'text',
        edit: true
      },
      {
        name: 'handler',
        type: 'String',
        required: true,
        component: 'text',
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
