import projectsManageModel from '@/models/projectsManage'
import BaseResource from './base'

const model = projectsManageModel()

export default class ProjectsManage extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        show: true,
        edit: false
      },
      {
        name: 'type',
        type: 'Number',
        show: true,
        search: true
      },
      {
        name: 'name',
        type: 'String',
        edit: true,
        search: true
      },
      {
        name: 'privilege',
        type: 'Number',
        edit: true,
        show: true,
        search: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: true,
        edit: false,
        search: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        show: true,
        edit: false,
        search: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['create', 'show', 'edit']
    }
  }
}
