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
        formAssociate: 'users',
        associate: 'illegalUsers',
        associateAs: 'illegalUsers',
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
        associate: 'illegalUsers',
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
        name: 'handlerName',
        type: 'String',
        required: true,
        component: 'text',
        create: false,
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
      disabled: ['show', 'edit', 'delete'],
      extra: [
        {
          name: 'resources.BlockedUser.title',
          func: (ctx, data) => {
            ctx.$confirm(ctx.$t('resources.BlockedUser.msg'), ctx.$t('resources.BlockedUser.title'), {
              confirmButtonText: ctx.$t('ok'),
              cancelButtonText: ctx.$t('cancel'),
              type: 'warning'
            })
              .then(async() => {
                await this.model().destroy(data)
                ctx.getList()
              })
          }
        }
      ]
    }
  }

  static action() {
    return {
      extra: [
        {
          name: 'resources.BlockedUser.deblockAll',
          func: (ctx) => {
            if (ctx) {
              ctx.handleDeleteAll()
            }
          }
        }
      ]
    }
  }
}
