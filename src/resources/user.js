import BaseResource from './base'
import userModel from '@/models/user'
import md5 from 'blueimp-md5'

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
        show: true,
        edit: false,
        search: true
      },
      {
        name: 'username',
        title: true,
        edit: false,
        sort: false
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
        edit: true,
        sort: false
      },
      {
        name: 'realname',
        type: 'String',
        edit: false,
        search: false,
        sort: false
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
        search: false,
        sort: false
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
        search: false,
        sort: false
      },
      {
        name: 'balance',
        type: 'String',
        required: true,
        component: 'text',
        title: true,
        edit: false,
        search: false,
        sort: false
      },
      {
        name: 'coin',
        type: 'String',
        required: true,
        component: 'text',
        edit: false,
        search: false,
        sort: false
      },
      {
        name: 'bean',
        type: 'String',
        required: true,
        component: 'text',
        edit: false,
        search: false,
        sort: false
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
        },
        search: false,
        sort: false
      }
    ]
  }

  static model() {
    return userModel()
  }

  static actions() {
    return {
      disabled: ['create', 'edit', 'show', 'destroy'],
      extra: [{
        name: 'resetPwd',
        title() {
          return '重置密码'
        },
        async func(row, that) {
          const params = {
            data: [{
              label: '确认新密码：',
              key: 'password',
              value: '',
              id: row.id
            }],
            type: 'input',
            title: '重置密码',
            status: 'resetPwd'
          }
          that.showDialog(params)
        }
      }, {
        name: 'personalHomepage',
        title() {
          return '个人主页'
        },
        func(data) {
          window.open(`https://keepwork.com/u/${data.username}`)
        }
      }]
    }
  }

  static buttons() {
    return {
      callback: {
        async resetPwd(data, that) {
          const params = {
            id: data[0].id,
            password: md5(data[0].value)
          }
          await userModel().update(params)
        }
      }
    }
  }
}
