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
        create: false,
        edit: false,
        show: false,
        search: false
      },
      {
        name: 'username',
        originName: 'objectId',
        type: 'String',
        required: true,
        component: 'text',
        edit: true,
        show: true,
        associate: 'users',
        associateAs: 'illegalUser',
        associateField: 'username',
        sort: false
      },
      {
        name: 'cellphone',
        originName: 'objectId',
        type: 'String',
        required: true,
        component: 'text',
        create: false,
        edit: false,
        associate: 'users',
        associateAs: 'illegalUser',
        associateField: 'cellphone',
        sort: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        required: false,
        edit: false,
        component: 'time'
      },
      {
        name: 'level',
        type: 'String',
        required: true,
        component: 'select',
        create: false,
        edit: false,
        options: levelMap,
        filter: (key) => {
          for (const item of levelMap) {
            if (item.key === key) {
              return item.value
            }
          }

          return key
        },
        sort: false
      },
      {
        name: 'description',
        type: 'String',
        required: true,
        component: 'text',
        edit: true,
        sort: false
      },
      {
        name: 'handler',
        type: 'String',
        required: true,
        component: 'text',
        edit: false,
        sort: false
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
