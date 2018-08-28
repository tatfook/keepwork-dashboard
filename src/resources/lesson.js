import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('lessons')

export default class Lesson extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'lessonName',
        type: 'String',
        required: true
      },
      {
        name: 'userId',
        type: 'Number',
        associate: 'User',
        required: true,
        edit: false
      },
      {
        name: 'subjectId',
        type: 'Number',
        required: true,
        associate: 'Subject'
      },
      {
        name: 'goals',
        type: 'String'
      },
      {
        name: 'extra.coverUrl',
        type: 'String',
        search: false
      },
      {
        name: 'extra.vedioUrl',
        type: 'String',
        search: false
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
