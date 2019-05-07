import issuesManageModel from '@/models/issuesManage'
import BaseResource from './base'

const model = issuesManageModel()

export default class IssuesManage extends BaseResource {
  static attributes() {
    return [
      {
        name: 'title',
        type: 'String',
        show: true
      },
      {
        name: 'id',
        type: 'Number',
        edit: false,
        sort: false,
        search: false,
        show: false
      },
      {
        name: 'issueUrl',
        edit: false,
        sort: false,
        search: false
      },
      {
        name: 'issuesUserName',
        type: 'String',
        show: true,
        search: false
      },
      {
        name: 'userName',
        type: 'String',
        show: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: true,
        edit: true,
        component: 'time',
        required: true,
        search: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        show: true,
        edit: true,
        component: 'time',
        search: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show', 'create', 'edit']
    }
  }
}
