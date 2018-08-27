import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('subjects')

export default class Subject extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        edit: false,
        width: '100px'
      },
      {
        name: 'subjectName',
        required: true
      },
      {
        name: 'createdAt',
        edit: false
      }
    ]
  }

  static api() {
    return crudAPI
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
