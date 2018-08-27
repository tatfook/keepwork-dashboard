import { resourceCRUD } from '@/api/lesson'
import BaseResource from './base'

const crudAPI = resourceCRUD('packages')
const stateMap = [
  { key: 0, value: '新创建' },
  { key: 1, value: '审核中' },
  { key: 2, value: '审核通过' },
  { key: 3, value: '审核失败' },
  { key: 4, value: '异常' }
]

export default class Package extends BaseResource {
  static attributes() {
    return [
      {
        name: 'id',
        edit: false,
        width: '100px'
      },
      {
        name: 'packageName',
        required: true
      },
      {
        name: 'userId',
        required: true,
        edit: false,
        associate: 'User'
      },
      {
        name: 'subjectId',
        required: true,
        associate: 'Subject'
      },
      {
        name: 'minAge',
        required: true
      },
      {
        name: 'maxAge',
        required: true
      },
      {
        name: 'state',
        required: true,
        type: 'select',
        options: stateMap,
        filter: (value) => {
          for (const option of stateMap) {
            if (option.key === value) return option.value
          }
          return value
        }
      },
      {
        name: 'rmb',
        required: true
      },
      {
        name: 'coin',
        required: true
      },
      {
        name: 'createdAt',
        edit: false
      }
    ]
  }

  static api() {
    return crudAPI
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
