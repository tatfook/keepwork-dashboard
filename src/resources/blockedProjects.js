import blockedProjectsModel from '@/models/blockedProjects'
import BaseResource from './base'

const model = blockedProjectsModel()

export default class BlockedProjects extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        show: false,
        create: false,
        search: false
      },
      {
        name: 'name',
        originName: 'objectId',
        type: 'String',
        edit: true,
        required: true,
        search: true,
        formAssociate: 'projects',
        associate: 'illegalProjects',
        associateAs: 'illegalProjects',
        associateField: 'name'
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: true,
        edit: false,
        required: true,
        component: 'time',
        search: false
      },
      {
        name: 'handlerName',
        originName: 'handler',
        type: 'String',
        required: true,
        component: 'text',
        create: false,
        edit: false,
        sort: false
      },
      {
        name: 'description',
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
      disabled: ['show', 'edit', 'delete'],
      extra: [
        {
          name: 'resources.BlockedProjects.title',
          func: (ctx, data) => {
            ctx.$confirm(ctx.$t('resources.BlockedProjects.msg'), ctx.$t('resources.BlockedProjects.title'), {
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
          name: 'resources.BlockedProjects.deblockAll',
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
