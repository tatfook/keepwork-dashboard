import { userinfoCRUD } from '@/api/userinfo'
import BaseResource from './base'

const crudAPI = userinfoCRUD()

const sexMap = [
  {
    key: 'F',
    value: '女'
  },
  {
    key: 'M',
    value: '男'
  },
  {
    key: 'N',
    value: '未知'
  }
]

const levelMap = [
  {
    key: 'VIP',
    value: 'VIP'
  },
  {
    key: 'ordinary',
    value: '普通'
  }
]

const statusMap = [
  {
    key: true,
    value: '正常'
  },
  {
    key: false,
    value: '封停'
  }
]

export default class Userinfo extends BaseResource {
  static attributes() {
    return [
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
        name: 'level',
        type: 'String',
        required: true,
        component: 'select',
        edit: false,
        options: levelMap,
        filter: (key) => {
          for (const item of levelMap) {
            if (item.key === key) {
              return item.value
            }
          }

          return key
        },
        search: false
      },
      {
        name: 'status',
        type: 'String',
        required: true,
        component: 'text',
        edit: false,
        filter: (key) => {
          for (const item of statusMap) {
            if (item.key === key) {
              return item.value
            }
          }

          return key
        },
        search: false
      },
      {
        name: 'balance',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: false,
        search: false
      },
      {
        name: 'coin',
        type: 'String',
        required: true,
        component: 'text',
        edit: false,
        search: false
      },
      {
        name: 'bean',
        type: 'String',
        required: true,
        component: 'text',
        edit: false,
        search: false
      },
      {
        name: 'sex',
        type: 'String',
        required: true,
        component: 'select',
        edit: true,
        options: sexMap,
        filter: (key) => {
          for (const item of sexMap) {
            if (item.key === key) {
              return item.value
            }
          }

          return sexMap.N.value
        }
      }
    ]
  }

  static api() {
    return crudAPI
  }

  static actions() {
    return {
      disabled: ['create']
    }
  }
}
