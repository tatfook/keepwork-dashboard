import adminModel from '@/models/admin'
import BaseResource from './base'

const model = adminModel()

export default class Admin extends BaseResource {
  static attributes() {
    return [
      {
        name: 'username',
        type: 'String',
        required: true,
        title: true
      },
      {
        name: 'password',
        type: 'String',
        required: true,
        show: false,
        edit: true,
        search: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
