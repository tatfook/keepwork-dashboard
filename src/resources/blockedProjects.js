import blockedProjectsModel from '@/models/blockedProjects'
import BaseResource from './base'

const model = blockedProjectsModel()

export default class BlockedProjects extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        show: true,
        create: false
      },
      {
        name: 'name',
        type: 'String',
        edit: true,
        required: true,
        search: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: true,
        edit: false,
        required: true,
        search: false
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
        edit: false,
        create: false
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
