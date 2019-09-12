// import { resourceCRUD } from '@/api/lesson'
import lessonsModel from '@/models/lesson'
import { getUserToken } from '@/api/getToken'
import BaseResource from './base'

const model = lessonsModel()

const ENV = process.env.NODE_ENV
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
        name: 'username',
        type: 'String',
        search: false,
        edit: false
      },
      {
        name: 'userId',
        type: 'Number',
        associate: 'User',
        component: 'select',
        search: false,
        show: false,
        required: true
      },
      {
        name: 'subjectId',
        type: 'Number',
        required: true,
        component: 'select',
        associate: 'Subject',
        show: false
      },
      {
        name: 'subjectName',
        type: 'String',
        search: false,
        edit: false
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
      extra: [
        {
          name: 'view',
          title() {
            return '预览'
          },
          async func(row, that) {
            const { userId, id } = row
            const token = await getUserToken(userId)
            if (token) {
              if (ENV === 'stage' || ENV === 'release') {
                const env = ENV === 'stage' ? 'dev' : 'rls'
                const url = `http://${env}.keepwork.com/l/preview/lesson/${id}?token=${token}`
                return window.open(url, '_blank')
              }
              window.open(`https://keepwork.com/l/preview/lesson/${id}?token=${token}`, '_blank')
            }
          }
        }
      ]
    }
  }
}
