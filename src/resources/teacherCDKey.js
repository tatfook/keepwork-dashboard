import BaseResource from './base'
import { getTeacherCDKeys, generateTeacherCDKeys } from '@/api/lesson'

const stateMap = [
  { key: 0, value: '待用' },
  { key: 1, value: '已使用' },
  { key: 2, value: '禁用' }
]

export default class TeacherCDKey extends BaseResource {
  static attributes() {
    return [
      {
        name: 'key'
      },
      {
        name: 'state',
        filter: (value) => {
          for (const option of stateMap) {
            if (option.key === value) return option.value
          }
          return value
        }
      },
      {
        name: 'createdAt'
      }
    ]
  }

  static api() {
    return {
      list: getTeacherCDKeys,
      generate: generateTeacherCDKeys
    }
  }

  static actions() {
    return {
      disabled: ['all']
    }
  }
}
