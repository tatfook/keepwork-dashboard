import websiteManageModel from '@/models/websiteManage'
import BaseResource from './base'

const model = websiteManageModel()

// const stateMap = [
//   {
//     key: 0,
//     value: '正常'
//   },
//   {
//     key: 1,
//     value: '封停'
//   }
// ]

export default class websiteManage extends BaseResource {
  static attributes() {
    return [
      // {
      //   name: 'userId',
      //   // show: false,
      //   edit: false,
      //   search: true
      // },
      {
        name: 'displayName',
        edit: false,
        search: true
      },
      {
        name: 'username',
        edit: false,
        search: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        component: 'time',
        edit: false,
        search: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        component: 'time',
        edit: true,
        search: false
      }
      //   type: 'String',
      //   required: true,
      //   component: 'text',
      //   associate: 'User'
      // {
      //   name: 'status',
      //   type: 'Number',
      //   required: true,
      //   component: 'select',
      //   edit: false,
      //   options: stateMap,
      //   filter: (value) => {
      //     for (const option of stateMap) {
      //       if (option.key === value) return option.value
      //     }
      //     return value
      //   },
      //   search: false
      // }
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
