import { resourceCRUD } from '@/api/keepwork'
import BaseResource from './base'

const crudAPI = resourceCRUD('sensitiveWords')

export default class SensitiveWords extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        show: false,
        edit: false
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
        edit: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        show: false,
        edit: false
      }
    ]
  }

  static api() {
    return crudAPI
  }

  static actions() {
    return {
      disabled: []
    }
  }
}
