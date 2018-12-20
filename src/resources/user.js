import userModel from '@/models/user'
import BaseResource from './base'

const model = userModel()

const stateMap = [
  {
    key: 0,
    value: '正常'
  },
  {
    key: 1,
    value: '封停'
  }
]

export default class User extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'username',
        title: true,
        edit: false
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false,
        search: false
      },
      {
        name: 'cellphone',
        type: 'String',
        required: true,
        component: 'text',
        edit: true
      },
      {
        name: 'status',
        type: 'Number',
        required: true,
        component: 'select',
        edit: false,
        options: stateMap,
        filter: (value) => {
          for (const option of stateMap) {
            if (option.key === value) return option.value
          }
          return value
        },
        search: true
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['create', 'show']
    }
  }
}
