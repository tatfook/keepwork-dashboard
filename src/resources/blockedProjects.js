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
        search: false,
        edit: false
      },
      {
        name: 'name',
        originName: 'objectId',
        type: 'String',
        edit: false,
        show: false,
        required: true,
        search: false,
        formAssociate: 'projects',
        associate: 'projectsManage',
        associateAs: 'projectsManage',
        associateField: 'name'
      },
      {
        name: 'objectId',
        edit: true,
        show: true,
        required: true
      },
      {
        name: 'illegalProjects.name',
        show: true,
        edit: false,
        search: false
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
      disabled: ['show', 'edit', 'destroy'],
      extra: [
        {
          name: 'block',
          button: 'warning',
          func: async(row) => {
            await this.api().destroy(row)
          },
          title: (row) => {
            return this.i18nBase('resources.BlockedProjects.title')
          },
          confirmMsg: (row) => {
            return this.i18nBase('resources.BlockedProjects.msg')
          }
        }
      ]
    }
  }
}
