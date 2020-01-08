import websiteManageModel from '@/models/websiteManage'
import BaseResource from './base'

const model = websiteManageModel()

export default class websiteManage extends BaseResource {
  static attributes() {
    return [
      {
        name: 'sitename',
        title: true,
        edit: false,
        sort: false,
        search: true
      },
      {
        name: 'siteUrl',
        edit: false,
        sortable: false,
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

  static queryFilter(query) {
    // will include all by default, to make sure every associate works
    query.distinct(true)
    return query
  }
}
