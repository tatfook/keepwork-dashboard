import websiteManageModel from '@/models/websiteManage'
import BaseResource from './base'

const model = websiteManageModel()

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
        filter: (key) => {
          const base = 'keepwork.com/'
          for (const item of levelMap) {
            if (item.key === key) {
              return base + item.value
            }
          }

          return key
        },
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
          func: (ctx, data) => {
            // ctx.$confirm(ctx.$t('resources.WebsiteSuspend.button.unblockMsg'), ctx.$t('resources.WebsiteSuspend.button.unblock'), {
            //   confirmButtonText: ctx.$t('ok'),
            //   cancelButtonText: ctx.$t('cancel'),
            //   type: 'warning'
            // })
            //   .then(async() => {
            //     ctx.$notify({
            //       title: ctx.$t('success'),
            //       message: ctx.$t('unblockSelectedMsg.success'),
            //       type: 'success',
            //       duration: 2000
            //     })
            //     await this.model().destroy(data)
            //     ctx.getList()
            //   })
          }
        }
      ]
    }
  }
}
