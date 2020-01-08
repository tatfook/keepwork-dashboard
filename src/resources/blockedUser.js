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
        name: 'objectId',
        alias: 'username',
        type: 'String',
        required: true,
        component: 'text',
        edit: true,
        show: true,
        associate: 'User',
        associateAs: 'illegalUsers'
      },
      {
        name: 'objectId',
        alias: 'cellphone',
        type: 'String',
        required: true,
        component: 'text',
        create: false,
        edit: false,
        associate: 'User',
        associateAs: 'illegalUsers',
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
        search: false,
        options: levelMap,
        filter: (key) => {
          for (const item of levelMap) {
            if (item.key === key) {
              return item.value
            }
          }

          return key
        },
        sortable: false
      },
      {
        name: 'description',
        type: 'String',
        required: true,
        component: 'text',
        edit: true,
        search: false,
        sort: false
      },
      {
        name: 'handlerName',
        type: 'String',
        required: true,
        component: 'text',
        create: false,
        edit: false,
        search: false,
        sortable: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show', 'edit', 'destroy'],
      extra: [
        {
          name: 'block',
          button: 'warning',
          func: async(row) => {
            await this.api().destroy(row)
          },
          title: (row) => {
            return this.i18nBase('resources.BlockedUser.title')
          },
          confirmMsg: (row) => {
            return this.i18nBase('resources.BlockedUser.msg')
          }
        }
      ]
    }
  }
}
