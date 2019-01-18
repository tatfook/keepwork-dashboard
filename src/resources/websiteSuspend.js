import websiteSuspendModel from '@/models/websiteSuspend'
import BaseResource from './base'

const model = websiteSuspendModel()

export default class websiteSuspend extends BaseResource {
  static attributes() {
    return [
      {
        name: 'objectId',
        alias: 'sitename',
        required: true,
        search: true,
        sort: false,
        associate: 'WebsiteManage',
        associateAs: 'illegalSites',
        associateField: 'sitename'
      },
      {
        name: 'createdAt',
        type: 'Date',
        component: 'time',
        create: false,
        search: false
      },
      {
        name: 'description',
        type: 'String',
        required: true,
        component: 'text',
        sort: false,
        search: false
      },
      {
        name: 'handlerName',
        type: 'String',
        required: true,
        search: false,
        sort: false,
        edit: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show', 'edit', 'destroy'],
      extra: [
        {
          name: 'resources.WebsiteSuspend.button.unblock',
          func: async(row) => {
            await this.api().destroy(row)
          },
          button: 'warning',
          confirm: this.i18nBase('resources.WebsiteSuspend.button.unblockMsg')
        }
      ]
    }
  }
}
