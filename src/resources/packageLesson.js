import packageLessonModel from '@/models/packageLesson'
import BaseResource from './base'
import store from '@/store'

const model = packageLessonModel()

export default class PackageLesson extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'packageId',
        type: 'Number',
        required: true,
        associate: 'Package'
      },
      {
        name: 'packages',
        type: 'String',
        search: false,
        edit: false,
        filter: object => {
          return object.packageName
        }
      },
      {
        name: 'lessonId',
        type: 'Number',
        required: true,
        associate: 'Lesson'
      },
      {
        name: 'lessonName',
        type: 'String',
        search: false,
        edit: false
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
        name: 'username',
        type: 'String',
        search: false,
        edit: false
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
      disabled: ['show']
    }
  }
}
