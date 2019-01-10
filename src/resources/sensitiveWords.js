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
        create: false,
        search: false
      },
      {
        name: 'word',
        type: 'String',
        required: true
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
