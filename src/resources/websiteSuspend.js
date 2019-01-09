import websiteSuspendModel from '@/models/websiteSuspend'
import BaseResource from './base'

const model = websiteSuspendModel()

export default class websiteSuspend extends BaseResource {
  static attributes() {
    return [
      {
        name: 'displayName',
        required: true,
        search: true,
        sort: false,
        edit: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        component: 'time',
        edit: true,
        search: false
      },
      {
        name: 'description',
        type: 'String',
        required: true,
        component: 'text',
        sort: false,
        edit: true
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
