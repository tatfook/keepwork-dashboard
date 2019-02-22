import BaseResource from './base'
import NPLapply from '@/models/NPLapply'

const model = NPLapply

export default class NPLApply extends BaseResource {
  static attributes() {
    return [
      {
        name: 'gameNo',
        type: 'Number',
        edit: false,
        width: '100px'
      },
      {
        name: 'gameName',
        type: 'String',
        edit: false,
        require: true
      },
      {
        name: 'name',
        type: 'String'
      },
      {
        name: 'worksCount',
        type: 'Number',
        edit: false
      },
      {
        name: 'sex',
        type: 'String'
      },
      {
        name: 'birthdate',
        type: 'Date',
        component: 'time'
      },
      {
        name: 'cellphone',
        type: 'String'
      },
      {
        name: 'email',
        type: 'String'
      },
      {
        name: 'QQ',
        type: 'String'
      },
      {
        name: 'school',
        type: 'String'
      }
    ]
  }
  static model() {
    return model
  }
  static actions() {
    return {
      disabled: ['show', 'create', 'delete', 'destroy']
    }
  }
}
