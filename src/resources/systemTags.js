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
        type: 'Object',
        show: true,
        edit: true,
        search: false
      },
      {
        name: 'extra.username',
        type: 'Object',
        show: true,
        edit: false,
        search: false
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
      disabled: ['show', 'edit']
    }
  }
}
