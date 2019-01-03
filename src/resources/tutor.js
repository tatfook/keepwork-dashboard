import BaseResource from './base'
import tutorModel from '@/models/tutor'

export default class Tutor extends BaseResource {
  static attributes() {
    return [
      {
        name: 'userId',
        show: true,
        edit: false,
        search: true,
        associate: 'User',
        sort: false
      },
      {
        name: 'endTime',
        type: 'Date',
        show: true,
        edit: false,
        search: false
      }
    ]
  }

  static model() {
    return tutorModel()
  }

  static actions() {
    return {
      disabled: []
    }
  }
}
