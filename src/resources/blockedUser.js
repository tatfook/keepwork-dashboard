import blockedUserModel from '@/models/blockedUser'
import BaseResource from './base'

const model = blockedUserModel()

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
        show: true,
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

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
