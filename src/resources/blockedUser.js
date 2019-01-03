import blockedUserModel from '@/models/blockedUser'
import BaseResource from './base'

const model = blockedUserModel()

const levelMap = [
  {
    key: 'VIP',
    value: 'VIP'
  },
  {
    key: 'ordinary',
    value: '普通'
  }
]

export default class BlockedUser extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        show: false,
        search: false
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
        name: 'level',
        type: 'String',
        required: true,
        component: 'select',
        edit: false,
        options: levelMap,
        filter: (key) => {
          for (const item of levelMap) {
            if (item.key === key) {
              return item.value
            }
          }

          return key
        }
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
        edit: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show', 'edit']
    }
  }
}
