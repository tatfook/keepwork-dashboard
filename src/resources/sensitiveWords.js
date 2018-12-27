import sensitiveWords from '@/models/sensitiveWords'
import BaseResource from './base'

const model = sensitiveWords()

export default class SensitiveWords extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'word',
        type: 'String',
        required: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        show: false,
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
      disabled: ['show']
    }
  }
}
