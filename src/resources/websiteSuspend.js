import websiteSuspendModel from '@/models/websiteSuspend'
import BaseResource from './base'

const model = websiteSuspendModel()

export default class websiteSuspend extends BaseResource {
  static attributes() {
    return [
      {
        name: 'sitename',
        originName: 'objectId',
        required: true,
        search: true,
        sort: false,
        edit: true,
        formAssociate: 'sites',
        associate: 'illegalSites',
        associateAs: 'illegalSites',
        associateField: 'sitename'
      },
      {
        name: 'createdAt',
        type: 'Date',
        component: 'time',
        edit: true,
        search: false
      },
      {
        name: 'description',
        type: 'String',
        required: true,
        component: 'text',
        sort: false,
        edit: true
      },
      {
        name: 'handler',
        type: 'Number',
        create: false,
        edit: false,
        sort: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show', 'edit']
    }
  }
}
