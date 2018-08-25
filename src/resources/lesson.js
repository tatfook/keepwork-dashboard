import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('lessons')

export default class Lesson extends BaseResource {
  attributes() {
    return [
      {
        name: 'id',
        edit: false,
        width: '100px'
      },
      {
        name: 'lessonName',
        required: true
      },
      {
        name: 'userId',
        associate: 'User',
        required: true,
        edit: false
      },
      {
        name: 'subjectId',
        required: true,
        type: 'select',
        associate: 'Subject'
      },
      {
        name: 'goals'
      },
      {
        name: 'extra.coverUrl'
      },
      {
        name: 'extra.vedioUrl'
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
