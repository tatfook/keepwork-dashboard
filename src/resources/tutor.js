import BaseResource from './base'
import tutorModel from '@/models/tutor'

export default class Tutor extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        show: false,
        edit: false,
        create: false,
        search: false
      },
      {
        name: 'username',
        originName: 'userId',
        show: true,
        create: true,
        edit: false,
        search: true,
        sort: false,
        associate: 'tutor'
      },
      {
        name: 'cellphone',
        show: true,
        search: true,
        create: false,
        edit: false,
        sort: false,
        component: 'input'
      },
      {
        name: 'tutorId',
        show: true,
        search: false,
        associate: 'User',
        sort: false
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
        create: false,
        edit: false,
        show: true
      },
      {
        name: 'comment',
        show: true,
        sort: false
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
