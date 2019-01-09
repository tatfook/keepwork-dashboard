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
        name: 'studentName',
        originName: 'userId',
        show: true,
        create: true,
        edit: false,
        search: true,
        sort: false,
        associate: 'users',
        associateAs: 'students',
        associateField: 'username'
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
        name: 'teacherName',
        originName: 'tutorId',
        show: true,
        search: false,
        sort: false,
        associate: 'users',
        associateAs: 'teachers',
        associateField: 'username'
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
        type: 'options',
        create: false,
        edit: false,
        show: true
      },
      {
        name: 'comment',
        show: true,
        sort: false,
        search: false
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
