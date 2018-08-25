import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('subjects')

export default class Subject extends BaseResource {
  attributes() {
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

  api() {
    return crudAPI
  }

  actions() {
    return {
      disabled: ['show']
    }
  }
}
