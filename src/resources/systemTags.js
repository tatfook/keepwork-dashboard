import systemTagsModel from '@/models/systemTags'
import BaseResource from './base'

const model = systemTagsModel()

export default class SystemTags extends BaseResource {
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
        name: 'classify',
        type: 'Number',
        show: false,
        edit: false,
        search: false
      },
      {
        name: 'tagname',
        type: 'String',
        show: true,
        edit: true,
        search: true
      },
      {
        name: 'extra.enTagname',
        modelName: 'enTagname',
        isNested: true,
        type: 'String',
        show: true,
        edit: true,
        search: false
      },
      {
        name: 'extra.username',
        modelName: 'username',
        type: 'String',
        isNested: true,
        show: true,
        edit: false,
        search: false
      },
      {
        name: 'extra.sn',
        modelName: 'sn',
        type: 'Number',
        isNested: true,
        show: true,
        edit: true
      },
      {
        name: 'createdAt',
        type: 'Date',
        show: true,
        edit: false,
        search: false
      },
      {
        name: 'updatedAt',
        type: 'Date',
        show: true,
        edit: false,
        search: false
      }
    ]
  }

  static model() {
    return model
  }

  static actions() {
    return {
      disabled: ['show']
    }
  }
}
