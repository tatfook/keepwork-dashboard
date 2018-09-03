import {
  resourceCRUD
} from '@/api/lesson'
import BaseResource from './base'
import store from '@/store'

const crudAPI = resourceCRUD('packages')
const stateMap = [{
  key: 0,
  value: '新创建'
},
{
  key: 1,
  value: '审核中'
},
{
  key: 2,
  value: '审核通过'
},
{
  key: 3,
  value: '审核失败'
},
{
  key: 4,
  value: '异常'
}
]

export default class Package extends BaseResource {
  static attributes() {
    return [{
      name: 'id',
      type: 'Number',
      edit: false,
      width: '100px'
    },
    {
      name: 'packageName',
      type: 'String',
      required: true
    },
    {
      name: 'userId',
      type: 'Number',
      required: true,
      edit: false,
      default: () => store.getters.currentUser.id,
      associate: 'User'
    },
    {
      name: 'subjectId',
      type: 'Number',
      required: true,
      associate: 'Subject'
    },
    {
      name: 'minAge',
      type: 'Number',
      required: true
    },
    {
      name: 'maxAge',
      type: 'Number',
      required: true
    },
    {
      name: 'state',
      type: 'Number',
      required: true,
      component: 'select',
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
      type: 'Number',
      required: true
    },
    {
      name: 'coin',
      type: 'Number',
      required: true
    },
    {
      name: 'createdAt',
      type: 'Date',
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
