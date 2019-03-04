import BaseResource from './base'
import { resourceCRUD } from '@/api/keepwork'
import NPLapply from '@/models/NPLapply'
import _ from 'lodash'

const model = _.merge({}, resourceCRUD('userinfos'), NPLapply)

const genderMap = [
  {
    key: 'N',
    value: '男'
  },
  {
    key: 'F',
    value: '女'
  },
  {
    key: 'N',
    value: '保密'
  }
]
export default class NPLApply extends BaseResource {
  static attributes() {
    return [
      {
        name: 'serial',
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
        name: 'gameNo',
        type: 'Number',
        edit: false
      },
      {
        name: 'name',
        type: 'String'
      },
      {
        name: 'worksCount',
        type: 'Number',
        edit: false,
        search: false
      },
      {
        name: 'sex',
        type: 'String',
        component: 'select',
        options: genderMap,
        edit: false,
        search: false,
        filter: value => {
          return value === 'M' ? '男' : value === 'F' ? '女' : '保密'
        }
      },
      {
        name: 'birthdate',
        type: 'Date',
        component: 'time',
        search: false
      },
      {
        name: 'cellphone',
        edit: false,
        type: 'String'
      },
      {
        name: 'email',
        type: 'String',
        edit: false,
        search: false
      },
      {
        name: 'qq',
        type: 'String',
        search: false
      },
      {
        name: 'school',
        type: 'String',
        search: false
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
