import websiteManageModel from '@/models/websiteManage'
import BaseResource from './base'

const model = websiteManageModel()

// const levelMap = [
// ]

export default class websiteManage extends BaseResource {
  static attributes() {
    return [
      {
        name: 'sitename',
        edit: false,
        sort: false,
        search: true
      },
      {
        name: 'siteUrl',
        edit: false,
        sort: false,
        search: true
      },
      // {
      //   name: 'siteUrl',
      //   edit: false,
      //   filter: (key) => {
      //     const base = 'keepwork.com/'
      //     for (const item of levelMap) {
      //       if (item.key === key) {
      //         return base + item.value
      //       }
      //     }

      //     return key
      //   },
      //   sort: false,
      //   search: false
      // },
      {
        name: 'username',
        edit: false,
        sort: false,
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
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['create', 'show'],
      extra: [
        {
          name: 'resources.WebsiteSuspend.button.privilegeManagement',
          func: (ctx, data) => {
            ctx.authority = data
            ctx.isVisible = true
            ctx.model.checkAuthority(data)
            console.log(1)
            console.log(ctx.model.checkAuthority)
            // console.log(ctx)
            // console.log(data)
          }
        }
      ]
    }
  }
}
