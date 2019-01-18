import websiteManageModel from '@/models/websiteManage'
import BaseResource from './base'

const model = websiteManageModel()

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
        search: false
      },
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
          func: async(ctx, data) => {
            ctx.authority = await ctx.model.checkAuthority(data.id)
            ctx.isVisible = true
          }
        }
      ]
    }
  }
}
