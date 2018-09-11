import {
  resourceCRUD
} from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('subjects')

export default class Subject extends BaseResource {
  static attributes() {
    return [{
      name: 'id',
      type: 'Number',
      edit: false,
      width: '100px'
    },
    {
      name: 'subjectName',
      type: 'String',
      required: true,
      title: true
    },
    {
      name: 'enSubjectName',
      type: 'String'
    },
    {
      name: 'createdAt',
      type: 'Date',
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
