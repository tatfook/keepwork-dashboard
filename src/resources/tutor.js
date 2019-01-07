import BaseResource from './base'
import tutorModel from '@/models/tutor'

export default class Tutor extends BaseResource {
  static attributes() {
    return [
      {
        name: 'userId',
        show: true,
        edit: false,
        create: false,
        search: true,
        associate: 'User',
        sort: false
      },
      {
        name: 'cellphone',
        show: true,
        search: true,
        insert: true,
        edit: false,
        component: 'input'
      },
      {
        name: 'tutorId',
        show: true,
        search: false,
        associate: 'User'
      },
      {
        name: 'endTime',
        type: 'Date',
        show: true,
        search: false,
        component: 'time'
      },
      {
        name: 'status',
        show: true
      },
      {
        name: 'comment',
        show: true
      }
    ]
  }

  static model() {
    return tutorModel()
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
