import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'
import store from '@/store'

const model = resourceCRUD('packageLessons')

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
        name: 'lessonId',
        type: 'Number',
        required: true,
        associate: 'Lesson'
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
