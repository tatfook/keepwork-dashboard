import packageTags from '@/models/packageTags'
import BaseResource from './base'
import { resourceCRUD } from '@/api/keepwork'
import _ from 'lodash'
const model = _.merge({}, resourceCRUD('systemTags'), packageTags())

export default class PackageTags extends BaseResource {
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
        search: false
      },
      {
        name: 'extra.sn',
        type: 'Object',
        show: true,
        search: true
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
      disabled: ['show']
    }
  }
}
