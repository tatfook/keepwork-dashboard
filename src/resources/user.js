import BaseResource from './base'
import userModel from '@/models/user'
import md5 from 'blueimp-md5'
import _ from 'lodash'

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

const teacherLevel = [
  {
    key: 0,
    value: 'T0'
  },
  {
    key: 1,
    value: 'T1'
  },
  {
    key: 2,
    value: 'T2'
  },
  {
    key: 3,
    value: 'T3'
  },
  {
    key: 4,
    value: 'T4'
  },
  {
    key: 5,
    value: 'T5'
  }
]

const vipSelected = [{
  key: 0,
  value: '普通用户'
}, {
  key: 1,
  value: 'VIP'
}]

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
        type: 'Number',
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
        name: 'email',
        type: 'String',
        edit: false
      },
      {
        name: 'cellphone',
        type: 'String',
        required: true,
        component: 'text',
        edit: false,
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
        name: 'vip',
        type: Number,
        options: vipSelected,
        component: 'select',
        filter: value => {
          return value > 0 ? 'VIP' : '普通用户'
        },
        edit: true,
        search: true,
        sort: false
      },
      {
        name: 'tLevel',
        type: Number,
        options: teacherLevel,
        component: 'select',
        search: true,
        filter: value => {
          return _.find(teacherLevel, item => item.key === value).value
        }
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
        edit: false,
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
      disabled: ['create', 'show', 'destroy'],
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
              id: row.id,
              rules: [
                { required: true, message: '密码不能为空' },
                { min: 6, message: '最低6个字符', trigger: 'change' }
              ]
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
          if (/^localhost/.test(window.location.host)) {
            console.log('yes')
            return
          }
          if (/^dashboard.keepwork/.test(window.location.host)) {
            window.open(`https://keepwork.com/u/${data.username}`)
            return
          }
          const currentEnv = window.location.host.split('.')[0].split('.')[0].split('-')[1]
          window.open(`https://${currentEnv}.keepwork.com/u/${data.username}`)
        }
      }, {
        name: 'unbindDialog',
        title() {
          return '解绑'
        },
        async func(row, that) {
          that.customRowData = row
          that.showDialog({
            type: 'unbind',
            title: '解绑'
          })
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

  static queryFilter(query) {
    return query
  }
}
