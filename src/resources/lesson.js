import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'
import store from '@/store'

const model = resourceCRUD('lessons')

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
        title: true,
        required: true
      },
      {
        name: 'userId',
        type: 'Number',
        associate: 'User',
        required: true,
        default: () => store.getters.currentUser.id,
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
        search: false,
        show: false
      },
      {
        name: 'extra.videoUrl',
        type: 'String',
        search: false,
        show: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show'],
      extra: [{
        name: 'view',
        title() {
          return '查看详情'
        },
        async func(row, that) {
          const { url } = row
          window.open(url, '_blank')
        }
      }]
    }
  }
}
