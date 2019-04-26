import adminModel from '@/models/admin'
import BaseResource from './base'
import _ from 'lodash'
const model = adminModel()

const rolesMap = [{
  key: 0,
  value: '管理员'
}, {
  key: 1,
  value: '市场人员'
}]

export default class Admin extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        create: false,
        edit: false,
        show: false
      },
      {
        name: 'username',
        type: 'String',
        required: true,
        title: true
      },
      {
        name: 'password',
        type: 'String',
        required: true,
        show: false,
        edit: true,
        search: false
      },
      {
        name: 'roleId',
        type: 'Number',
        required: true,
        show: true,
        component: 'select',
        options: rolesMap,
        edit: true,
        default: 0,
        filter(roleId) {
          return _.find(rolesMap, item => item.key === roleId).value
        }
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
