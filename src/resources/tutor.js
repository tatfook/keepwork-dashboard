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
        name: 'userId',
        show: true,
        create: true,
        edit: false,
        search: true,
        associate: 'User',
        sort: false
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
        name: 'tutor',
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
