import BaseResource from './base'
import { getTeacherCDKeys, generateTeacherCDKeys } from '@/api/lesson'

const stateMap = [
  {
    key: 0,
    value: '待用'
  },
  {
    key: 1,
    value: '已使用'
  },
  {
    key: 2,
    value: '禁用'
  }
]

export default class TeacherCDKey extends BaseResource {
  static attributes() {
    return [
      {
        name: 'key',
        type: 'String'
      },
      {
        name: 'state',
        type: 'Number',
        filter: value => {
          for (const option of stateMap) {
            if (option.key === value) return option.value
          }
          return value
        }
      },
      {
        name: 'createdAt',
        type: 'Date',
        edit: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        edit: false
      },
      {
        name: 'userId',
        type: 'Number',
        edit: false
      }
    ]
  }

  static model() {
    return {
      list: getTeacherCDKeys,
      generate: generateTeacherCDKeys
    }
  }

  static actions() {
    return {
      disabled: ['create', 'show', 'destroy', 'delete']
    }
  }
}
